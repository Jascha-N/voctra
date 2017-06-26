use error::*;
use r2d2::config::{Config as R2d2Config};
use rocket::LoggingLevel;
use rocket::config::Environment;
use std::error::Error as StdError;
use std::fmt::{Display, Formatter, Result as FmtResult};
use std::fs::File;
use std::io::Read;
use std::path::{Path, PathBuf};
use std::time::Duration;
use toml;

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(default, deny_unknown_fields, rename_all = "kebab-case")]
pub struct Settings {
    #[serde(with = "EnvironmentDef")]
    pub environment: Environment,

    #[serde(with = "LoggingLevelDef")]
    pub logging: LoggingLevel,

    pub http: Http,
    pub database: Database,
    pub daemon: Daemon
}

impl Settings {
    pub fn from_file(path: &Path) -> Result<Settings> {
        let mut file = File::open(path).chain_err(|| "Could not open configuration file")?;
        let mut buffer = Vec::new();
        file.read_to_end(&mut buffer).chain_err(|| "Could not read configuration file")?;
        toml::from_slice(&buffer).chain_err(|| "Could not parse configuration file")
    }
}

impl Default for Settings {
    fn default() -> Settings {
        Settings {
            environment: Environment::Development,
            logging: LoggingLevel::Normal,
            daemon: Daemon::default(),
            http: Http::default(),
            database: Database::default()
        }
    }
}

impl Display for Settings {
    fn fmt(&self, fmt: &mut Formatter) -> FmtResult {
        writeln!(fmt, "{}", toml::to_string(self).unwrap())
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(default, deny_unknown_fields, rename_all = "kebab-case")]
pub struct Daemon {
    pub pid_file: PathBuf,
    pub log_file: Option<PathBuf>,
    pub cwd: Option<PathBuf>,
    pub umask: Option<u32>,
    pub user: Option<String>,
    pub group: Option<String>,
    pub stop_timeout: u32
}

impl Default for Daemon {
    fn default() -> Daemon {
        Daemon {
            pid_file: PathBuf::from("voctra.pid"),
            log_file: None,
            cwd: None,
            umask: None,
            user: None,
            group: None,
            stop_timeout: 5
        }
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(default, deny_unknown_fields, rename_all = "kebab-case")]
pub struct Http {
    pub address: String,
    pub port: u16,
    pub worker_threads: Option<u16>,
    pub session_key_file: Option<PathBuf>,
    pub www_root: PathBuf
}

impl Default for Http {
    fn default() -> Http {
        Http {
            address: String::from("localhost"),
            port: 8000,
            worker_threads: None,
            session_key_file: None,
            www_root: PathBuf::from("www")
        }
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(default, deny_unknown_fields, rename_all = "kebab-case")]
pub struct Database {
    pub url: String,
    pub pool_size: u32,
    pub min_idle: Option<u32>,
    pub helper_threads: u32,
    pub test_on_checkout: bool,
    pub initialization_fail_fast: bool,
    pub idle_timeout: u64,
    pub max_lifetime: u64,
    pub connection_timeout: u64
}

impl Database {
    pub fn r2d2_config<C, E: StdError>(&self) -> Result<R2d2Config<C, E>> {
        if self.pool_size == 0 {
            bail!("`database.pool-size` cannot be zero");
        }
        if self.helper_threads == 0 {
            bail!("`database.helper-threads` cannot be zero");
        }
        if self.min_idle.map_or_else(|| false, |min_idle| min_idle > self.pool_size) {
            bail!("`database.min-idle` cannot be greater than `database.pool-size`");
        }
        if self.connection_timeout == 0 {
            bail!("`database.connection-timeout` cannot be zero");
        }
        let idle_timeout = if self.idle_timeout == 0 { None } else {
            Some(Duration::from_secs(self.idle_timeout))
        };
        let max_lifetime = if self.max_lifetime == 0 { None } else {
            Some(Duration::from_secs(self.max_lifetime))
        };
        let connection_timeout = Duration::from_secs(self.connection_timeout);

        Ok(R2d2Config::builder()
                      .pool_size(self.pool_size)
                      .min_idle(self.min_idle)
                      .helper_threads(self.helper_threads)
                      .test_on_check_out(self.test_on_checkout)
                      .initialization_fail_fast(self.initialization_fail_fast)
                      .idle_timeout(idle_timeout)
                      .max_lifetime(max_lifetime)
                      .connection_timeout(connection_timeout)
                      .build())
    }
}

impl Default for Database {
    fn default() -> Database {
        Database {
            url: String::from("voctra.sqlite"),
            pool_size: 10,
            min_idle: None,
            helper_threads: 3,
            test_on_checkout: true,
            initialization_fail_fast: false,
            idle_timeout: 600,
            max_lifetime: 3600,
            connection_timeout: 30
        }
    }
}

#[derive(Deserialize, Serialize)]
#[allow(dead_code)]
#[serde(remote = "Environment", rename_all = "kebab-case")]
enum EnvironmentDef {
    Development,
    Staging,
    Production
}

#[derive(Deserialize, Serialize)]
#[allow(dead_code)]
#[serde(remote = "LoggingLevel", rename_all = "kebab-case")]
enum LoggingLevelDef {
    Critical,
    Normal,
    Debug
}
