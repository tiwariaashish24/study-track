import { BarChart3 } from "lucide-react";

export default function Analytics() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Activity Analytics</h1>

      <div className="flex items-center justify-center h-96 bg-card border border-border rounded-lg">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Analytics coming in Phase 2
          </p>
        </div>
      </div>
    </div>
  );
}
