use log::LogLevel;
use rocket::{Request, Response};
use rocket::fairing::{Fairing, Kind, Info};
use std::fmt::Write;

#[macro_export]
macro_rules! voctra_log {
    ($expr:expr) => {{
        trait Loggable {
            fn log(&self);
        }

        impl Loggable for $crate::error::Error {
            fn log(&self) {
                if log_enabled!(::log::LogLevel::Error) {
                    error!("{}.", self);
                    for cause in self.iter().skip(1) {
                        error!(target: "<cause>", "{}.", cause);
                    }
                }
            }
        }

        impl<T> Loggable for $crate::error::Result<T> {
            fn log(&self) {
                if let Err(ref error) = *self {
                    error.log();
                }
            }
        }

        fn log<L: Loggable>(l: &L) {
            l.log();
        }

        log(&$expr);
    }};
}

pub struct AccessLogger;

impl Fairing for AccessLogger {
    fn info(&self) -> Info {
        Info {
            name: "logger",
            kind: Kind::Response
        }
    }

    fn on_response(&self, request: &Request, response: &mut Response) {
        if log_enabled!(LogLevel::Info) {
            let mut message = String::new();
            if let Some(remote_addr) = request.remote() {
                write!(message, "{}", remote_addr).unwrap();
            } else {
                message.push_str("<?>");
            }
            write!(message, r#" "{} {}""#, request.method(), request.uri()).unwrap();
            message.push_str(" => ");
            write!(message, r#""{}""#, response.status()).unwrap();
            if let Some(content_type) = response.content_type() {
                write!(message, r#" "{}""#, content_type).unwrap();
            }
            info!(target: "voctra::access", "{}", message);
        }
    }
}
