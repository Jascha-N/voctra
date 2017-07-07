#![allow(unmounted_route)]

use db::{PooledDatabase, Users};
use chrono::{Duration, Utc};
use error::*;
use json::Json;
use jsonwebtoken::{self, Algorithm, Header};
use rocket::{Route, State};
use rocket::http::Status;
use rocket::request::Form;
use rocket::response::{Responder, Response};
use secret::SecretKey;
use serde::Serialize;
use std::result::Result as StdResult;

#[derive(Serialize)]
#[serde(untagged)]
pub enum ApiResponse<T> {
    Ok {
        status: String,
        payload: Option<T>
    },
    Err {
        status: String,
        message: String
    }
}

impl<T> ApiResponse<T> {
    pub fn ok(payload: Option<T>) -> ApiResponse<T> {
        ApiResponse::Ok {
            status: String::from("ok"),
            payload
        }
    }
}

impl ApiResponse<()> {
    pub fn err(status: &str, error: &Error) -> ApiResponse<()> {
        ApiResponse::Err {
            status: format!("error:{}", status),
            message: error.to_string()
        }
    }
}

impl<'r, T: Serialize> Responder<'r> for ApiResponse<T> {
    fn respond(self) -> StdResult<Response<'r>, Status> {
        Json::new(self).respond()
    }
}

#[derive(Deserialize, Serialize)]
struct JwtClaims {
    sub: String,
    exp: i64
}

#[derive(FromForm)]
struct AuthArgs {
    name: String,
    password: String
}

#[derive(Serialize)]
struct AuthResponse {
    jwt: String,
}

impl<'r> Responder<'r> for AuthResponse {
    fn respond(self) -> StdResult<Response<'r>, Status> {
        ApiResponse::ok(Some(self)).respond()
    }
}

#[post("/authenticate", data = "<user>")]
fn authenticate(user: Form<AuthArgs>, db: State<PooledDatabase>, key: State<SecretKey>) -> Result<AuthResponse> {
    let user = user.into_inner();
    db.auth_user(&user.name, &user.password)?;

    let exp = Utc::now() + Duration::days(7);
    let claims = JwtClaims {
        sub: user.name,
        exp: exp.timestamp()
    };
    let jwt = jsonwebtoken::encode(&Header::new(Algorithm::HS256), &claims, &key[..])
        .chain_err(|| "Could not create JWT")?;

    Ok(AuthResponse { jwt: jwt })
}

pub fn routes() -> Vec<Route> {
    routes![authenticate]
}
