#[macro_use] extern crate clap;
#[macro_use] extern crate error_chain;
extern crate voctra;

#[cfg(unix)] #[macro_use] extern crate chan;
#[cfg(unix)] extern crate chan_signal;
#[cfg(unix)] extern crate libc;
#[cfg(unix)] extern crate nix;
#[cfg(unix)] extern crate users;

use clap::{App, AppSettings, Arg};
use std::path::Path;
use voctra::Result;
use voctra::settings::Settings;

#[cfg(unix)]
mod imp {
    use super::*;

    use chan_signal::Signal;
    use clap::{ArgMatches, SubCommand};
    use nix::fcntl::{self, FlockArg};
    use nix::sys::stat::{self, Mode};
    use nix::sys::signal;
    use nix::unistd;
    use voctra::{Error, Result, ResultExt};
    use std::env;
    use std::fs::{self, File, OpenOptions};
    use std::io::{Read, Write};
    use std::mem;
    use std::os::unix::io::{AsRawFd, FromRawFd};
    use std::path::PathBuf;
    use std::process;
    use std::thread::{self, Builder};
    use std::time::{Duration, Instant};
    use voctra::settings::Daemon as DaemonSettings;

    struct PidFile {
        file: File,
        path: PathBuf
    }

    impl PidFile {
        fn create(path: PathBuf) -> Result<PidFile> {
            let file = OpenOptions::new()
                                   .create(true)
                                   .write(true)
                                   .open(&path)
                                   .chain_err(|| "Could not open PID file")?;

            fcntl::flock(file.as_raw_fd(), FlockArg::LockExclusiveNonblock)
                  .chain_err(|| "Could not lock PID file; is the daemon already running?")?;

            Ok(PidFile { file, path })
        }

        fn write_pid(&mut self, pid: libc::pid_t) -> Result<()> {
            writeln!(&mut self.file, "{}", pid).chain_err(|| "Could not write PID file")?;
            self.file.flush().chain_err(|| "Could not flush PID file")
        }
    }

    impl Drop for PidFile {
        fn drop(&mut self) {
            //mem::drop(self.file);
            let _ = fs::remove_file(&self.path);
        }
    }

    fn daemonize(settings: &DaemonSettings) -> Result<PidFile> {
        let mut pid_file = PidFile::create(settings.pid_file.clone())?;

        // Create pipes
        let (pipe_parent_fd, pipe_child_fd) = unistd::pipe().chain_err(|| "Could not create pipe")?;
        let (mut pipe_parent, mut pipe_child) = unsafe {
            (File::from_raw_fd(pipe_parent_fd), File::from_raw_fd(pipe_child_fd))
        };

        // Fork
        if unistd::fork().chain_err(|| "Could not perform first fork")?.is_parent() {
            mem::drop(pipe_child);
            // Wait for child process to send sentinel value indicating succesfull initialization
            pipe_parent.read_exact(&mut [0; 1]).chain_err(|| "Daemon process did not notify starter process")?;
            process::exit(0);
        }
        mem::drop(pipe_parent);

        // Create new session
        unistd::setsid().chain_err(|| "Could not create new session")?;

        // Set umask
        if let Some(umask) = settings.umask {
            let mode = Mode::from_bits(umask).ok_or_else(|| "Invalid umask mode specified")?;
            stat::umask(mode);
        }

        // Set current working directory
        if let Some(ref cwd) = settings.cwd {
            if cwd.is_relative() {
                bail!("`daemon.cwd` needs to be an absolute path");
            }
            env::set_current_dir(cwd).chain_err(|| "Could not change the current directory")?;
        }

        // Fork again
        if unistd::fork().chain_err(|| "Could not perform second fork")?.is_parent() {
            process::exit(0);
        }

        // Perform setgid
        if let Some(ref group) = settings.group {
            let gid = users::get_group_by_name(&group)
                            .ok_or_else(|| Error::from("Could not find group"))?
                            .gid();

            unistd::setgid(gid).chain_err(|| "Could not set GID")?;
        }

        // Perform setuid
        if let Some(ref user) = settings.user {
            let user = users::get_user_by_name(&user)
                             .ok_or_else(|| Error::from("Could not find user"))?;

            let uid = user.uid();
            if settings.group.is_none() {
                unistd::setgid(user.primary_group_id()).chain_err(|| "Could not set GID")?;
            };

            unistd::setuid(uid).chain_err(|| "Could not set UID")?;
        }

        // Write PID to file
        pid_file.write_pid(unistd::getpid())?;

        // Redirect STDIN to /dev/null
        let dev_null = File::open("/dev/null").chain_err(|| "Could not open `/dev/null`")?;
        unistd::dup2(dev_null.as_raw_fd(), libc::STDIN_FILENO).chain_err(|| "Could not redirect STDIN")?;
        mem::drop(dev_null);

        // Redirect STDOUT and STDERR if required
        if let Some(ref log_file_path) = settings.log_file {
            let log = OpenOptions::new()
                                  .append(true)
                                  .create(true)
                                  .open(log_file_path)
                                  .chain_err(|| "Could not open log file")?;

            unistd::dup2(log.as_raw_fd(), libc::STDOUT_FILENO).chain_err(|| "Could not redirect STDOUT")?;
            unistd::dup2(log.as_raw_fd(), libc::STDERR_FILENO).chain_err(|| "Could not redirect STDERR")?;
        }

        // Notify the parent that the child process is done initializing
        let _ = pipe_child.write(&[0]);

        Ok(pid_file)
    }

