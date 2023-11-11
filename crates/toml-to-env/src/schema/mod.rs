mod database;
mod nextauth;
mod origins;
mod other;

use self::{
    database::ConfigTomlDatabase, nextauth::ConfigTomlNextAuth, origins::ConfigTomlOrigins,
    other::ConfigTomlOther,
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize)]
#[serde(rename_all = "UPPERCASE")]
pub struct EnvConfig {
    // [database]
    pub db_url: String,
    pub db_auth_token: String,

    // [nextauth]
    pub nextauth_url: String,
    pub admin_ident: String,
    pub nextauth_secret: String,
    pub github_id: String,
    pub github_secret: String,

    // [origins]
    pub next_public_host_db_center: String,
    pub next_public_host_hsr: String,
    pub next_public_host_nas_ws: String,

    // [other]
    pub next_config: String,
}

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct ConfigToml {
    pub database: Option<ConfigTomlDatabase>,
    pub nextauth: Option<ConfigTomlNextAuth>,
    pub origins: Option<ConfigTomlOrigins>,
    pub other: Option<ConfigTomlOther>,
}

impl From<ConfigToml> for EnvConfig {
    fn from(val: ConfigToml) -> Self {
        let [db_url, db_auth_token] = val.database.map(|e| e.parse()).unwrap_or_default();

        let [nextauth_url, admin_ident, nextauth_secret, github_id, github_secret] =
            val.nextauth.map(|e| e.parse()).unwrap_or_default();

        let [next_public_host_db_center, next_public_host_hsr, next_public_host_nas_ws] =
            val.origins.map(|e| e.parse()).unwrap_or_default();

        let [next_config] = val.other.map(|e| e.parse()).unwrap_or_default();

        EnvConfig {
            db_url,
            db_auth_token,
            nextauth_url,
            admin_ident,
            nextauth_secret,
            github_id,
            github_secret,
            next_public_host_db_center,
            next_public_host_hsr,
            next_public_host_nas_ws,
            next_config,
        }
    }
}
