import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="max-w-2xl space-y-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">General</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Dark Mode</div>
                <div className="text-sm text-muted-foreground">
                  Use dark theme
                </div>
              </div>
              <button className="w-12 h-6 bg-primary rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Timer Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Pomodoro Work Duration</label>
              <input
                type="number"
                defaultValue="25"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Short Break Duration</label>
              <input
                type="number"
                defaultValue="5"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2"
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Data</h2>
          <p className="text-muted-foreground mb-4">
            Your data is stored locally in: C:\Users\...\AppData\Roaming\StudyFlow
          </p>
          <button className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg">
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}