    fn start(settings: Settings) -> Result<()> {
        let _pid_file = daemonize(&settings.daemon)?;

        let signal = chan_signal::notify(&[Signal::INT, Signal::TERM, Signal::QUIT]);
        let (sdone, rdone) = chan::sync(0);
        Builder::new().name("server".to_string()).spawn(move || {
            sdone.send(voctra::run(settings));
        }).chain_err(|| "Could not start server thread")?;

        let result;
        chan_select! {
            signal.recv() -> signal => {
                println!("Caught signal: {:?}; stopping daemon", signal.unwrap());
                result = Ok(());
            },
            rdone.recv() -> thread_result => {
                result = thread_result.unwrap_or_else(|| Err(Error::from("Server thread panicked")));
            }
        }
        result
    }

    fn stop(settings: Settings) -> Result<()> {
        let mut pid_file = File::open(&settings.daemon.pid_file)
                                .chain_err(|| "Could not open PID file; is the daemon running?")?;
        let mut pid_buf = String::new();
        pid_file.read_to_string(&mut pid_buf).chain_err(|| "Could not read PID")?;
        let pid = pid_buf.trim().parse().chain_err(|| "Could not parse PID")?;

        signal::kill(pid, Some(signal::SIGTERM)).chain_err(|| "Could not stop the daemon")?;
        if settings.daemon.stop_timeout > 0 {
            let stopped_at = Instant::now();
            while signal::kill(pid, None).is_ok() {
                if Instant::now().duration_since(stopped_at).as_secs() >= settings.daemon.stop_timeout as u64 {
                    bail!("Time-out waiting for daemon to stop");
                }
                thread::sleep(Duration::from_millis(100));
            }
        }
        Ok(())
    }

    pub fn args<'a, 'b>(app: App<'a, 'b>) -> ArgMatches<'a> {
        let pid_file_arg = Arg::with_name("PID_FILE")
                               .long("pid-file")
                               .short("p")
                               .takes_value(true)
                               .help("Path of PID file");

        app.subcommand(SubCommand::with_name("start")
               .about("Start daemon")
               .arg(pid_file_arg.clone()))
           .subcommand(SubCommand::with_name("stop")
               .about("Stop daemon")
               .arg(pid_file_arg))
           .get_matches()
    }

    pub fn run(mut settings: Settings, args: ArgMatches) -> Result<()> {
        if let Some(matches) = args.subcommand_matches("start") {
            if let Some(pid_file_path) = matches.value_of("PID_FILE") {
                settings.daemon.pid_file = PathBuf::from(pid_file_path);
            }
            start(settings)
        } else if let Some(matches) = args.subcommand_matches("stop") {
            if let Some(pid_file_path) = matches.value_of("PID_FILE") {
                settings.daemon.pid_file = PathBuf::from(pid_file_path);
            }
            stop(settings)
        } else {
            voctra::run(settings)
        }
    }
}

#[cfg(not(unix))]
mod imp {
    use super::*;
    use clap::ArgMatches;

    pub fn args<'a, 'b>(app: App<'a, 'b>) -> ArgMatches<'a> {
        app.get_matches()
    }

    pub fn run(settings: Settings, _: ArgMatches) -> Result<()> {
        voctra::run(settings)
    }
}

fn run() -> Result<()> {
    let app = App::new("voctra")
                  .version(crate_version!())
                  .author(crate_authors!("\n"))
                  .about("voctra web application")
                  .global_setting(AppSettings::VersionlessSubcommands)
                  .arg(Arg::with_name("CONFIG")
                      .long("config-file")
                      .short("c")
                      .takes_value(true)
                      .help("Path of configuration file to use"))
                  .arg(Arg::with_name("print_default_config")
                      .long("print-default-config")
                      .help("Print the default configuration"));

    let args = imp::args(app);

    if args.is_present("print_default_config") {
        print!("{}", Settings::default());
        return Ok(());
    }

    let settings = if let Some(config_path) = args.value_of("CONFIG") {
        Settings::from_file(Path::new(config_path))?
    } else {
        Settings::default()
    };

    imp::run(settings, args)
}

quick_main!(run);
