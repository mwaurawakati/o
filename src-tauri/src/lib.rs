// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            if let Some(window) = app.get_webview_window("main") {
                window.maximize().unwrap();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, proxy_request])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use tauri::Manager;
use tauri_plugin_http::reqwest::{Client, Response, Method};
use serde::Deserialize;

#[derive(Deserialize)]
struct ProxyRequest {
    url: String,
    method: String,
    headers: Option<std::collections::HashMap<String, String>>,
    body: Option<String>,
}

#[tauri::command]
async fn proxy_request(req: ProxyRequest) -> Result<serde_json::Value, String> {
    let client = Client::new();
    let m = Method::from_bytes(req.method.as_str().to_uppercase().as_bytes()).map_err(|e| e.to_string())?;
    let mut builder = client.request(m, req.url.as_str());

    if let Some(headers) = req.headers {
        for (k, v) in headers {
            builder = builder.header(&k, &v);
        }
    }

    if let Some(body) = req.body {
        builder = builder.body(body);
    }

    let res = builder.send().await.map_err(|e| e.to_string())?;

    let status = res.status().as_u16();
    let headers = res
        .headers()
        .iter()
        .map(|(k, v)| (k.as_str().to_string(), v.to_str().unwrap_or("").to_string()))
        .collect::<std::collections::HashMap<_, _>>();

    let body = res.text().await.map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "status": status,
        "headers": headers,
        "body": body
    }))
}

