import { Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [pomodoroDuration, setPomodoroDuration] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      alert("Data cleared (placeholder - implement actual clear in Phase 2)");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-[32px] font-semibold tracking-tight mb-8">Settings</h1>

      <div className="max-w-2xl space-y-5">
        <div className="bg-card border border-border rounded-xl p-6 transition-all duration-225 hover:border-border hover:bg-elevated">
          <h2 className="text-lg font-semibold mb-4">General</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Dark Mode</div>
                <div className="text-xs text-text-muted">
                  Use dark theme
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full relative transition-colors duration-200 cursor-pointer ${
                  darkMode ? "bg-foreground" : "bg-elevated"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-background rounded-full transition-transform duration-200 ${
                    darkMode ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 transition-all duration-225 hover:border-border hover:bg-elevated">
          <h2 className="text-lg font-semibold mb-4">Timer Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Pomodoro Work Duration (minutes)</label>
              <input
                type="number"
                value={pomodoroDuration}
                onChange={(e) => setPomodoroDuration(parseInt(e.target.value) || 25)}
                className="w-full bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-border text-foreground transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Short Break Duration (minutes)</label>
              <input
                type="number"
                value={shortBreak}
                onChange={(e) => setShortBreak(parseInt(e.target.value) || 5)}
                className="w-full bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-border text-foreground transition-all duration-200"
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 transition-all duration-225 hover:border-border hover:bg-elevated">
          <h2 className="text-lg font-semibold mb-4">Data</h2>
          <p className="text-sm text-text-muted mb-4">
            Your data is stored locally in: C:\Users\...\AppData\Roaming\StudyFlow
          </p>
          <button
            onClick={handleClearData}
            className="bg-destructive text-destructive-foreground px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-[0.98] cursor-pointer"
          >
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}
