use reqwest::StatusCode;

/// runs simple fetch to /blog to warn the serverless function
/// returns the status code
pub async fn warm_blog() -> StatusCode {
    let req = reqwest::get("https://othi.dev/blog").await?;
    req.status()
}

#[tokio::main]
async fn main() {
    let t = warm_blog().await;

    println!("warming blogs {t}");
}
