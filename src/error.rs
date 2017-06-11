use rocket::http::Status;
use rocket::response::{Responder, Response};
use std::result::Result as StdResult;

error_chain! {
    errors {
        DuplicateUser
    }
}

impl<'r> Responder<'r> for Error {
    fn respond(self) -> StdResult<Response<'r>, Status> {
        match *self.kind() {
            ErrorKind::DuplicateUser => "User already exists".respond(),
            _ => Err(Status::InternalServerError)
        }
    }
}
