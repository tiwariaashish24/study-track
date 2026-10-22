use crate::timer::{TimerService, TimerType};
use std::sync::Mutex;
use tauri::State;

struct TimerAppState {
    timer: Mutex<TimerService>,
}

#[tauri::command]
pub fn start_timer(
    timer_type: String,
    target_seconds: Option<i64>,
    state: State<TimerAppState>,
) -> Result<serde_json::Value, String> {
    let timer_type = TimerType::from_str(&timer_type);
    let timer_state = state.timer.lock().unwrap()
        .start(timer_type, target_seconds);
    Ok(serde_json::to_value(timer_state).map_err(|e| e.to_string())?)
}

#[tauri::command]
pub fn stop_timer(state: State<TimerAppState>) -> Result<serde_json::Value, String> {
    let timer_state = state.timer.lock().unwrap()
        .pause();
    Ok(serde_json::to_value(timer_state).map_err(|e| e.to_string())?)
}

#[tauri::command]
pub fn pause_timer(state: State<TimerAppState>) -> Result<serde_json::Value, String> {
    let timer_state = state.timer.lock().unwrap()
        .pause();
    Ok(serde_json::to_value(timer_state).map_err(|e| e.to_string())?)
}

#[tauri::command]
pub fn reset_timer(state: State<TimerAppState>) -> Result<serde_json::Value, String> {
    let timer_state = state.timer.lock().unwrap()
        .reset();
    Ok(serde_json::to_value(timer_state).map_err(|e| e.to_string())?)
}

#[tauri::command]
pub fn get_timer_state(state: State<TimerAppState>) -> Result<serde_json::Value, String> {
    let timer_state = state.timer.lock().unwrap()
        .get_state();
    Ok(serde_json::to_value(timer_state).map_err(|e| e.to_string())?)
}
