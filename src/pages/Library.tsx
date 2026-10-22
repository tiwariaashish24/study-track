import { BookOpen } from "lucide-react";

export default function Library() {
  return (
    <div className="p-8">
      <h1 className="text-[32px] font-semibold tracking-tight mb-8">Study Library</h1>

      <div className="flex items-center justify-center h-96 bg-card border border-border rounded-xl transition-all duration-225 hover:border-border hover:bg-elevated">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <p className="text-text-muted mb-4">
            Study library coming in Phase 4
          </p>
          <p className="text-sm text-text-muted">
            This will include course management, study materials, and resources
          </p>
        </div>
      </div>
    </div>
  );
}
