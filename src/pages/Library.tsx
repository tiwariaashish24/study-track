import { BookOpen } from "lucide-react";

export default function Library() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Study Library</h1>

      <div className="flex items-center justify-center h-96 bg-card border border-border rounded-lg">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Study library coming in Phase 4
          </p>
        </div>
      </div>
    </div>
  );
}
