# StudyFlow - Desktop Study Productivity SaaS

A production-oriented study productivity application for Windows, built with Tauri 2, React, and TypeScript.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture, data model, and implementation plan.

## Phase 1 Implementation (Current)

This phase includes:
- Tauri 2 + React + TypeScript project structure
- SQLite database with full schema
- Timer logic (stopwatch, countdown, pomodoro)
- Basic UI with sidebar navigation
- Session history and persistence
- Timer state management
- Unit tests for timer accuracy

## Prerequisites

- Node.js 18+
- Rust 1.70+ (with Windows toolchain)
- npm or yarn
- Windows 10/11

## Windows Build Requirements

### Installing Rust on Windows

1. Download and run the Rust installer from https://rustup.rs/
2. Or use the command line:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

3. After installation, restart your terminal or run:

```bash
source $HOME/.cargo/env
```

### Windows-specific Dependencies

For Tauri development on Windows, you need:

- **Microsoft Visual C++ Build Tools**: Download from [Visual Studio Downloads](https://visualstudio.microsoft.com/downloads/)
  - Select "Desktop development with C++" workload
  - Or install via winget: `winget install Microsoft.VisualStudio.2022.BuildTools`

- **WebView2**: Usually pre-installed on Windows 10/11
  - If missing, download from [Microsoft WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

### Verify Installation

```bash
node --version  # Should be 18+
npm --version   # Should be 9+
rustc --version # Should be 1.70+
cargo --version # Should be 1.70+
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Application Icons (Optional)

For Phase 1, icons are optional. For production builds, add icons to `src-tauri/icons/`:
- 32x32.png
- 128x128.png
- 128x128@2x.png
- icon.ico (Windows)
- icon.icns (macOS)

### 3. Development Mode

```bash
npm run tauri:dev
```

This will:
- Start the Vite dev server on http://localhost:1420
- Compile the Rust backend
- Launch the Tauri application window
- Enable hot reload for both frontend and backend

### 4. Production Build

```bash
npm run tauri:build
```

This creates:
- A Windows installer (.msi) in `src-tauri/target/release/bundle/msi/`
- A standalone executable in `src-tauri/target/release/`

## Development

### Frontend-Only Development

To work on the React UI without the Tauri backend:

```bash
npm run dev
```

This runs Vite on http://localhost:1420. Note that Tauri APIs won't be available in this mode.

### Backend Development

The Rust backend is in `src-tauri/`. To compile it:

```bash
cd src-tauri
cargo build
```

To run tests:

```bash
cd src-tauri
cargo test
```

### Running Tests

```bash
npm test
```

## Project Structure

```
studyflow/
├── src/                      # React frontend
│   ├── components/           # UI components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components (Sidebar, etc.)
│   │   ├── timer/           # Timer-specific components
│   │   ├── analytics/       # Analytics visualizations
│   │   └── common/          # Shared components
│   ├── pages/               # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Timer.tsx
│   │   ├── Analytics.tsx
│   │   ├── Library.tsx
│   │   ├── Rules.tsx
│   │   ├── History.tsx
│   │   └── Settings.tsx
│   ├── hooks/               # React hooks
│   ├── store/               # State management (Context)
│   ├── lib/                 # Utilities and API
│   │   ├── api.ts           # Tauri command wrappers
│   │   ├── db-types.ts      # TypeScript types
│   │   ├── utils.ts         # Helper functions
│   │   └── constants.ts     # Constants
│   ├── styles/              # Global styles
│   ├── App.tsx
│   └── main.tsx
├── src-tauri/               # Rust backend
│   ├── src/
│   │   ├── commands/        # Tauri commands (RPC API)
│   │   │   ├── timer.rs
│   │   │   ├── sessions.rs
│   │   │   └── mod.rs
│   │   ├── database/        # SQLite operations
│   │   │   ├── connection.rs
│   │   │   ├── migrations.rs
│   │   │   ├── models.rs
│   │   │   └── mod.rs
│   │   ├── timer/           # Timer service
│   │   │   ├── state.rs
│   │   │   ├── persistence.rs
│   │   │   └── mod.rs
│   │   ├── native/          # Windows-specific (Phase 2)
│   │   ├── main.rs
│   │   └── lib.rs
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── build.rs
├── tests/                   # Test files
│   └── timer.test.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Database

The application uses SQLite with the following tables:
- users
- user_preferences
- study_sessions
- activity_events
- app_usage
- website_rules
- study_goals
- reminder_settings
- timer_state

Database location: `C:\Users\<username>\AppData\Roaming\StudyFlow\studyflow.db`

To view the database, use tools like:
- DB Browser for SQLite (https://sqlitebrowser.org/)
- SQLite command line tool

## Features Implemented (Phase 1)

- ✅ Timer with stopwatch, countdown, and pomodoro modes
- ✅ SQLite database with full schema and migrations
- ✅ Session history tracking and persistence
- ✅ Premium dark-mode UI with Tailwind CSS
- ✅ Sidebar navigation with all pages
- ✅ Dashboard with placeholder statistics
- ✅ Timer controls (start, pause, reset)
- ✅ Session saving to database
- ✅ Unit tests for timer accuracy and state management
- ✅ TypeScript type safety throughout

## Features Coming (Phase 2+)

### Phase 2: Analytics and Activity Tracking
- Windows foreground application tracking (with user permission)
- Activity event logging
- Analytics queries and aggregations
- Charts and visualizations with Recharts
- Daily/weekly/monthly reports
- Application categorization

### Phase 3: Notifications and Reminders
- Desktop notification system
- Hourly reminders
- Session completion notifications
- Break reminders
- Daily goal notifications
- Background scheduling

### Phase 4: Focus Mode and Website Blocking
- Website rules management UI
- Browser extension (Chrome/Edge)
- Desktop-extension communication
- Allowlist/blocklist logic
- Blocked page screen
- Emergency exit mechanism

### Phase 5: Polish and Testing
- Comprehensive UI polish
- Keyboard shortcuts
- Accessibility improvements
- Full test coverage
- Performance optimization
- Error handling improvements

### Phase 6: Optional Cloud Dashboard
- Next.js backend
- PostgreSQL with Prisma
- Authentication
- Cloud sync (with user consent)
- Web dashboard

## Troubleshooting

### Rust Build Errors

If you encounter `dlltool.exe not found` error:
- This is a known issue with the GNU toolchain on Windows
- Consider using the MSVC toolchain instead:
  ```bash
  rustup default stable-x86_64-pc-windows-msvc
  ```
- Install Visual Studio Build Tools as mentioned above

### Tauri Dev Fails to Start

If `npm run tauri:dev` fails:
1. Ensure port 1420 is not in use
2. Check that Vite dev server starts successfully with `npm run dev`
3. Verify Rust installation with `rustc --version`
4. Check Tauri logs in the terminal

### Database Issues

If the database fails to initialize:
1. Check write permissions to AppData/Roaming/StudyFlow
2. Delete the database file and let it recreate
3. Check SQLite logs in the terminal

## License

MIT
