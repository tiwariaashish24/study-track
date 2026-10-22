# StudyFlow - Desktop Study Productivity SaaS

## Architecture Overview

StudyFlow is a Tauri 2 desktop application with a React frontend, designed for Windows. It follows a modular architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     Tauri Desktop App                        │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React + TypeScript + Vite)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   UI Layer   │  │  State Mgmt  │  │  Components  │      │
│  │  (shadcn/ui) │  │  (Context)   │  │  (Reusable)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
├─────────────────────────────────────────────────────────────┤
│  Backend (Rust - Tauri)                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Commands   │  │   Database   │  │   Native     │      │
│  │  (RPC API)   │  │   (SQLite)   │  │   Windows    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
├─────────────────────────────────────────────────────────────┤
│  Browser Extension (Chrome/Edge)                            │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ Tab Monitor  │  │  Block Rules │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## Repository Structure

```
studyflow/
├── src-tauri/                          # Rust backend
│   ├── src/
│   │   ├── main.rs                     # Tauri entry point
│   │   ├── lib.rs                      # Library exports
│   │   ├── commands/                   # Tauri commands (RPC)
│   │   │   ├── mod.rs
│   │   │   ├── timer.rs                # Timer operations
│   │   │   ├── sessions.rs             # Session CRUD
│   │   │   ├── analytics.rs            # Analytics queries
│   │   │   ├── settings.rs             # User preferences
│   │   │   └── notifications.rs        # Desktop notifications
│   │   ├── database/                   # SQLite operations
│   │   │   ├── mod.rs
│   │   │   ├── connection.rs           # Connection pool
│   │   │   ├── migrations.rs           # Schema migrations
│   │   │   └── models.rs               # Database models
│   │   ├── native/                     # Windows-specific
│   │   │   ├── mod.rs
│   │   │   ├── window.rs               # Window management
│   │   │   ├── activity.rs             # Foreground app tracking
│   │   │   └── notifications.rs        # Windows notifications
│   │   └── timer/                      # Timer service
│   │       ├── mod.rs
│   │       ├── state.rs                # Timer state management
│   │       └── persistence.rs          # State recovery
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── build.rs
├── src/                                # React frontend
│   ├── main.tsx                        # React entry
│   ├── App.tsx                         # Root component
│   ├── components/                     # Reusable UI components
│   │   ├── ui/                         # shadcn/ui components
│   │   ├── layout/                     # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── FloatingTimer.tsx
│   │   ├── timer/                      # Timer-specific
│   │   │   ├── Stopwatch.tsx
│   │   │   ├── Countdown.tsx
│   │   │   └── Pomodoro.tsx
│   │   ├── analytics/                  # Analytics visualizations
│   │   │   ├── Charts.tsx
│   │   │   └── Reports.tsx
│   │   └── common/                     # Shared components
│   │       ├── Card.tsx
│   │       ├── Button.tsx
│   │       └── Modal.tsx
│   ├── pages/                          # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Timer.tsx
│   │   ├── Analytics.tsx
│   │   ├── Library.tsx
│   │   ├── Rules.tsx
│   │   ├── History.tsx
│   │   └── Settings.tsx
│   ├── hooks/                          # React hooks
│   │   ├── useTimer.ts
│   │   ├── useSessions.ts
│   │   ├── useAnalytics.ts
│   │   └── useNotifications.ts
│   ├── store/                          # State management
│   │   ├── TimerContext.tsx
│   │   ├── SessionContext.tsx
│   │   └── SettingsContext.tsx
│   ├── lib/                            # Utilities
│   │   ├── api.ts                      # Tauri command wrappers
│   │   ├── db-types.ts                 # TypeScript types matching Rust
│   │   ├── utils.ts                    # Helper functions
│   │   └── constants.ts                # Constants
│   └── styles/                         # Global styles
│       └── globals.css
├── extension/                          # Browser extension
│   ├── manifest.json
│   ├── src/
│   │   ├── background.ts               # Tab monitoring
│   │   ├── content.ts                  # Blocked page
│   │   └── popup.ts                    # Extension popup
│   └── dist/
├── tests/                              # Test files
│   ├── timer.test.ts
│   ├── analytics.test.ts
│   └── rules.test.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── components.json                     # shadcn/ui config
└── README.md
```

## Data Model

### Database Schema (SQLite)

```sql
-- Users and preferences
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    timezone TEXT DEFAULT 'UTC',
    theme TEXT DEFAULT 'dark'
);

CREATE TABLE user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Study sessions
CREATE TABLE study_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    started_at DATETIME NOT NULL,
    ended_at DATETIME,
    duration_seconds INTEGER NOT NULL,
    session_type TEXT NOT NULL, -- 'stopwatch', 'countdown', 'pomodoro'
    pomodoro_cycle INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT 0,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Activity events
CREATE TABLE activity_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER REFERENCES study_sessions(id),
    timestamp DATETIME NOT NULL,
    event_type TEXT NOT NULL, -- 'focus', 'break', 'idle', 'distraction'
    app_name TEXT,
    domain TEXT,
    duration_seconds INTEGER DEFAULT 0,
    metadata TEXT, -- JSON for additional data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Application usage summaries
CREATE TABLE app_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    date DATE NOT NULL,
    app_name TEXT NOT NULL,
    domain TEXT,
    category TEXT, -- 'study', 'social', 'entertainment', etc.
    duration_seconds INTEGER NOT NULL,
    is_distraction BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date, app_name, domain)
);

-- Website rules
CREATE TABLE website_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    domain TEXT NOT NULL,
    rule_type TEXT NOT NULL, -- 'allow', 'block'
    category TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, domain)
);

-- Study goals
CREATE TABLE study_goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    goal_type TEXT NOT NULL, -- 'daily', 'weekly'
    target_seconds INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1
);

-- Reminder settings
CREATE TABLE reminder_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    reminder_type TEXT NOT NULL, -- 'hourly', 'session_complete', 'break', 'daily_goal'
    is_enabled BOOLEAN DEFAULT 1,
    schedule TEXT, -- Cron-like or JSON schedule
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Timer state (for persistence across restarts)
CREATE TABLE timer_state (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    timer_type TEXT NOT NULL, -- 'stopwatch', 'countdown', 'pomodoro'
    is_running BOOLEAN DEFAULT 0,
    elapsed_seconds INTEGER DEFAULT 0,
    target_seconds INTEGER, -- NULL for stopwatch
    session_id INTEGER REFERENCES study_sessions(id),
    started_at DATETIME,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, timer_type)
);
```

