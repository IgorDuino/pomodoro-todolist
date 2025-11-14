"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface PomodoroTimerProps {
  onCycleComplete: () => void;
  onTimeUpdate?: (seconds: number) => void;
  initialTime?: number;
  className?: string;
}

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds
const BREAK_DURATION = 5 * 60; // 5 minutes in seconds

export function PomodoroTimer({
  onCycleComplete,
  onTimeUpdate,
  initialTime = 0,
  className,
}: PomodoroTimerProps) {
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
          // Offer a break
          setIsBreak(true);
          setTimeLeft(BREAK_DURATION);
        } else {
          // Break completed
          setIsBreak(false);
          setTimeLeft(POMODORO_DURATION);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isRunning, isBreak, onCycleComplete]);

  // Update parent component with current time
  useEffect(() => {
    if (isRunning && !isBreak && onTimeUpdate) {
      onTimeUpdate(POMODORO_DURATION - timeLeft);
    }
  }, [timeLeft, isRunning, isBreak, onTimeUpdate]);

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(isBreak ? BREAK_DURATION : POMODORO_DURATION);
  }, [isBreak]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = isBreak
    ? ((BREAK_DURATION - timeLeft) / BREAK_DURATION) * 100
    : ((POMODORO_DURATION - timeLeft) / POMODORO_DURATION) * 100;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative">
        <svg className="h-16 w-16 -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-zinc-200 dark:text-zinc-800"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
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
          <span className="text-xs font-mono">{formatTime(timeLeft)}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleTimer}
          className="h-8 w-8"
        >
          {isRunning ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={resetTimer}
          className="h-8 w-8"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      {isBreak && (
        <span className="text-sm text-green-600 dark:text-green-400">
          Break time!
        </span>
      )}
    </div>
  );
}
