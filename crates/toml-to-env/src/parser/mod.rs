pub mod helper;

use crate::schema::{ConfigToml, EnvConfig};
use std::{error::Error, fs, path::PathBuf};

impl EnvConfig {
    pub fn new(path: &PathBuf) -> Self {
        let content = fs::read_to_string(path).unwrap_or_default();

        let config_toml: ConfigToml = toml::from_str(&content).unwrap_or_else(|_| {
            println!("Failed to create ConfigToml Object out of config file.");
            ConfigToml::default()
        });

        config_toml.into()
    }

    pub fn find_files() -> Vec<PathBuf> {
        let mut filepaths: Vec<PathBuf> = Vec::new();
        if let Ok(config_files) = fs::read_dir("../../") {
            filepaths = config_files
                .into_iter()
                .filter(|path| {
                    let filename = path
                        .as_ref()
                        .unwrap()
                        .file_name()
                        .to_string_lossy()
                        .to_lowercase();
                    filename.starts_with("config") && filename.ends_with(".toml")
                })
                .map(|path| path.unwrap().path())
                .collect()
        }
        filepaths
    }

    pub fn generate(&self, path: &PathBuf) -> Result<(), Box<dyn Error>> {
        // string builder
        let mut builder = String::new();

        let json = serde_json::to_value(self).unwrap();
        for (key, value) in json.as_object().unwrap() {
            builder.push_str(key);
            builder.push('=');
            builder.push_str(&value.to_string());
            builder.push('\n');
        }

        // write to file
        Ok(fs::write(path, &builder)?)
    }
}
