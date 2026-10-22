import { Home, Timer, BarChart3, BookOpen, Shield, History, Settings } from "lucide-react";
import { cn } from "../../lib/utils";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "timer", label: "Focus Timer", icon: Timer },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "library", label: "Study Library", icon: BookOpen },
  { id: "rules", label: "Website Rules", icon: Shield },
  { id: "history", label: "Session History", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-secondary border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">StudyFlow</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Focus. Learn. Achieve.
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          Version 0.1.0
        </div>
      </div>
    </aside>
  );
}
