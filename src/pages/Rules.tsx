import { Shield } from "lucide-react";

export default function Rules() {
  return (
    <div className="p-8">
      <h1 className="text-[32px] font-semibold tracking-tight mb-8">Website Rules</h1>

      <div className="flex items-center justify-center h-96 bg-card border border-border rounded-xl transition-all duration-225 hover:border-border hover:bg-elevated">
        <div className="text-center">
          <Shield className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <p className="text-text-muted mb-4">
            Website rules coming in Phase 4
          </p>
          <p className="text-sm text-text-muted">
            This will include website blocking, allowlists, and focus mode
          </p>
        </div>
      </div>
    </div>
  );
}
