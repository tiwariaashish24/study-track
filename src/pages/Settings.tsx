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
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="max-w-2xl space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
          <h2 className="text-xl font-semibold mb-4">General</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Dark Mode</div>
                <div className="text-sm text-muted-foreground">
                  Use dark theme
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${
                  darkMode ? "bg-primary" : "bg-secondary"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    darkMode ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
          <h2 className="text-xl font-semibold mb-4">Timer Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Pomodoro Work Duration (minutes)</label>
              <input
                type="number"
                value={pomodoroDuration}
                onChange={(e) => setPomodoroDuration(parseInt(e.target.value) || 25)}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Short Break Duration (minutes)</label>
              <input
                type="number"
                value={shortBreak}
                onChange={(e) => setShortBreak(parseInt(e.target.value) || 5)}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
          <h2 className="text-xl font-semibold mb-4">Data</h2>
          <p className="text-muted-foreground mb-4">
            Your data is stored locally in: C:\Users\...\AppData\Roaming\StudyFlow
          </p>
          <button
            onClick={handleClearData}
            className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}
