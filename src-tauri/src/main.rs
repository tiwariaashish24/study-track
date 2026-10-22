// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod database;
mod timer;

use database::Database;
use timer::TimerService;
use std::sync::Mutex;

struct AppState {
    db: Mutex<Database>,
}

struct TimerAppState {
    timer: Mutex<TimerService>,
}

#[tauri::Builder::command]
async fn get_greeting(name: &str) -> String {
    format!("Hello, {}! Welcome to StudyFlow.", name)
}

#[tauri::Builder::command]
async fn init_database() -> Result<(), String> {
    let db = Database::new().map_err(|e| e.to_string())?;
    db.init().map_err(|e| e.to_string())?;
    Ok(())
}

fn main() {
    // Initialize database
    let db = Database::new()
        .expect("Failed to create database");

    // Initialize timer service
    let timer = TimerService::new();

    tauri::Builder::default()
        .manage(AppState {
            db: Mutex::new(db),
        })
        .manage(TimerAppState {
            timer: Mutex::new(timer),
        })
        .invoke_handler(tauri::generate_handler![
            get_greeting,
            init_database,
            commands::timer::start_timer,
            commands::timer::stop_timer,
            commands::timer::pause_timer,
            commands::timer::reset_timer,
            commands::timer::get_timer_state,
            commands::sessions::create_session,
            commands::sessions::get_sessions,
            commands::sessions::update_session,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
