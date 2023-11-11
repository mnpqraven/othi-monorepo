use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct ConfigTomlNextAuth {
    pub nextauth_url: Option<String>,
    pub admin_ident: Option<String>,
    pub nextauth_secret: Option<String>,
    pub github_id: Option<String>,
    pub github_secret: Option<String>,
}

impl ConfigTomlNextAuth {
    pub fn parse(&self) -> [String; 5] {
        [
            self.nextauth_url.clone().unwrap_or_default(),
            self.admin_ident.clone().unwrap_or_default(),
            self.nextauth_secret.clone().unwrap_or_default(),
            self.github_id.clone().unwrap_or_default(),
            self.github_secret.clone().unwrap_or_default(),
        ]
    }
}
