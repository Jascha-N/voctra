use error::*;

use std::collections::HashMap;
use std::sync::RwLock;
use uuid::Uuid;

struct Session {
    id: Uuid;
}

pub struct SessionManager {
    sessions: RwLock<HashMap<Uuid, Session>>>,
}

impl SessionManager {
    pub fn new() -> SessionManager {
        SessionManager {
            sessions: HashMap::new()
        }
    }

    pub fn login(&self, username: &str, password: &str) -> Result<Uuid> {
        self.sessions.insert()
    }

    pub fn logout(&self, id: Uuid) -> Result<()> {
        self.sessions.remove(id);
    }
}
