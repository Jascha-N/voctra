extern crate walkdir;

use std::env;
use std::fs;
use std::path::Path;
use std::process::Command;
use walkdir::WalkDir;

fn shell_exec<P: AsRef<Path>>(command: &str, cwd: P) {
    let mut shell = match () {
        #[cfg(windows)]
        () => {
            let mut shell = Command::new("cmd");
            shell.arg("/C");
            shell
        }
        #[cfg(not(windows))]
        () => {
            let mut shell = Command::new("sh");
            shell.arg("-c");
            shell
        }
    };
    let status = shell.arg(command).current_dir(cwd).status().expect(&format!("Could not run `{}`", command));
    if !status.success() {
        panic!("`{}` exited with {}", command, status);
    }
}

fn main() {
    let release = env::var("PROFILE").unwrap() == "release";

    let src_root = Path::new("client/public");
    let dst_root = Path::new("web");

    let _ = fs::remove_dir_all(dst_root);

    for entry in WalkDir::new(src_root) {
        let entry = entry.unwrap();
        let src = entry.path();
        let suffix = src.strip_prefix(src_root).unwrap();
        let dst = dst_root.join(suffix);
        if entry.file_type().is_file() {
            println!("Copying `{}` -> `{}`.", src.display(), dst.display());
            fs::copy(src, dst).expect("Could not copy file");
        } else {
            println!("Creating directory `{}`.", dst.display());
            fs::create_dir(dst).expect("Could not create directory");
        }
    }

    println!("Installing client dependencies.");
    shell_exec("yarn install --check-files", "client");

    println!("Running webpack.");
    if release {
        shell_exec("yarn run webpack -- -p", "client");
    } else {
        shell_exec("yarn run webpack -- -d", "client");
    }
}
