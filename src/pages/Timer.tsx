import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Maximize2, Minimize2 } from "lucide-react";
import { api } from "../lib/api";
import { formatDuration } from "../lib/utils";
import { TIMER_TYPES } from "../lib/constants";

type TimerType = "stopwatch" | "countdown" | "pomodoro";

export default function Timer() {
  const [timerType, setTimerType] = useState<TimerType>("stopwatch");
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [targetSeconds, setTargetSeconds] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timerContainerRef = useRef<HTMLDivElement>(null);

  // Timer logic with elapsed-time approach for accuracy
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let startTime: number;
    let initialElapsed = elapsedSeconds;

    if (isRunning) {
      startTime = Date.now();
      interval = setInterval(() => {
        const now = Date.now();
        const additionalElapsed = Math.floor((now - startTime) / 1000);
        const newElapsed = initialElapsed + additionalElapsed;

        if (targetSeconds && newElapsed >= targetSeconds) {
          setIsRunning(false);
          setElapsedSeconds(targetSeconds);
        } else {
          setElapsedSeconds(newElapsed);
        }
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isRunning, targetSeconds]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        exitFullscreen();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isFullscreen]);

  const enterFullscreen = () => {
    if (timerContainerRef.current) {
      timerContainerRef.current.requestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const handleStart = async () => {
    try {
      if (window.__TAURI__) {
        const state = await api.startTimer(timerType, targetSeconds ?? undefined);
        setIsRunning(state.is_running);
        setElapsedSeconds(state.elapsed_seconds);
      } else {
        setIsRunning(true);
      }
    } catch (error) {
      console.error("Failed to start timer:", error);
      setIsRunning(true);
    }
  };

  const handlePause = async () => {
    try {
      if (window.__TAURI__) {
        const state = await api.pauseTimer();
        setIsRunning(state.is_running);
      } else {
        setIsRunning(false);
      }
    } catch (error) {
      console.error("Failed to pause timer:", error);
      setIsRunning(false);
    }
  };

  const handleReset = async () => {
    try {
      if (window.__TAURI__) {
        const state = await api.resetTimer();
        setIsRunning(state.is_running);
        setElapsedSeconds(state.elapsed_seconds);
      } else {
        setIsRunning(false);
        setElapsedSeconds(0);
      }
    } catch (error) {
      console.error("Failed to reset timer:", error);
      setIsRunning(false);
      setElapsedSeconds(0);
    }
  };

  const handleSaveSession = async () => {
    try {
      if (window.__TAURI__) {
        await api.createSession(timerType, elapsedSeconds);
      }
      handleReset();
      alert("Session saved successfully!");
    } catch (error) {
      console.error("Failed to save session:", error);
      alert("Failed to save session (running in dev mode without Tauri)");
      handleReset();
    }
  };

  const handleCountdownChange = (field: "hours" | "minutes" | "seconds", value: string) => {
    const num = parseInt(value) || 0;
    const hours = field === "hours" ? num : Math.floor((targetSeconds || 0) / 3600);
    const minutes = field === "minutes" ? num : Math.floor(((targetSeconds || 0) % 3600) / 60);
    const seconds = field === "seconds" ? num : (targetSeconds || 0) % 60;

    setTargetSeconds(hours * 3600 + minutes * 60 + seconds);
  };

  // Calculate progress for circular indicator
  const progress = targetSeconds ? (elapsedSeconds / targetSeconds) * 100 : 0;
  const circumference = 2 * Math.PI * 120; // radius = 120
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const displayTime = timerType === "countdown" && targetSeconds
    ? Math.max(0, targetSeconds - elapsedSeconds)
    : elapsedSeconds;

  return (
    <div
      ref={timerContainerRef}
      className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'p-8'}`}
    >
      {!isFullscreen && (
        <h1 className="text-[32px] font-semibold tracking-tight mb-8">Focus Timer</h1>
      )}

      <div className={`flex-1 flex flex-col items-center justify-center ${isFullscreen ? 'w-full h-full' : 'max-w-2xl mx-auto'}`}>
        {/* Timer Type Selector - Hidden in fullscreen */}
        {!isFullscreen && (
          <div className="flex gap-2 mb-8 w-full">
            {(["stopwatch", "countdown", "pomodoro"] as TimerType[]).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setTimerType(type);
                  handleReset();
                  setTargetSeconds(type === "pomodoro" ? 25 * 60 : null);
                }}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                  timerType === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-elevated"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Countdown Input - Hidden in fullscreen */}
        {timerType === "countdown" && !isRunning && !isFullscreen && (
          <div className="bg-card border border-border rounded-xl p-6 mb-8 w-full">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <input
                  type="number"
                  min="0"
                  max="23"
                  placeholder="00"
                  className="w-20 text-center text-3xl font-semibold bg-elevated border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-border text-foreground"
                  onChange={(e) => handleCountdownChange("hours", e.target.value)}
                />
                <div className="text-xs text-text-muted mt-2">Hours</div>
              </div>
              <span className="text-3xl font-semibold text-text-muted">:</span>
              <div className="text-center">
                <input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="00"
                  className="w-20 text-center text-3xl font-semibold bg-elevated border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-border text-foreground"
                  onChange={(e) => handleCountdownChange("minutes", e.target.value)}
                />
                <div className="text-xs text-text-muted mt-2">Minutes</div>
              </div>
              <span className="text-3xl font-semibold text-text-muted">:</span>
              <div className="text-center">
                <input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="00"
                  className="w-20 text-center text-3xl font-semibold bg-elevated border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-border text-foreground"
                  onChange={(e) => handleCountdownChange("seconds", e.target.value)}
                />
                <div className="text-xs text-text-muted mt-2">Seconds</div>
              </div>
            </div>
          </div>
        )}

        {/* Timer Display with Circular Progress */}
        <div className={`relative flex items-center justify-center ${isFullscreen ? 'w-full h-full' : 'mb-8'}`}>
          {/* Circular Progress Ring */}
          {targetSeconds && (
            <svg
              className={`absolute ${isFullscreen ? 'w-[400px] h-[400px]' : 'w-[320px] h-[320px]'} transition-all duration-225`}
              viewBox="0 0 280 280"
            >
              {/* Track */}
              <circle
                cx="140"
                cy="140"
                r="120"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="8"
              />
              {/* Progress */}
              <circle
                cx="140"
                cy="140"
                r="120"
                fill="none"
                stroke="hsl(var(--foreground))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 140 140)"
                className="transition-all duration-225 ease-out"
              />
            </svg>
          )}

          {/* Timer Display */}
          <div className={`text-center ${isFullscreen ? 'z-10' : ''}`}>
            <div className={`font-semibold tabular-nums tracking-tight ${isFullscreen ? 'text-[180px]' : 'text-[120px]'} text-foreground`}>
              {formatDuration(displayTime)}
            </div>
            <div className="text-text-muted capitalize mt-2 text-sm">
              {timerType} {isRunning && "• Running"}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-medium transition-all duration-200 hover:opacity-90 active:scale-[0.98] cursor-pointer"
            >
              <Play className="w-5 h-5" />
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-xl font-medium transition-all duration-200 hover:bg-elevated active:scale-[0.98] cursor-pointer"
            >
              <Pause className="w-5 h-5" />
              Pause
            </button>
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-4 rounded-xl font-medium transition-all duration-200 hover:bg-elevated active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={isFullscreen ? exitFullscreen : enterFullscreen}
            className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-4 rounded-xl font-medium transition-all duration-200 hover:bg-elevated active:scale-[0.98] cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Save Session - Hidden in fullscreen */}
        {elapsedSeconds > 0 && !isRunning && !isFullscreen && (
          <div className="text-center mt-6">
            <button
              onClick={handleSaveSession}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:opacity-90 active:scale-[0.98] cursor-pointer"
            >
              Save Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