### TypeScript Types

```typescript
// lib/db-types.ts
export interface User {
  id: number;
  created_at: string;
  timezone: string;
  theme: string;
}

export interface UserPreference {
  id: number;
  user_id: number;
  key: string;
  value: string;
  updated_at: string;
}

export interface StudySession {
  id: number;
  user_id: number;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number;
  session_type: 'stopwatch' | 'countdown' | 'pomodoro';
  pomodoro_cycle: number;
  is_completed: boolean;
  notes: string | null;
  created_at: string;
}

export interface ActivityEvent {
  id: number;
  session_id: number | null;
  timestamp: string;
  event_type: 'focus' | 'break' | 'idle' | 'distraction';
  app_name: string | null;
  domain: string | null;
  duration_seconds: number;
  metadata: string | null;
  created_at: string;
}

export interface AppUsage {
  id: number;
  user_id: number;
  date: string;
  app_name: string;
  domain: string | null;
  category: string | null;
  duration_seconds: number;
  is_distraction: boolean;
  created_at: string;
}

export interface WebsiteRule {
  id: number;
  user_id: number;
  domain: string;
  rule_type: 'allow' | 'block';
  category: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudyGoal {
  id: number;
  user_id: number;
  goal_type: 'daily' | 'weekly';
  target_seconds: number;
  created_at: string;
  is_active: boolean;
}

export interface ReminderSetting {
  id: number;
  user_id: number;
  reminder_type: 'hourly' | 'session_complete' | 'break' | 'daily_goal';
  is_enabled: boolean;
  schedule: string | null;
  message: string | null;
  created_at: string;
  updated_at: string;
}

export interface TimerState {
  id: number;
  user_id: number;
  timer_type: 'stopwatch' | 'countdown' | 'pomodoro';
  is_running: boolean;
  elapsed_seconds: number;
  target_seconds: number | null;
  session_id: number | null;
  started_at: string | null;
  last_updated: string;
}
```

## Windows Integration Approach

### 1. Window Management
- Use Tauri's window API for main window and floating mini-timer
- Implement "always on top" for floating timer
- Handle minimize to tray

### 2. Activity Tracking
- Use Windows API via Rust crates:
  - `windows-rs` for foreground window detection
  - `windows` crate for process enumeration
- Require explicit user permission in settings
- Track only application names, not content

### 3. Notifications
- Use Tauri's notification plugin
- Respect Windows notification settings
- Implement background scheduling with Windows Task Scheduler APIs

### 4. Browser Extension Communication
- Use WebSocket or named pipe for desktop-extension communication
- Extension monitors active tabs
- Desktop app sends block/allow rules to extension

### 5. Data Storage
- SQLite database in AppData directory
- `C:\Users\<username>\AppData\Roaming\StudyFlow\`
- Automatic migrations on startup

## Implementation Plan

### Phase 1: Foundation and Timer (Current)
- [x] Initialize Tauri 2 + React + TypeScript project
- [ ] Setup Tailwind CSS and shadcn/ui
- [ ] Create SQLite database schema and migrations
- [ ] Implement timer logic with persistence
- [ ] Build basic UI structure (sidebar, navigation)
- [ ] Implement timer UI (stopwatch, countdown, pomodoro)
- [ ] Add session history and persistence
- [ ] Write tests for timer accuracy
- [ ] Configure Windows build
- [ ] Document setup and build instructions

### Phase 2: Analytics and Activity Tracking
- Implement Windows activity tracking (with permission)
- Create analytics queries and aggregations
- Build analytics UI with Recharts
- Add daily/weekly/monthly reports
- Implement activity categorization

### Phase 3: Notifications and Reminders
- Implement desktop notification system
- Add hourly reminders
- Session completion notifications
- Break reminders
- Daily goal notifications
- Background scheduling

### Phase 4: Focus Mode and Website Blocking
- Implement website rules management
- Build browser extension (Chrome/Edge)
- Create desktop-extension communication
- Implement allowlist/blocklist logic
- Add blocked page screen
- Emergency exit mechanism

### Phase 5: Polish and Testing
- Comprehensive UI polish
- Add keyboard shortcuts
- Improve accessibility
- Full test coverage
- Performance optimization
- Error handling improvements

### Phase 6: Optional Cloud Dashboard
- Setup Next.js backend
- Implement PostgreSQL with Prisma
- Add authentication
- Cloud sync with user consent
- Web dashboard for analytics
