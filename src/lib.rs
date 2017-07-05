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
#[macro_use] extern crate rocket;
extern crate serde;
#[macro_use] extern crate serde_derive;
extern crate serde_json;
extern crate toml;

use db::{PooledDatabase, UnpooledDatabase, Users};
use error::*;
use rocket::config::Config as RocketConfig;
use secret::SecretKey;
use settings::Settings;

pub mod error;
pub mod settings;

mod api;
mod db;
mod json;
mod secret;
#[path = "static.rs"] mod static_;

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

    let mut config = RocketConfig::new(settings.http.rocket_env).chain_err(|| "Could not create rocket configuration")?;
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

    rocket::custom(config, false)
           .mount("/", static_::routes())
           .mount("/api", api::routes())
           .manage(db)
           .manage(settings)
           .manage(secret_key)
           .launch();

    Ok(())
}
