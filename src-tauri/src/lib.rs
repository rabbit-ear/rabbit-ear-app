use std::fs;
use std::path::PathBuf;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn save_file(content: String, path: String) -> Result<(), String> {
    fs::write(PathBuf::from(path), content)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn open_file(path: String) -> Result<String, String> {
    fs::read_to_string(PathBuf::from(path))
        .map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![greet, save_file, open_file])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    // not working due to issue: https://github.com/tauri-apps/tauri/issues/9198
    // app.run(|_app_handle, event| match event {
    //     tauri::RunEvent::ExitRequested {api, ..} => {
    //         api.prevent_exit();
    //         println!("No Exit");
    //     },
    //     _ => {}
    // });

    app.run(|_, __| {});
}
