use rocket::http::Status;
use rocket::response::{Responder, Response};
use rocket_contrib::JSON;
use std::result::Result as StdResult;

error_chain! {
    errors {
        Authentication
        DuplicateUser
    }
}

impl<'r> Responder<'r> for Error {
    fn respond(self) -> StdResult<Response<'r>, Status> {
        match *self.kind() {
            ErrorKind::Authentication => {
                let response = ErrorResponse {
                    status: "authentication",
                    message: "Wrong login credentials."
                };
                Response::build_from(JSON(response).respond()?).status(Status::Unauthorized).ok()
            }
            ErrorKind::DuplicateUser => {
                let response = ErrorResponse {
                    status: "duplicate-user",
                    message: "A user with that name already exists."
                };
                Response::build_from(JSON(response).respond()?).status(Status::BadRequest).ok()
            },
            _ => Err(Status::InternalServerError)
        }
    }
}

#[derive(Serialize)]
struct ErrorResponse<'a> {
    status: &'a str,
    message: &'a str
}
