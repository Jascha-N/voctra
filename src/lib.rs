#![feature(plugin, custom_derive)]
#![plugin(rocket_codegen)]
#![allow(dead_code)]

extern crate base64;
extern crate bcrypt;
#[macro_use] extern crate diesel;
#[macro_use] extern crate diesel_codegen;
#[macro_use] extern crate error_chain;
#[macro_use] extern crate log;
extern crate r2d2;
extern crate r2d2_diesel;
extern crate rand;
#[macro_use] extern crate rocket;
extern crate serde;
#[macro_use] extern crate serde_derive;
extern crate serde_json;
extern crate sha2;
extern crate toml;
extern crate uuid;

pub use error::*;

use db::Database;
use json::Json;
use rocket::State;
use rocket::config::Config as RocketConfig;
use rocket::request::Form;
use rocket::http::{Cookie, Cookies};
use rocket::response::NamedFile;
use settings::Settings;
use sha2::{Digest, Sha256};
use std::fs::File;
use std::io::Read;
use std::path::PathBuf;

pub mod settings;

mod db;
mod error;
mod json;

#[derive(FromForm)]
struct AuthArgs {
    name: String,
    password: String
}

#[derive(Serialize)]
struct AuthResult {
    status: String,
    message: String
}

#[post("/authenticate", data = "<user>")]
fn authenticate(user: Form<AuthArgs>, db: State<Database>, cookies: &Cookies) -> Result<Json<AuthResult>> {
    let user = user.into_inner();
    let result = if !db.auth_user(&user.name, &user.password)? {
        cookies.add(Cookie::new("message", "blarp"));
        AuthResult {
            status: "ok".to_string(),
            message: "Authentication complete.".to_string()
        }
    } else {
        AuthResult {
            status: "error:authentication".to_string(),
            message: "Wrong login credentials supplied.".to_string()
        }
    };
    Ok(Json::new(result))
}

// #[get("/users")]
// fn list_users(db: State<Database>) -> Result<JSON<Vec<User>>> {
//     db.connection()?.list_users().map(JSON)
// }

// #[derive(FromForm)]
// struct NewUser {
//     name: String,
//     password: String
// }

// #[post("/users/add", data = "<user>")]
// fn add_user(user: Form<NewUser>, db: State<Database>) -> Result<String> {
//     let user = user.into_inner();
//     db.connection()?.add_user(&user.name, &user.password)?;
//     Ok(format!("{} was added succesfully.", &user.name))
// }

// #[derive(FromForm)]
// struct VocabularyArgs {
//     name: String
// }

// #[get("/api/vocabulary?<args>")]
// fn vocabulary(args: VocabularyArgs) -> Option<NamedFile> {
//     NamedFile::open(Path::new("www/vocabularies").join(args.name).join("vocabulary.json")).ok()
// }

// #[get("/api/vocabularies")]
// fn vocabulary_list() -> JSON<Vec<(String, String)>> {
//     match fs::read_dir(Path::new("www/vocabularies")) {
//         Err(_) => JSON(Vec::new()),
//         Ok(entries) => {
//             let vocabularies = entries.filter_map(|entry| entry.ok())
//                                       .filter(|entry| entry.path().is_dir())
//                                       .filter_map(|entry| entry.file_name().into_string().ok())
//                                       .map(|name| (name.clone(), format!("/vocabularies/{}", name)))
//                                       .collect::<Vec<_>>();
//             JSON(vocabularies)
//         }
//     }
// }

#[get("/")]
fn index(settings: State<Settings>) -> Option<NamedFile> {
    assets(PathBuf::from("index.html"), settings)
}

#[get("/<path..>")]
fn assets(path: PathBuf, settings: State<Settings>) -> Option<NamedFile> {
    NamedFile::open(settings.http.www_root.join(path)).ok()
}

pub fn run(settings: Settings) -> Result<()> {
    let db = Database::new(&settings.database)?;

    let mut config = RocketConfig::new(settings.environment).chain_err(|| "Could not create rocket configuration")?;
    config.set_log_level(settings.logging);
    config.set_address(settings.http.address.clone()).chain_err(|| "Could not set server address")?;
    config.set_port(settings.http.port);
    if let Some(worker_threads) = settings.http.worker_threads {
        config.set_workers(worker_threads);
    }
    if let Some(ref session_key_file) = settings.http.session_key_file {
        let mut file = File::open(session_key_file).chain_err(|| "Could not open session key file")?;
        let mut buffer = Vec::new();
        file.read_to_end(&mut buffer).chain_err(|| "Could not read session key file")?;
        let hash = Sha256::digest(&buffer);
        let trunc_hash = &hash[..(192 / 8) - 1];
        config.set_session_key(base64::encode(trunc_hash)).chain_err(|| "Could not set session key")?;
    }

    rocket::custom(config, true)
           .mount("/", routes![index, assets])
           .mount("/api", routes![authenticate])
           .manage(db)
           .manage(settings)
           .launch();

    Ok(())
}
