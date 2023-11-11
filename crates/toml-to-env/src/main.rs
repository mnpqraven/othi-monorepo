pub mod parser;
pub mod schema;

use clap::Parser;
use parser::helper::get_out_path;
use schema::EnvConfig;

/// Simple program to greet a person
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Name of the person to greet
    #[arg(short, long)]
    name: String,

    /// Number of times to greet
    #[arg(short, long, default_value_t = 1)]
    count: u8,
}

fn main() {
    let files = EnvConfig::find_files();
    for filepath in files {
        let config = EnvConfig::new(&filepath);

        config.generate(&get_out_path(filepath)).unwrap()
    }
}
