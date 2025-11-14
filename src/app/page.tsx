"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Settings } from "lucide-react";
import { Task } from "@/types/task";
import { AppSettings, DEFAULT_SETTINGS } from "@/types/settings";
import { TaskItem } from "@/components/task-item";
import { DayNavigation } from "@/components/day-navigation";
import { AddTaskDialog } from "@/components/add-task-dialog";
import { SettingsSidebar } from "@/components/settings-sidebar";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Initialize tasks from localStorage only on client side
  const [tasks, setTasks] = useState<Task[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const storedTasks = localStorage.getItem("pomodoro-tasks");
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (e) {
        console.error("Failed to load tasks:", e);
      }
    }

    const storedSettings = localStorage.getItem("pomodoro-settings");
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change (only when mounted)
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("pomodoro-tasks", JSON.stringify(tasks));
    }
  }, [tasks, mounted]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("pomodoro-settings", JSON.stringify(settings));
    }
  }, [settings, mounted]);

  // Apply theme
  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (settings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(settings.theme);
    }
  }, [settings.theme, mounted]);

  const currentDateStr = format(currentDate, "yyyy-MM-dd");
  const todayTasks = tasks.filter((task) => task.date === currentDateStr);

  const handleAddTask = (newTask: Omit<Task, "id">) => {
    const task: Task = {
      ...newTask,
      id: `${Date.now()}-${Math.random()}`,
    };
    setTasks((prev) => [...prev, task]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const completedCount = todayTasks.filter((t) => t.completed).length;
  const totalCount = todayTasks.length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="space-y-6">
          {/* Header with day navigation and settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <DayNavigation
                currentDate={currentDate}
                onDateChange={setCurrentDate}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSettingsOpen(true)}
                className="h-9 w-9"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
            
            {totalCount > 0 && (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {completedCount} of {totalCount} tasks completed
              </div>
            )}
          </div>

          {/* Task list */}
          <div className="space-y-3">
            {todayTasks.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-zinc-500 dark:text-zinc-400">
                  No tasks for this day. Add one to get started!
                </p>
              </div>
            ) : (
              todayTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  settings={settings.pomodoro}
                />
              ))
            )}
          </div>

          {/* Add task button */}
          <AddTaskDialog date={currentDateStr} onAdd={handleAddTask} />
        </div>
      </div>

      {/* Settings Sidebar */}
      <SettingsSidebar
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
}

