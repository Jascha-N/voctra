#![feature(plugin)]
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

use db::ConnectionPool;
use db::users::{self, User};
use error::*;
use rocket::State;
use rocket::response::NamedFile;
use rocket_contrib::JSON;
use std::env;
use std::path::{Path, PathBuf};

mod db;
mod error;



#[get("/users")]
fn list_users(pool: State<ConnectionPool>) -> Result<JSON<Vec<User>>> {
    let connection = pool.get().chain_err(|| "No available database connection")?;

    users::list(&*connection).map(JSON)
}

#[get("/users/add/<name>/<password>")]
fn add_user(name: String, password: String, pool: State<ConnectionPool>) -> Result<String> {
    let connection = pool.get().chain_err(|| "No available database connection")?;

    users::add(&*connection, &name, &password).map(|_| format!("{} was added succesfully.", name))
}

#[get("/")]
fn index() -> Result<NamedFile> {
    NamedFile::open("web/index.html").chain_err(|| "Could not open index.html")
}

#[get("/<path..>", rank = 2)]
fn files(path: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("web").join(path)).ok()
}

fn run() -> Result<()> {
    dotenv::dotenv().unwrap();
    let db_url = env::var("DATABASE_URL").chain_err(|| "DATABASE_URL must be set")?;
    let db_pool = db::create_connection_pool(&db_url)?;

    rocket::ignite()
           .mount("/", routes![add_user, files, index, list_users])
           .manage(db_pool)
           .launch();

    Ok(())
}

quick_main!(run);
