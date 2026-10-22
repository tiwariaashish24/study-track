use crate::database::{Database, models::StudySession};
use crate::AppState;
use chrono::{DateTime, Utc};
use tauri::State;
use std::sync::Mutex;

#[tauri::command]
async fn create_session(
    session_type: String,
    duration_seconds: i64,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let db = state.db.lock().unwrap();
    let conn = db.get_connection();

    // Get user ID (simplified - should get from context)
    let user_id: i64 = conn.query_row(
        "SELECT id FROM users LIMIT 1",
        [],
        |row| row.get(0),
    ).map_err(|e| e.to_string())?;

    let started_at = Utc::now();
    let ended_at = Some(Utc::now());

    conn.execute(
        "INSERT INTO study_sessions (user_id, started_at, ended_at, duration_seconds, session_type, pomodoro_cycle, is_completed, notes)
         VALUES (?1, ?2, ?3, ?4, ?5, 0, 1, NULL)",
        [
            &user_id.to_string(),
            &started_at.to_rfc3339(),
            &ended_at.unwrap().to_rfc3339(),
            &duration_seconds.to_string(),
            &session_type,
        ],
    ).map_err(|e| e.to_string())?;

    let session_id = conn.last_insert_rowid();

    let session = StudySession {
        id: session_id,
        user_id,
        started_at,
        ended_at,
        duration_seconds,
        session_type,
        pomodoro_cycle: 0,
        is_completed: true,
        notes: None,
        created_at: Utc::now(),
    };

    Ok(serde_json::to_value(session).map_err(|e| e.to_string())?)
}

#[tauri::command]
async fn get_sessions(
    limit: Option<i64>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let db = state.db.lock().unwrap();
    let conn = db.get_connection();

    let limit = limit.unwrap_or(50);

    let mut stmt = conn.prepare(
        "SELECT id, user_id, started_at, ended_at, duration_seconds, session_type, pomodoro_cycle, is_completed, notes, created_at
         FROM study_sessions
         ORDER BY started_at DESC
         LIMIT ?1"
    ).map_err(|e| e.to_string())?;

    let sessions = stmt.query_map(
        [&limit],
        |row| {
            Ok(StudySession {
                id: row.get(0)?,
                user_id: row.get(1)?,
                started_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(2)?)
                    .unwrap()
                    .with_timezone(&Utc),
                ended_at: row.get::<_, Option<String>>(3)?
                    .map(|s| DateTime::parse_from_rfc3339(&s).unwrap().with_timezone(&Utc)),
                duration_seconds: row.get(4)?,
                session_type: row.get(5)?,
                pomodoro_cycle: row.get(6)?,
                is_completed: row.get(7)?,
                notes: row.get(8)?,
                created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(9)?)
                    .unwrap()
                    .with_timezone(&Utc),
            })
        },
    ).map_err(|e| e.to_string())?;

    let mut sessions_vec = Vec::new();
    for session in sessions {
        sessions_vec.push(session.map_err(|e| e.to_string())?);
    }

    Ok(serde_json::to_value(sessions_vec).map_err(|e| e.to_string())?)
}

#[tauri::command]
async fn update_session(
    id: i64,
    is_completed: Option<bool>,
    notes: Option<String>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let db = state.db.lock().unwrap();
    let conn = db.get_connection();

    if let Some(completed) = is_completed {
        conn.execute(
            "UPDATE study_sessions SET is_completed = ?1 WHERE id = ?2",
            [&if completed { 1 } else { 0 }, &id],
        ).map_err(|e| e.to_string())?;
    }

    if let Some(note) = notes {
        conn.execute(
            "UPDATE study_sessions SET notes = ?1 WHERE id = ?2",
            [&note, &id],
        ).map_err(|e| e.to_string())?;
    }

    // Fetch updated session
    let session = conn.query_row(
        "SELECT id, user_id, started_at, ended_at, duration_seconds, session_type, pomodoro_cycle, is_completed, notes, created_at
         FROM study_sessions WHERE id = ?1",
        [&id],
        |row| {
            Ok(StudySession {
                id: row.get(0)?,
                user_id: row.get(1)?,
                started_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(2)?)
                    .unwrap()
                    .with_timezone(&Utc),
                ended_at: row.get::<_, Option<String>>(3)?
                    .map(|s| DateTime::parse_from_rfc3339(&s).unwrap().with_timezone(&Utc)),
                duration_seconds: row.get(4)?,
                session_type: row.get(5)?,
                pomodoro_cycle: row.get(6)?,
                is_completed: row.get(7)?,
                notes: row.get(8)?,
                created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(9)?)
                    .unwrap()
                    .with_timezone(&Utc),
            })
        },
    ).map_err(|e| e.to_string())?;

    Ok(serde_json::to_value(session).map_err(|e| e.to_string())?)
}
