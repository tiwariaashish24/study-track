import { Clock, TrendingUp, Target, Award } from "lucide-react";
import { useNavigation } from "../store/NavigationContext";

export default function Dashboard() {
  const { navigate } = useNavigation();

  return (
    <div className="p-8">
      <h1 className="text-[32px] font-semibold tracking-tight mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="group bg-card border border-border rounded-xl p-6 transition-all duration-225 hover:-translate-y-1 hover:border-border hover:bg-elevated">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-6 h-6 text-text-secondary group-hover:text-foreground transition-colors duration-200" />
            <span className="text-xs text-text-muted">Today</span>
          </div>
          <div className="text-2xl font-semibold tabular-nums">2h 34m</div>
          <div className="text-sm text-text-muted mt-1">
            Total study time
          </div>
        </div>

        <div className="group bg-card border border-border rounded-xl p-6 transition-all duration-225 hover:-translate-y-1 hover:border-border hover:bg-elevated">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-6 h-6 text-text-secondary group-hover:text-foreground transition-colors duration-200" />
            <span className="text-xs text-text-muted">This Week</span>
          </div>
          <div className="text-2xl font-semibold tabular-nums">18h 45m</div>
          <div className="text-sm text-text-muted mt-1">
            +12% from last week
          </div>
        </div>

        <div className="group bg-card border border-border rounded-xl p-6 transition-all duration-225 hover:-translate-y-1 hover:border-border hover:bg-elevated">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-6 h-6 text-text-secondary group-hover:text-foreground transition-colors duration-200" />
            <span className="text-xs text-text-muted">Daily Goal</span>
          </div>
          <div className="text-2xl font-semibold tabular-nums">78%</div>
          <div className="text-sm text-text-muted mt-1">
            2h 34m of 4h goal
          </div>
        </div>

        <div className="group bg-card border border-border rounded-xl p-6 transition-all duration-225 hover:-translate-y-1 hover:border-border hover:bg-elevated">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-6 h-6 text-text-secondary group-hover:text-foreground transition-colors duration-200" />
            <span className="text-xs text-text-muted">Streak</span>
          </div>
          <div className="text-2xl font-semibold tabular-nums">7 days</div>
          <div className="text-sm text-text-muted mt-1">
            Keep it up!
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Sessions</h2>
          <div className="space-y-3">
            <div className="group flex items-center justify-between py-3 border-b border-border hover:bg-elevated rounded-lg px-2 -mx-2 transition-colors duration-200 cursor-pointer">
              <div>
                <div className="text-sm font-medium">Pomodoro Session</div>
                <div className="text-xs text-text-muted">Today, 2:30 PM</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium tabular-nums">25m</div>
                <div className="text-xs text-text-muted">Completed</div>
              </div>
            </div>
            <div className="group flex items-center justify-between py-3 border-b border-border hover:bg-elevated rounded-lg px-2 -mx-2 transition-colors duration-200 cursor-pointer">
              <div>
                <div className="text-sm font-medium">Stopwatch</div>
                <div className="text-xs text-text-muted">Today, 1:00 PM</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium tabular-nums">1h 15m</div>
                <div className="text-xs text-text-muted">Completed</div>
              </div>
            </div>
            <div className="group flex items-center justify-between py-3 hover:bg-elevated rounded-lg px-2 -mx-2 transition-colors duration-200 cursor-pointer">
              <div>
                <div className="text-sm font-medium">Countdown</div>
                <div className="text-xs text-text-muted">Yesterday, 8:00 PM</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium tabular-nums">45m</div>
                <div className="text-xs text-text-muted">Completed</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate("timer")}
              className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:opacity-90 active:scale-[0.98] cursor-pointer"
            >
              Start Focus Session
            </button>
            <button
              onClick={() => navigate("analytics")}
              className="w-full bg-secondary text-secondary-foreground px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-elevated active:scale-[0.98] cursor-pointer"
            >
              View Analytics
            </button>
            <button
              onClick={() => navigate("rules")}
              className="w-full bg-secondary text-secondary-foreground px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-elevated active:scale-[0.98] cursor-pointer"
            >
              Manage Website Rules
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
