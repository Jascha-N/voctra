#![feature(plugin, custom_derive)]
#![plugin(rocket_codegen)]

extern crate bcrypt;
#[macro_use] extern crate diesel;
#[macro_use] extern crate diesel_codegen;
extern crate dotenv;
#[macro_use] extern crate error_chain;
extern crate r2d2;
extern crate r2d2_diesel;
extern crate rand;
extern crate rocket;
extern crate rocket_contrib;
extern crate serde;
#[macro_use] extern crate serde_derive;
extern crate uuid;

use db::{Database, User};
use error::*;
use rocket::State;
use rocket::http::hyper::header::Encoding;
use rocket::request::Form;
use rocket::response::{NamedFile, Response};
use rocket_contrib::JSON;
use std::env;
use std::path::{Path, PathBuf};

mod db;
mod error;



#[get("/users")]
fn list_users(db: State<Database>) -> Result<JSON<Vec<User>>> {
    db.connection()?.list_users().map(JSON)
}

#[derive(FromForm)]
struct NewUser {
    name: String,
    password: String
}

#[post("/users/add", data = "<user>")]
fn add_user(user: Form<NewUser>, db: State<Database>) -> Result<String> {
    let user = user.into_inner();
    db.connection()?.add_user(&user.name, &user.password)?;
    Ok(format!("{} was added succesfully.", &user.name))
}

#[get("/")]
fn index() -> Option<NamedFile> {
    files(PathBuf::from("index.html"))
}

#[get("/<path..>", rank = 2)]
fn files(path: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("www").join(path)).ok()
}

fn run() -> Result<()> {
    let _ = dotenv::dotenv();
    let db_url = env::var("DATABASE_URL").chain_err(|| "DATABASE_URL must be set")?;
    let db = Database::new(&db_url)?;

    rocket::ignite()
           .mount("/", routes![add_user, files, index, list_users])
           .manage(db)
           .launch();

    Ok(())
}

quick_main!(run);
