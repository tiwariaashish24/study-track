import { useState, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Timer from "./pages/Timer";
import Analytics from "./pages/Analytics";
import Library from "./pages/Library";
import Rules from "./pages/Rules";
import History from "./pages/History";
import Settings from "./pages/Settings";
import { NavigationProvider, useNavigation } from "./store/NavigationContext";

type Page = "dashboard" | "timer" | "analytics" | "library" | "rules" | "history" | "settings";

function AppContent() {
  const { currentPage } = useNavigation();
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    // Initialize database on app start
    const initDb = async () => {
      try {
        if (window.__TAURI__) {
          const { invoke } = await import("@tauri-apps/api/core");
          await invoke("init_database");
          setDbInitialized(true);
        } else {
          // For development without Tauri
          setDbInitialized(true);
        }
      } catch (error) {
        console.error("Failed to initialize database:", error);
        setDbInitialized(true); // Continue even if DB fails
      }
    };
    initDb();
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "timer":
        return <Timer />;
      case "analytics":
        return <Analytics />;
      case "library":
        return <Library />;
      case "rules":
        return <Rules />;
      case "history":
        return <History />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {!dbInitialized && (
          <div className="p-4 text-primary">
            Initializing database...
          </div>
        )}
        {renderPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}

export default App;
