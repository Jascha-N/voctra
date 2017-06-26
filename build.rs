extern crate diesel;
extern crate walkdir;

use diesel::Connection;
use diesel::migrations;
use diesel::sqlite::SqliteConnection;
use std::env;
use std::fs;
use std::path::{Path, PathBuf};
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
    let release = &env::var_os("PROFILE").unwrap() == "release";
    let out = PathBuf::from(env::var_os("OUT_DIR").unwrap());
    let temp_db = out.join("temp.sqlite").into_os_string().into_string().unwrap();

    println!("Creating temporary database `{}`.", temp_db);
    let connection = SqliteConnection::establish(&temp_db)
                                      .expect("Could not establish database connection");
    println!("Applying migrations.");
    migrations::run_pending_migrations(&connection).expect("Could not run migrations");

    let src_root = Path::new("client/static");
    let dst_root = Path::new("www");

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

    println!("Linting.");
    shell_exec("yarn run lint", "client");

    println!("Building.");
    if release {
        shell_exec("yarn run build -- -p", "client");
    } else {
        shell_exec("yarn run build -- -d", "client");
    }

    println!("Printing cargo metadata.");
    println!("cargo:rustc-env=DEV_DATABASE_URL={}", temp_db);
    println!("cargo:rerun-if-changed=client/");
    println!("cargo:rerun-if-changed=migrations/");
}
