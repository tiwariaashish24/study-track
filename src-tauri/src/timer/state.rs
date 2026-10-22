use std::sync::{Arc, Mutex};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TimerType {
    Stopwatch,
    Countdown,
    Pomodoro,
}

impl TimerType {
    pub fn as_str(&self) -> &'static str {
        match self {
            TimerType::Stopwatch => "stopwatch",
            TimerType::Countdown => "countdown",
            TimerType::Pomodoro => "pomodoro",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s {
            "stopwatch" => TimerType::Stopwatch,
            "countdown" => TimerType::Countdown,
            "pomodoro" => TimerType::Pomodoro,
            _ => TimerType::Stopwatch,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimerState {
    pub timer_type: TimerType,
    pub is_running: bool,
    pub elapsed_seconds: i64,
    pub target_seconds: Option<i64>,
    pub started_at: Option<DateTime<Utc>>,
    pub last_updated: DateTime<Utc>,
}

impl Default for TimerState {
    fn default() -> Self {
        TimerState {
            timer_type: TimerType::Stopwatch,
            is_running: false,
            elapsed_seconds: 0,
            target_seconds: None,
            started_at: None,
            last_updated: Utc::now(),
        }
    }
}

pub struct TimerService {
    state: Arc<Mutex<TimerState>>,
}

impl TimerService {
    pub fn new() -> Self {
        TimerService {
            state: Arc::new(Mutex::new(TimerState::default())),
        }
    }

    pub fn start(&self, timer_type: TimerType, target_seconds: Option<i64>) -> TimerState {
        let mut state = self.state.lock().unwrap();
        state.timer_type = timer_type;
        state.is_running = true;
        state.elapsed_seconds = 0;
        state.target_seconds = target_seconds;
        state.started_at = Some(Utc::now());
        state.last_updated = Utc::now();
        state.clone()
    }

    pub fn pause(&self) -> TimerState {
        let mut state = self.state.lock().unwrap();
        state.is_running = false;
        state.last_updated = Utc::now();
        state.clone()
    }

    pub fn resume(&self) -> TimerState {
        let mut state = self.state.lock().unwrap();
        state.is_running = true;
        state.last_updated = Utc::now();
        state.clone()
    }

    pub fn reset(&self) -> TimerState {
        let mut state = self.state.lock().unwrap();
        state.is_running = false;
        state.elapsed_seconds = 0;
        state.started_at = None;
        state.last_updated = Utc::now();
        state.clone()
    }

    pub fn get_state(&self) -> TimerState {
        let state = self.state.lock().unwrap();
        state.clone()
    }

    pub fn update_elapsed(&self, additional_seconds: i64) -> TimerState {
        let mut state = self.state.lock().unwrap();
        state.elapsed_seconds += additional_seconds;
        state.last_updated = Utc::now();
        state.clone()
    }
}
