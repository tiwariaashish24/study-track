import { Shield } from "lucide-react";

export default function Rules() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Website Rules</h1>

      <div className="flex items-center justify-center h-96 bg-card border border-border rounded-lg hover:border-primary transition-colors">
        <div className="text-center">
          <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            Website rules coming in Phase 4
          </p>
          <p className="text-sm text-muted-foreground">
            This will include website blocking, allowlists, and focus mode
          </p>
        </div>
      </div>
    </div>
  );
}
