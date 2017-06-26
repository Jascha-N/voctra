use rocket::http::Status;
use rocket::response::{Responder, Response};
use rocket::response::content::JSON as JsonContent;
use serde::Serialize;
use serde_json;

pub struct Json<T>(T);

impl<T> Json<T> {
    pub fn new(inner: T) -> Json<T> {
        Json(inner)
    }
}

impl<'r, T: Serialize> Responder<'r> for Json<T> {
     fn respond(self) -> Result<Response<'r>, Status> {
        let json = serde_json::to_string(&self.0).map_err(|error| {
            error_!("Could not serialize JSON: {}", error);
            Status::InternalServerError
        })?;

        JsonContent(json).respond()
     }
}
