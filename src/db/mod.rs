use error::*;
use r2d2::{ManageConnection, Pool, PooledConnection as R2d2PooledConnection};
use r2d2_diesel::ConnectionManager;
use settings::Database as DatabaseSettings;
use std::io;

pub use self::users::Users;

mod users;

mod schema {
    infer_schema!("env:DEV_DATABASE_URL");
}



embed_migrations!();

#[cfg(feature = "sqlite")]
type RawConnection = ::diesel::sqlite::SqliteConnection;

#[cfg(feature = "postgres")]
type RawConnection = ::diesel::pg::PgConnection;

#[cfg(feature = "mysql")]
type RawConnection = ::diesel::mysql::MysqlConnection;

pub trait Database {
    type Connection: Connection;

    fn connection(&self) -> Result<Self::Connection>;
}

pub trait Connection {
    fn raw(&self) -> &RawConnection;
}



pub struct PooledDatabase(Pool<ConnectionManager<RawConnection>>);

impl PooledDatabase {
    pub fn new(settings: &DatabaseSettings) -> Result<PooledDatabase> {
        let config = settings.r2d2()?;
        let manager = ConnectionManager::<RawConnection>::new(settings.url.clone());
        run_migrations(&manager)?;
        let pool = Pool::new(config, manager).chain_err(|| "Failed to create connection pool")?;
        Ok(PooledDatabase(pool))
    }
}

impl Database for PooledDatabase {
    type Connection = PooledConnection;

    fn connection(&self) -> Result<PooledConnection> {
        self.0.get().map(PooledConnection).chain_err(|| ErrorKind::DatabaseUnavailable)
    }
}

pub struct PooledConnection(R2d2PooledConnection<ConnectionManager<RawConnection>>);

impl Connection for PooledConnection {
    fn raw(&self) -> &RawConnection {
        &*self.0
    }
}



pub struct UnpooledDatabase(ConnectionManager<RawConnection>);

impl UnpooledDatabase {
    pub fn new(settings: &DatabaseSettings) -> Result<UnpooledDatabase> {
        let manager = ConnectionManager::<RawConnection>::new(settings.url.clone());
        run_migrations(&manager)?;
        Ok(UnpooledDatabase(manager))
    }
}

impl Database for UnpooledDatabase {
    type Connection = UnpooledConnection;

    fn connection(&self) -> Result<UnpooledConnection> {
        self.0.connect().map(UnpooledConnection).chain_err(|| ErrorKind::DatabaseUnavailable)
    }
}

pub struct UnpooledConnection(RawConnection);

impl Connection for UnpooledConnection {
    fn raw(&self) -> &RawConnection {
        &self.0
    }
}



fn run_migrations(manager: &ConnectionManager<RawConnection>) -> Result<()> {
    let connection = manager.connect().chain_err(|| "Could not connect to database")?;
    embedded_migrations::run_with_output(&connection, &mut io::stderr())
        .chain_err(|| "Could not run migrations")
}
