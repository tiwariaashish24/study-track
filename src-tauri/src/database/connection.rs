use rusqlite::{Connection, Result as SqliteResult};
use std::path::PathBuf;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum DatabaseError {
    #[error("SQLite error: {0}")]
    Sqlite(#[from] rusqlite::Error),
    #[error("Migration error: {0}")]
    Migration(String),
    #[error("Database path error: {0}")]
    Path(String),
}

pub type Result<T> = std::result::Result<T, DatabaseError>;

pub struct Database {
    conn: Connection,
}

impl Database {
    pub fn new() -> Result<Self> {
        // Get app data directory
        let mut db_path = Self::get_app_data_dir()?;
        db_path.push("studyflow.db");

        let conn = Connection::open(&db_path)
            .map_err(|e| DatabaseError::Path(format!("Failed to open database at {:?}: {}", db_path, e)))?;

        Ok(Database { conn })
    }

    pub async fn init(&self) -> Result<()> {
        self.run_migrations()?;
        Ok(())
    }

    fn get_app_data_dir() -> Result<PathBuf> {
        let mut path = dirs::home_dir()
            .ok_or_else(|| DatabaseError::Path("Could not determine home directory".to_string()))?;

        // On Windows, use AppData/Roaming
        if cfg!(windows) {
            path = path
                .parent()
                .ok_or_else(|| DatabaseError::Path("Invalid home directory".to_string()))?
                .to_path_buf();
            path.push("AppData");
            path.push("Roaming");
        }

        path.push("StudyFlow");

        // Create directory if it doesn't exist
        std::fs::create_dir_all(&path)
            .map_err(|e| DatabaseError::Path(format!("Failed to create directory {:?}: {}", path, e)))?;

        Ok(path)
    }

    fn run_migrations(&self) -> Result<()> {
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                timezone TEXT DEFAULT 'UTC',
                theme TEXT DEFAULT 'dark'
            )",
            [],
        )?;

        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS user_preferences (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL REFERENCES users(id),
                key TEXT NOT NULL UNIQUE,
                value TEXT NOT NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )?;

        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS study_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL REFERENCES users(id),
                started_at DATETIME NOT NULL,
                ended_at DATETIME,
                duration_seconds INTEGER NOT NULL,
                session_type TEXT NOT NULL,
                pomodoro_cycle INTEGER DEFAULT 0,
                is_completed BOOLEAN DEFAULT 0,
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )?;

        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS activity_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id INTEGER REFERENCES study_sessions(id),
                timestamp DATETIME NOT NULL,
                event_type TEXT NOT NULL,
                app_name TEXT,
                domain TEXT,
                duration_seconds INTEGER DEFAULT 0,
                metadata TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )?;

        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS app_usage (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL REFERENCES users(id),
                date DATE NOT NULL,
                app_name TEXT NOT NULL,
                domain TEXT,
                category TEXT,
                duration_seconds INTEGER NOT NULL,
                is_distraction BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, date, app_name, domain)
            )",
            [],
        )?;

        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS website_rules (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL REFERENCES users(id),
                domain TEXT NOT NULL,
                rule_type TEXT NOT NULL,
                category TEXT,
                is_active BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, domain)
            )",
            [],
        )?;

        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS study_goals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL REFERENCES users(id),
                goal_type TEXT NOT NULL,
                target_seconds INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT 1
            )",
            [],
        )?;

        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS reminder_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL REFERENCES users(id),
                reminder_type TEXT NOT NULL,
                is_enabled BOOLEAN DEFAULT 1,
                schedule TEXT,
                message TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )?;

        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS timer_state (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL REFERENCES users(id),
                timer_type TEXT NOT NULL,
                is_running BOOLEAN DEFAULT 0,
                elapsed_seconds INTEGER DEFAULT 0,
                target_seconds INTEGER,
                session_id INTEGER REFERENCES study_sessions(id),
                started_at DATETIME,
                last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, timer_type)
            )",
            [],
        )?;

        // Create default user if none exists
        let user_count: i64 = self.conn.query_row(
            "SELECT COUNT(*) FROM users",
            [],
            |row| row.get(0),
        )?;

        if user_count == 0 {
            self.conn.execute(
                "INSERT INTO users (timezone, theme) VALUES ('UTC', 'dark')",
                [],
            )?;
        }

        Ok(())
    }

    pub fn get_connection(&self) -> &Connection {
        &self.conn
    }
}
