use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct ConfigTomlOther {
    pub edge_config: Option<String>,
}

impl ConfigTomlOther {
    pub fn parse(&self) -> [String; 1] {
        [
            self.edge_config.clone().unwrap_or_default(),
        ]
    }
}
