export interface User {
  id: number;
  created_at: string;
  timezone: string;
  theme: string;
}

export interface UserPreference {
  id: number;
  user_id: number;
  key: string;
  value: string;
  updated_at: string;
}

export interface StudySession {
  id: number;
  user_id: number;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number;
  session_type: 'stopwatch' | 'countdown' | 'pomodoro';
  pomodoro_cycle: number;
  is_completed: boolean;
  notes: string | null;
  created_at: string;
}

export interface ActivityEvent {
  id: number;
  session_id: number | null;
  timestamp: string;
  event_type: 'focus' | 'break' | 'idle' | 'distraction';
  app_name: string | null;
  domain: string | null;
  duration_seconds: number;
  metadata: string | null;
  created_at: string;
}

export interface AppUsage {
  id: number;
  user_id: number;
  date: string;
  app_name: string;
  domain: string | null;
  category: string | null;
  duration_seconds: number;
  is_distraction: boolean;
  created_at: string;
}

export interface WebsiteRule {
  id: number;
  user_id: number;
  domain: string;
  rule_type: 'allow' | 'block';
  category: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudyGoal {
  id: number;
  user_id: number;
  goal_type: 'daily' | 'weekly';
  target_seconds: number;
  created_at: string;
  is_active: boolean;
}

export interface ReminderSetting {
  id: number;
  user_id: number;
  reminder_type: 'hourly' | 'session_complete' | 'break' | 'daily_goal';
  is_enabled: boolean;
  schedule: string | null;
  message: string | null;
  created_at: string;
  updated_at: string;
}

export interface TimerState {
  id: number;
  user_id: number;
  timer_type: 'stopwatch' | 'countdown' | 'pomodoro';
  is_running: boolean;
  elapsed_seconds: number;
  target_seconds: number | null;
  session_id: number | null;
  started_at: string | null;
  last_updated: string;
}

export interface TimerStateFrontend {
  timer_type: 'stopwatch' | 'countdown' | 'pomodoro';
  is_running: boolean;
  elapsed_seconds: number;
  target_seconds: number | null;
  started_at: string | null;
  last_updated: string;
}
