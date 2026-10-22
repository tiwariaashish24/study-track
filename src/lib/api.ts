import { invoke } from "@tauri-apps/api/core";
import type { StudySession, TimerStateFrontend } from "./db-types";

export const api = {
  // Greeting
  getGreeting: (name: string) => invoke<string>("get_greeting", { name }),

  // Database
  initDatabase: () => invoke<void>("init_database"),

  // Timer
  startTimer: (timerType: string, targetSeconds?: number) =>
    invoke<TimerStateFrontend>("start_timer", {
      timerType,
      targetSeconds: targetSeconds ?? null,
    }),

  stopTimer: () => invoke<TimerStateFrontend>("stop_timer"),

  pauseTimer: () => invoke<TimerStateFrontend>("pause_timer"),

  resetTimer: () => invoke<TimerStateFrontend>("reset_timer"),

  getTimerState: () => invoke<TimerStateFrontend>("get_timer_state"),

  // Sessions
  createSession: (sessionType: string, durationSeconds: number) =>
    invoke<StudySession>("create_session", {
      sessionType,
      durationSeconds,
    }),

  getSessions: (limit?: number) =>
    invoke<StudySession[]>("get_sessions", { limit }),

  updateSession: (id: number, isCompleted?: boolean, notes?: string) =>
    invoke<StudySession>("update_session", {
      id,
      isCompleted,
      notes,
    }),
};
