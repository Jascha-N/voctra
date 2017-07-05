#![allow(unmounted_route)]

use rocket::{Route, State};
use rocket::response::NamedFile;
use settings::Settings;
use std::path::PathBuf;

#[get("/")]
fn index(settings: State<Settings>) -> Option<NamedFile> {
    assets(PathBuf::from("index.html"), settings)
}

#[get("/<path..>")]
fn assets(path: PathBuf, settings: State<Settings>) -> Option<NamedFile> {
    NamedFile::open(settings.http.web_root.join(path)).ok()
}

pub fn routes() -> Vec<Route> {
    routes![index, assets]
}
