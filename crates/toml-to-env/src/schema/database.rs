use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct ConfigTomlDatabase {
    pub db_url: Option<String>,
    pub db_auth_token: Option<String>,
}

impl ConfigTomlDatabase {
    pub fn parse(&self) -> [String; 2] {
        [
            self.db_url.clone().unwrap_or_default(),
            self.db_auth_token.clone().unwrap_or_default(),
        ]
    }
}
