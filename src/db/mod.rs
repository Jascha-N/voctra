use error::*;
use r2d2::{Config, Pool};
use r2d2_diesel::ConnectionManager;

mod schema;
pub mod users;
pub mod auth;

pub type Connection = ::diesel::sqlite::SqliteConnection;
pub type ConnectionPool = Pool<ConnectionManager<Connection>>;

pub fn create_connection_pool(database_url: &str) -> Result<ConnectionPool> {
    let config = Config::default();
    let manager = ConnectionManager::<Connection>::new(database_url);
    Pool::new(config, manager).chain_err(|| "Failed to create connection pool")
}
