"use client";

import { Task } from "@/types/task";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { PomodoroTimer } from "./pomodoro-timer";
import { Check, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onUpdate: (task: Task) => void;
}

export function TaskItem({ task, onUpdate }: TaskItemProps) {
  const handleToggleComplete = () => {
    onUpdate({ ...task, completed: !task.completed });
  };

  const handleCycleComplete = () => {
    const completedPomodoros = (task.completedPomodoros || 0) + 1;
    const isCompleted =
      task.pomodoroCount ? completedPomodoros >= task.pomodoroCount : false;
    onUpdate({
      ...task,
      completedPomodoros,
      completed: isCompleted,
      currentCycleTime: 0,
      isRunning: false,
    });
  };

  const handleTimeUpdate = (seconds: number) => {
    onUpdate({
      ...task,
      currentCycleTime: seconds,
    });
  };

  const handleStartPomodoro = () => {
    onUpdate({
      ...task,
      isRunning: true,
    });
  };

  if (task.type === "checklist") {
    return (
      <Card className={cn(task.completed && "opacity-60")}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleComplete}
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded border-2 transition-colors",
                task.completed
                  ? "bg-zinc-900 border-zinc-900 dark:bg-zinc-50 dark:border-zinc-50"
                  : "border-zinc-300 dark:border-zinc-700"
              )}
            >
              {task.completed && (
                <Check className="h-3 w-3 text-zinc-50 dark:text-zinc-900" />
              )}
            </button>
            <span
              className={cn(
                "flex-1 text-base",
                task.completed && "line-through"
              )}
            >
              {task.title}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Pomodoro task
  const totalCycles = task.pomodoroCount || 1;
  const completedCycles = task.completedPomodoros || 0;
  const progress = (completedCycles / totalCycles) * 100;

  return (
    <Card className={cn(task.completed && "opacity-60")}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium">{task.title}</h3>
            {!task.isRunning && !task.completed && (
              <Button
                size="icon"
                variant="ghost"
                onClick={handleStartPomodoro}
                className="h-8 w-8"
              >
                <Play className="h-4 w-4" />
              </Button>
            )}
          </div>

          {task.isRunning ? (
            <PomodoroTimer
              onCycleComplete={handleCycleComplete}
              onTimeUpdate={handleTimeUpdate}
              initialTime={task.currentCycleTime || 0}
            />
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
                <span>
                  {completedCycles} / {totalCycles} cycles
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                {Array.from({ length: totalCycles }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "absolute top-0 h-full transition-all",
                      i < completedCycles
                        ? "bg-zinc-900 dark:bg-zinc-50"
                        : "bg-transparent"
                    )}
                    style={{
                      left: `${(i / totalCycles) * 100}%`,
                      width: `${100 / totalCycles}%`,
                      borderRight:
                        i < totalCycles - 1
                          ? "2px solid white"
                          : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
