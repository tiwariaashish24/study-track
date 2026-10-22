use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: i64,
    pub created_at: DateTime<Utc>,
    pub timezone: String,
    pub theme: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StudySession {
    pub id: i64,
    pub user_id: i64,
    pub started_at: DateTime<Utc>,
    pub ended_at: Option<DateTime<Utc>>,
    pub duration_seconds: i64,
    pub session_type: String,
    pub pomodoro_cycle: i64,
    pub is_completed: bool,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TimerState {
    pub id: i64,
    pub user_id: i64,
    pub timer_type: String,
    pub is_running: bool,
    pub elapsed_seconds: i64,
    pub target_seconds: Option<i64>,
    pub session_id: Option<i64>,
    pub started_at: Option<DateTime<Utc>>,
    pub last_updated: DateTime<Utc>,
}
