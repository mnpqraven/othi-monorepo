use std::path::PathBuf;

pub fn get_out_path(mut filepath: PathBuf) -> PathBuf {
    filepath.set_extension("");
    let next_path = filepath.to_str().unwrap().replace("config", ".env");
    PathBuf::from(next_path)
}
