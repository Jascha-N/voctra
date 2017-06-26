use error::*;
use r2d2::{Pool, PooledConnection};
use r2d2_diesel::ConnectionManager;
use settings::Database as DatabaseSettings;
use std::io;

pub use self::users::User;

mod schema;
mod users;



embed_migrations!();

#[cfg(feature = "sqlite")]
type Connection = ::diesel::sqlite::SqliteConnection;

#[cfg(feature = "postgres")]
type Connection = ::diesel::pg::PgConnection;

#[cfg(feature = "mysql")]
type Connection = ::diesel::mysql::MysqlConnection;

pub struct Database {
    pool: Pool<ConnectionManager<Connection>>
}

impl Database {
    pub fn new(settings: &DatabaseSettings) -> Result<Database> {
        let config = settings.r2d2_config()?;
        let manager = ConnectionManager::<Connection>::new(settings.url.clone());
        let pool = Pool::new(config, manager).chain_err(|| "Failed to create connection pool")?;
        let db = Database { pool };

        embedded_migrations::run_with_output(&*db.connection()?, &mut io::stderr())
            .chain_err(|| "Could not run migrations")?;

        Ok(db)
    }

    fn connection(&self) -> Result<PooledConnection<ConnectionManager<Connection>>> {
        self.pool.get().chain_err(|| "Could not obtain database connection")
    }

    pub fn list_users(&self) -> Result<Vec<User<'static>>> {
        users::list(&*self.connection()?)
    }

    pub fn add_user(&self, name: &str, password: &str) -> Result<()> {
        users::add(&*self.connection()?, name, password)
    }

    pub fn auth_user(&self, name: &str, password: &str) -> Result<bool> {
        users::authenticate(&*self.connection()?, name, password)
    }
}
