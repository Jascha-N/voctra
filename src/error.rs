use api::ApiResponse;
use rocket::http::Status;
use rocket::request::Request;
use rocket::response::{Responder, Response};
use rocket::response::status::Custom;
use std::result;

error_chain! {
    errors {
        DatabaseUnavailable {
            display("Database access is unavailable at the moment")
            description("database unavailable")
        }
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
    fn respond_to(self, request: &Request) -> result::Result<Response<'r>, Status> {
        voctra_log!(self);
        match *self.kind() {
            ErrorKind::InvalidCredentials => {
                let response = ApiResponse::err("authentication", &self);
                Custom(Status::Unauthorized, response).respond_to(request)
            }
            ErrorKind::DatabaseUnavailable => Err(Status::ServiceUnavailable),
            _ => Err(Status::InternalServerError)
        }
    }
}
