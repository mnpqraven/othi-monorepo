use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct ConfigTomlOrigins {
    pub next_public_host_db_center: Option<String>,
    pub next_public_host_hsr: Option<String>,
    pub next_public_host_nas_ws: Option<String>,
}

impl ConfigTomlOrigins {
    pub fn parse(&self) -> [String; 3] {
        [
            self.next_public_host_db_center.clone().unwrap_or_default(),
            self.next_public_host_hsr.clone().unwrap_or_default(),
            self.next_public_host_nas_ws.clone().unwrap_or_default(),
        ]
    }
}
