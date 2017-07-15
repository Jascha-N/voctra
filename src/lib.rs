#![feature(plugin, custom_derive)]
#![plugin(rocket_codegen)]
#![allow(dead_code, needless_pass_by_value, unknown_lints)]

extern crate base64;
extern crate bcrypt;
#[macro_use] extern crate diesel;
#[macro_use] extern crate diesel_codegen;
extern crate chrono;
#[macro_use] extern crate error_chain;
extern crate jsonwebtoken;
#[macro_use] extern crate log;
extern crate log4rs;
extern crate r2d2;
extern crate r2d2_diesel;
extern crate rand;
extern crate rocket;
extern crate rocket_contrib;
extern crate serde;
#[macro_use] extern crate serde_derive;
extern crate serde_json;
extern crate toml;

use db::{PooledDatabase, UnpooledDatabase, Users};
use error::*;
use log::LogLevel;
use rocket::{Config, Request, Response};
use rocket::fairing::{Fairing, Kind, Info};
use secret::SecretKey;
use settings::Settings;
use std::fmt::Write;

pub mod error;
pub mod settings;

mod api;
mod db;
mod secret;
#[path = "static.rs"] mod static_;

struct Logger;

impl Fairing for Logger {
    fn info(&self) -> Info {
        Info {
            name: "logger",
            kind: Kind::Response
        }
    }

    // fn on_request(&self, request: &mut Request, data: &Data) {
    //     info!(target: "requests", "{}", request);
    // }

    fn on_response(&self, request: &Request, response: &mut Response) {
        if log_enabled!(LogLevel::Info) {
            let mut message = String::new();
            if let Some(remote_addr) = request.remote() {
                write!(message, "{}", remote_addr).unwrap();
            } else {
                message.push_str("<?>");
            }
            write!(message, r#" "{} {}""#, request.method(), request.uri()).unwrap();
            message.push_str(" => ");
            write!(message, r#""{}""#, response.status()).unwrap();
            if let Some(content_type) = response.content_type() {
                write!(message, r#" "{}""#, content_type).unwrap();
            }
            info!(target: "voctra::access", "{}", message);
        }
    }
}

pub fn list_users(settings: Settings) -> Result<()> {
    let db = UnpooledDatabase::new(&settings.database)?;
    let users = db.list_users()?;
    for user in users {
        println!("{}", user.name);
    }
    Ok(())
}

pub fn add_user(settings: Settings, username: &str, password: &str) -> Result<()> {
    let db = UnpooledDatabase::new(&settings.database)?;
    db.add_user(username, password)
}

pub fn run(settings: Settings) -> Result<()> {
    let db = PooledDatabase::new(&settings.database)?;

    let mut config = Config::new(settings.http.rocket_env).chain_err(|| "Could not create rocket configuration")?;
    config.set_address(settings.http.address.clone()).chain_err(|| "Could not set server address")?;
    config.set_port(settings.http.port);
    if let Some(worker_threads) = settings.http.worker_threads {
        config.set_workers(worker_threads);
    }

    let secret_key = if let Some(ref key_file) = settings.http.key_file {
        SecretKey::from_file(key_file)?
    } else {
        warn!("Using a randomly generated secret; consider specifiying a key file.");
        SecretKey::new()?
    };

    let error = rocket::custom(config, false)
                       .mount("/", static_::routes())
                       .mount("/api", api::routes())
                       .attach(Logger)
                       .manage(db)
                       .manage(settings)
                       .manage(secret_key)
                       .launch();

    Err(error).chain_err(|| "Could not launch Rocket")
}
