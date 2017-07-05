use error::*;
use rand::{OsRng, Rng};
use std::fs::File;
use std::io::Read;
use std::ops::Deref;
use std::path::Path;

pub struct SecretKey(Vec<u8>);

impl SecretKey {
    pub fn new() -> Result<SecretKey> {
        let mut rng = OsRng::new().chain_err(|| "Could not obtain a random number generator")?;
        let mut key = vec![0; 32];
        rng.fill_bytes(&mut key);
        Ok(SecretKey(key))
    }

    pub fn from_file(path: &Path) -> Result<SecretKey> {
        let mut file = File::open(path).chain_err(|| "Could not open key file")?;
        let mut key = Vec::new();
        file.read_to_end(&mut key).chain_err(|| "Could not read key file")?;
        Ok(SecretKey(key))
    }
}

impl Deref for SecretKey {
    type Target = [u8];

    fn deref(&self) -> &[u8] {
        &self.0
    }
}
