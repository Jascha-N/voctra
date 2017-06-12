use error::*;
use r2d2::{Config, Pool, PooledConnection};
use r2d2_diesel::ConnectionManager;

pub use self::users::User;

mod schema;
mod users;



type RawConnection = ::diesel::sqlite::SqliteConnection;

pub struct Connection {
    connection: PooledConnection<ConnectionManager<RawConnection>>
}

impl Connection {
    fn new(connection: PooledConnection<ConnectionManager<RawConnection>>) -> Connection {
        Connection { connection }
    }

    pub fn list_users(&self) -> Result<Vec<User<'static>>> {
        users::list(&self.connection)
    }

    pub fn add_user(&self, name: &str, password: &str) -> Result<()> {
        users::add(&self.connection, name, password)
    }

    pub fn auth_user(&self, name: &str, password: &str) -> Result<bool> {
        users::authenticate(&self.connection, name, password)
    }
}

pub struct Database {
    pool: Pool<ConnectionManager<RawConnection>>
}

impl Database {
    pub fn new(url: &str) -> Result<Database> {
        let config = Config::default();
        let manager = ConnectionManager::<RawConnection>::new(url);
        let pool = Pool::new(config, manager).chain_err(|| "Failed to create connection pool")?;

        Ok(Database { pool })
    }

    pub fn connection(&self) -> Result<Connection> {
        self.pool.get().map(Connection::new).chain_err(|| "No available database connection")
    }
}
