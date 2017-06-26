use bcrypt;
use db::Connection;
use db::schema::users;
use diesel;
use diesel::prelude::*;
use error::*;
use std::borrow::Cow;

#[derive(Insertable, Queryable, Serialize)]
#[table_name="users"]
pub struct User<'a> {
    pub name: Cow<'a, str>,
    pub password: Cow<'a, str>
}

pub fn list(connection: &Connection) -> Result<Vec<User<'static>>> {
    use db::schema::users::dsl;

    Ok(dsl::users.load::<User>(connection).chain_err(|| "Could not retrieve users")?)
}

pub fn add(connection: &Connection, name: &str, password: &str) -> Result<()> {
    use db::schema::users;
    use db::schema::users::dsl;

    let user = dsl::users.filter(dsl::name.eq(name))
                         .first::<User>(connection)
                         .optional()
                         .chain_err(|| "Could not query users")?;
    if user.is_some() {
        return Err(ErrorKind::DuplicateUser.into());
    }

    let hashed_password = bcrypt::hash(password, bcrypt::DEFAULT_COST).chain_err(|| "Could not hash password")?;

    let new_user = User {
        name: Cow::Borrowed(name),
        password: Cow::Owned(hashed_password),
    };

    diesel::insert(&new_user).into(users::table)
           .execute(connection)
           .chain_err(|| "Could not add new user")?;

    Ok(())
}

pub fn authenticate(connection: &Connection, name: &str, password: &str) -> Result<bool> {
    use db::schema::users::dsl;

    let user = dsl::users.filter(dsl::name.eq(name))
                         .first::<User>(connection)
                         .optional()
                         .chain_err(|| "Could not query users")?;

    if let Some(user) = user {
        bcrypt::verify(password, &user.password).chain_err(|| "Could not verify password")
    } else {
        Err(ErrorKind::Authentication.into())
    }
}
