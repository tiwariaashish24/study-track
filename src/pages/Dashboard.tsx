import { Clock, TrendingUp, Target, Award } from "lucide-react";
import { useNavigation } from "../store/NavigationContext";

export default function Dashboard() {
  const { navigate } = useNavigation();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-primary" />
            <span className="text-sm text-muted-foreground">Today</span>
          </div>
          <div className="text-3xl font-bold">2h 34m</div>
          <div className="text-sm text-muted-foreground mt-1">
            Total study time
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <span className="text-sm text-muted-foreground">This Week</span>
          </div>
          <div className="text-3xl font-bold">18h 45m</div>
          <div className="text-sm text-muted-foreground mt-1">
            +12% from last week
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-blue-400" />
            <span className="text-sm text-muted-foreground">Daily Goal</span>
          </div>
          <div className="text-3xl font-bold">78%</div>
          <div className="text-sm text-muted-foreground mt-1">
            2h 34m of 4h goal
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8 text-primary" />
            <span className="text-sm text-muted-foreground">Streak</span>
          </div>
          <div className="text-3xl font-bold">7 days</div>
          <div className="text-sm text-muted-foreground mt-1">
            Keep it up!
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <div className="font-medium">Pomodoro Session</div>
                <div className="text-sm text-muted-foreground">Today, 2:30 PM</div>
              </div>
              <div className="text-right">
                <div className="font-medium">25m</div>
                <div className="text-sm text-green-400">Completed</div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <div className="font-medium">Stopwatch</div>
                <div className="text-sm text-muted-foreground">Today, 1:00 PM</div>
              </div>
              <div className="text-right">
                <div className="font-medium">1h 15m</div>
                <div className="text-sm text-green-400">Completed</div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium">Countdown</div>
                <div className="text-sm text-muted-foreground">Yesterday, 8:00 PM</div>
              </div>
              <div className="text-right">
                <div className="font-medium">45m</div>
                <div className="text-sm text-green-400">Completed</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate("timer")}
              className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity cursor-pointer"
            >
              Start Focus Session
            </button>
            <button
              onClick={() => navigate("analytics")}
              className="w-full bg-secondary text-secondary-foreground px-4 py-3 rounded-lg font-medium hover:bg-accent transition-colors cursor-pointer"
            >
              View Analytics
            </button>
            <button
              onClick={() => navigate("rules")}
              className="w-full bg-secondary text-secondary-foreground px-4 py-3 rounded-lg font-medium hover:bg-accent transition-colors cursor-pointer"
            >
              Manage Website Rules
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
