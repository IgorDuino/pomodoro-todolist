"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Task } from "@/types/task";
import { TaskItem } from "@/components/task-item";
import { DayNavigation } from "@/components/day-navigation";
import { AddTaskDialog } from "@/components/add-task-dialog";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Load tasks from localStorage on mount
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("pomodoro-tasks");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to load tasks:", e);
        }
      }
    }
    return [];
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("pomodoro-tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

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
          {/* Header with day navigation */}
          <div className="space-y-4">
            <DayNavigation
              currentDate={currentDate}
              onDateChange={setCurrentDate}
            />
            
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
                />
              ))
            )}
          </div>

          {/* Add task button */}
          <AddTaskDialog date={currentDateStr} onAdd={handleAddTask} />
        </div>
      </div>
    </div>
  );
}
