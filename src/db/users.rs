use bcrypt;
use db::{Connection, Database};
use db::schema::users;
use diesel;
use diesel::prelude::*;
use error::*;
use std::borrow::Cow;

#[derive(Insertable, Queryable, Serialize)]
#[table_name = "users"]
pub struct User<'a> {
    pub name: Cow<'a, str>,
    pub password: Cow<'a, str>
}

pub trait Users {
    fn list_users(&self) -> Result<Vec<User<'static>>>;
    fn add_user(&self, name: &str, password: &str) -> Result<()>;
    fn auth_user(&self, name: &str, password: &str) -> Result<()>;
}

impl<T: Database> Users for T {
    fn list_users(&self) -> Result<Vec<User<'static>>> {
        let connection = self.connection()?;
        Ok(users::table.load(connection.raw()).chain_err(|| "Could not retrieve users")?)
    }

    fn add_user(&self, name: &str, password: &str) -> Result<()> {
        let connection = self.connection()?;

        let user = users::table.find(name)
                               .first::<User>(connection.raw())
                               .optional()
                               .chain_err(|| "Could not query users")?;
        if user.is_some() {
            bail!(ErrorKind::UserAlreadyExists(name.to_string()));
        }

        let hashed_password = bcrypt::hash(password, bcrypt::DEFAULT_COST).chain_err(|| "Could not hash password")?;

        let new_user = User {
            name: Cow::Borrowed(name),
            password: Cow::Owned(hashed_password),
        };

        diesel::insert(&new_user)
               .into(users::table)
               .execute(connection.raw())
               .chain_err(|| "Could not add new user")?;

        Ok(())
    }

    fn auth_user(&self, name: &str, password: &str) -> Result<()> {
        let connection = self.connection()?;

        let user = users::table.find(name)
                               .first::<User>(connection.raw())
                               .optional()
                               .chain_err(|| "Could not query users")?;

        if let Some(user) = user {
            if bcrypt::verify(password, &user.password).chain_err(|| "Could not verify password")? {
                return Ok(())
            }
        }

        Err(Error::from(ErrorKind::InvalidCredentials))
    }
}
