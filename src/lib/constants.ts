export const POMODORO_DEFAULTS = {
  workDuration: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
  cyclesBeforeLongBreak: 4,
};

export const TIMER_TYPES = {
  STOPWATCH: "stopwatch",
  COUNTDOWN: "countdown",
  POMODORO: "pomodoro",
} as const;

export const CATEGORIES = {
  PROGRAMMING: "programming",
  DOCUMENTATION: "documentation",
  COURSES: "courses",
  EDUCATIONAL_VIDEOS: "educational_videos",
  SOCIAL: "social",
  ENTERTAINMENT: "entertainment",
  NEWS: "news",
  OTHER: "other",
} as const;
