import { useState, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Timer from "./pages/Timer";
import Analytics from "./pages/Analytics";
import Library from "./pages/Library";
import Rules from "./pages/Rules";
import History from "./pages/History";
import Settings from "./pages/Settings";

type Page = "dashboard" | "timer" | "analytics" | "library" | "rules" | "history" | "settings";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    // Initialize database on app start
    const initDb = async () => {
      try {
        if (window.__TAURI__) {
          const { invoke } = await import("@tauri-apps/api/core");
          await invoke("init_database");
          setDbInitialized(true);
        }
      } catch (error) {
        console.error("Failed to initialize database:", error);
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
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {!dbInitialized && (
          <div className="p-4 text-yellow-500">
            Initializing database...
          </div>
        )}
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
