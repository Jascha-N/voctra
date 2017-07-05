use api::ApiResponse;
use rocket::http::Status;
use rocket::response::{Responder, Response};
use rocket::response::status::Custom;
use std::result::Result as StdResult;

error_chain! {
    errors {
        InvalidCredentials {
            display("Invalid login credentials were supplied")
            description("invalid credentials")
        }
        UserAlreadyExists(name: String) {
            display("A user named `{}` already exists", name)
            description("user already exists")
        }
    }
}

impl<'r> Responder<'r> for Error {
    fn respond(self) -> StdResult<Response<'r>, Status> {
        match *self.kind() {
            ErrorKind::InvalidCredentials => {
                let response = ApiResponse::err("authentication", &self);
                Custom(Status::Unauthorized, response).respond()
            }
            ErrorKind::UserAlreadyExists(..) => {
                let response = ApiResponse::err("user-already-exists", &self);
                Custom(Status::BadRequest, response).respond()
            },
            _ => Err(Status::InternalServerError)
        }
    }
}
