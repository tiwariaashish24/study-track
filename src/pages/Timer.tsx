import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";
import { api } from "../lib/api";
import { formatDuration } from "../lib/utils";
import { TIMER_TYPES } from "../lib/constants";

type TimerType = "stopwatch" | "countdown" | "pomodoro";

export default function Timer() {
  const [timerType, setTimerType] = useState<TimerType>("stopwatch");
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [targetSeconds, setTargetSeconds] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (targetSeconds && prev >= targetSeconds) {
            setIsRunning(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, targetSeconds]);

  const handleStart = async () => {
    try {
      const state = await api.startTimer(timerType, targetSeconds ?? undefined);
      setIsRunning(state.is_running);
      setElapsedSeconds(state.elapsed_seconds);
    } catch (error) {
      console.error("Failed to start timer:", error);
    }
  };

  const handlePause = async () => {
    try {
      const state = await api.pauseTimer();
      setIsRunning(state.is_running);
    } catch (error) {
      console.error("Failed to pause timer:", error);
    }
  };

  const handleReset = async () => {
    try {
      const state = await api.resetTimer();
      setIsRunning(state.is_running);
      setElapsedSeconds(state.elapsed_seconds);
    } catch (error) {
      console.error("Failed to reset timer:", error);
    }
  };

  const handleSaveSession = async () => {
    try {
      await api.createSession(timerType, elapsedSeconds);
      handleReset();
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  };

  const handleCountdownChange = (field: "hours" | "minutes" | "seconds", value: string) => {
    const num = parseInt(value) || 0;
    const hours = field === "hours" ? num : Math.floor((targetSeconds || 0) / 3600);
    const minutes = field === "minutes" ? num : Math.floor(((targetSeconds || 0) % 3600) / 60);
    const seconds = field === "seconds" ? num : (targetSeconds || 0) % 60;

    setTargetSeconds(hours * 3600 + minutes * 60 + seconds);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Focus Timer</h1>

      <div className="max-w-2xl mx-auto">
        {/* Timer Type Selector */}
        <div className="flex gap-2 mb-8">
          {(["stopwatch", "countdown", "pomodoro"] as TimerType[]).map((type) => (
            <button
              key={type}
              onClick={() => {
                setTimerType(type);
                handleReset();
                setTargetSeconds(type === "pomodoro" ? 25 * 60 : null);
              }}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                timerType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Countdown Input */}
        {timerType === "countdown" && !isRunning && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <input
                  type="number"
                  min="0"
                  max="23"
                  placeholder="00"
                  className="w-20 text-center text-3xl font-bold bg-secondary border border-border rounded-lg p-3"
                  onChange={(e) => handleCountdownChange("hours", e.target.value)}
                />
                <div className="text-sm text-muted-foreground mt-2">Hours</div>
              </div>
              <span className="text-3xl font-bold">:</span>
              <div className="text-center">
                <input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="00"
                  className="w-20 text-center text-3xl font-bold bg-secondary border border-border rounded-lg p-3"
                  onChange={(e) => handleCountdownChange("minutes", e.target.value)}
                />
                <div className="text-sm text-muted-foreground mt-2">Minutes</div>
              </div>
              <span className="text-3xl font-bold">:</span>
              <div className="text-center">
                <input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="00"
                  className="w-20 text-center text-3xl font-bold bg-secondary border border-border rounded-lg p-3"
                  onChange={(e) => handleCountdownChange("seconds", e.target.value)}
                />
                <div className="text-sm text-muted-foreground mt-2">Seconds</div>
              </div>
            </div>
          </div>
        )}

        {/* Timer Display */}
        <div className="bg-card border border-border rounded-lg p-12 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-16 h-16 text-primary" />
          </div>
          <div className="text-center">
            <div className="text-7xl font-bold mb-4">
              {timerType === "countdown" && targetSeconds
                ? formatDuration(Math.max(0, targetSeconds - elapsedSeconds))
                : formatDuration(elapsedSeconds)}
            </div>
            <div className="text-muted-foreground capitalize">
              {timerType} {isRunning && "• Running"}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center mb-8">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Play className="w-5 h-5" />
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-medium hover:bg-accent transition-colors"
            >
              <Pause className="w-5 h-5" />
              Pause
            </button>
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-medium hover:bg-accent transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>

        {/* Save Session */}
        {elapsedSeconds > 0 && !isRunning && (
          <div className="text-center">
            <button
              onClick={handleSaveSession}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Save Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
