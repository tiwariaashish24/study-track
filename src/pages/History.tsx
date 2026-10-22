import { useState, useEffect } from "react";
import { History as HistoryIcon } from "lucide-react";
import { api } from "../lib/api";
import type { StudySession } from "../lib/db-types";
import { formatDuration, formatDate } from "../lib/utils";

export default function History() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await api.getSessions(50);
        setSessions(data);
      } catch (error) {
        console.error("Failed to load sessions:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSessions();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Session History</h1>
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Session History</h1>

      {sessions.length === 0 ? (
        <div className="flex items-center justify-center h-96 bg-card border border-border rounded-lg">
          <div className="text-center">
            <HistoryIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No sessions yet. Start a timer to track your study time!
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-left p-4 font-medium">Duration</th>
                <th className="text-left p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id} className="border-b border-border">
                  <td className="p-4 capitalize">{session.session_type}</td>
                  <td className="p-4">
                    {formatDate(new Date(session.started_at))}
                  </td>
                  <td className="p-4">{formatDuration(session.duration_seconds)}</td>
                  <td className="p-4">
                    {session.is_completed ? (
                      <span className="text-green-500">Completed</span>
                    ) : (
                      <span className="text-yellow-500">Incomplete</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
