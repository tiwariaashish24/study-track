import { Home, Timer, BarChart3, BookOpen, Shield, History as HistoryIcon, Settings as SettingsIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { useNavigation } from "../../store/NavigationContext";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "timer", label: "Focus Timer", icon: Timer },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "library", label: "Study Library", icon: BookOpen },
  { id: "rules", label: "Website Rules", icon: Shield },
  { id: "history", label: "Session History", icon: HistoryIcon },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

export default function Sidebar() {
  const { currentPage, navigate } = useNavigation();

  return (
    <aside className="w-64 bg-sidebar border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          StudyFlow
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Focus. Learn. Achieve.
        </p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id as any)}
              className={cn(
                "group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-elevated text-foreground border-l-2 border-border"
                  : "text-text-secondary hover:bg-elevated hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-transform duration-200",
                !isActive && "group-hover:scale-110"
              )} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-text-muted">
          Version 0.1.0
        </div>
      </div>
    </aside>
  );
}
