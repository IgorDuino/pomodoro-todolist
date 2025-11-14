"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Save } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { PomodoroSettings } from "@/types/settings";

interface PomodoroTimerProps {
  onCycleComplete: () => void;
  onTimeUpdate?: (seconds: number) => void;
  onSaveProgress?: () => void;
  initialTime?: number;
  completedCycles?: number;
  settings: PomodoroSettings;
  className?: string;
}

export function PomodoroTimer({
  onCycleComplete,
  onTimeUpdate,
  onSaveProgress,
  initialTime = 0,
  completedCycles = 0,
  settings,
  className,
}: PomodoroTimerProps) {
  const POMODORO_DURATION = settings.workDuration * 60;
  const BREAK_DURATION = settings.breakDuration * 60;
  const LONG_BREAK_DURATION = settings.longBreakDuration * 60;

  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION - initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  // Handle timer reaching zero - use setTimeout to defer state updates
  useEffect(() => {
    if (timeLeft === 0 && !isRunning) {
      const timer = setTimeout(() => {
        if (!isBreak) {
          // Pomodoro cycle completed
          onCycleComplete();
          // Determine break type
          const isLongBreak = (completedCycles + 1) % settings.cyclesBeforeLongBreak === 0;
          setIsBreak(true);
          setTimeLeft(isLongBreak ? LONG_BREAK_DURATION : BREAK_DURATION);
        } else {
          // Break completed
          setIsBreak(false);
          setTimeLeft(POMODORO_DURATION);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isRunning, isBreak, onCycleComplete, completedCycles, settings.cyclesBeforeLongBreak, BREAK_DURATION, LONG_BREAK_DURATION, POMODORO_DURATION]);

  // Update parent component with current time - only when timer stops
  useEffect(() => {
    if (!isRunning && !isBreak && onTimeUpdate && timeLeft < POMODORO_DURATION) {
      onTimeUpdate(POMODORO_DURATION - timeLeft);
    }
  }, [isRunning]); // Only update when running state changes


  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(isBreak ? BREAK_DURATION : POMODORO_DURATION);
  }, [isBreak, BREAK_DURATION, POMODORO_DURATION]);

  const handleSaveProgress = useCallback(() => {
    setIsRunning(false);
    if (onSaveProgress) {
      onSaveProgress();
    }
  }, [onSaveProgress]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentDuration = isBreak 
    ? ((completedCycles + 1) % settings.cyclesBeforeLongBreak === 0 ? LONG_BREAK_DURATION : BREAK_DURATION)
    : POMODORO_DURATION;
  
  const progress = ((currentDuration - timeLeft) / currentDuration) * 100;
  const timeElapsed = POMODORO_DURATION - timeLeft;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Circular Timer */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <svg className="h-20 w-20 -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-zinc-200 dark:text-zinc-800"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
              className={cn(
                "transition-all",
                isBreak
                  ? "text-green-500"
                  : "text-zinc-900 dark:text-zinc-50"
              )}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-mono font-semibold">{formatTime(timeLeft)}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleTimer}
              className="h-9 w-9"
            >
              {isRunning ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={resetTimer}
              className="h-9 w-9"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            {!isBreak && timeElapsed > 0 && (
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSaveProgress}
                className="h-9 w-9"
                title="Save progress"
              >
                <Save className="h-5 w-5" />
              </Button>
            )}
          </div>
          {isBreak && (
            <span className="text-xs text-green-600 dark:text-green-400">
              {(completedCycles + 1) % settings.cyclesBeforeLongBreak === 0 ? 'Long break!' : 'Break time!'}
            </span>
          )}
        </div>
      </div>

      {/* Dual Progress Bars */}
      {!isBreak && (
        <div className="space-y-2">
          {/* Current Session Progress */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
              <span>Current session</span>
              <span>{formatTime(timeElapsed)} / {formatTime(POMODORO_DURATION)}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Overall Cycle Time Progress */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
              <span>Session time invested</span>
              <span>{formatTime(timeElapsed)}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:text-zinc-800">
              <div
                className="h-full bg-zinc-900 dark:bg-zinc-50 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

