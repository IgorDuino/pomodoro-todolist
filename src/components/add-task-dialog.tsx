"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Plus, X } from "lucide-react";
import { Task } from "@/types/task";

interface AddTaskDialogProps {
  date: string;
  onAdd: (task: Omit<Task, "id">) => void;
}

export function AddTaskDialog({ date, onAdd }: AddTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"checklist" | "pomodoro">("checklist");
  const [pomodoroCount, setPomodoroCount] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      type,
      completed: false,
      date,
      ...(type === "pomodoro" && {
        pomodoroCount,
        completedPomodoros: 0,
        currentCycleTime: 0,
        isRunning: false,
      }),
    });

    setTitle("");
    setPomodoroCount(1);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Task
      </Button>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">New Task</h3>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title..."
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-50"
            autoFocus
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Task Type</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={type === "checklist" ? "default" : "outline"}
                onClick={() => setType("checklist")}
                className="flex-1"
              >
                Checklist
              </Button>
              <Button
                type="button"
                variant={type === "pomodoro" ? "default" : "outline"}
                onClick={() => setType("pomodoro")}
                className="flex-1"
              >
                Pomodoro
              </Button>
            </div>
          </div>

          {type === "pomodoro" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Number of Cycles (25 min each)
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={pomodoroCount}
                onChange={(e) => setPomodoroCount(parseInt(e.target.value) || 1)}
                className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-50"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Add Task
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
