"use client";

import { X, Settings as SettingsIcon, Sun, Moon, Monitor } from "lucide-react";
import { Button } from "./ui/button";
import { AppSettings } from "@/types/settings";
import { cn } from "@/lib/utils";

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

export function SettingsSidebar({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}: SettingsSidebarProps) {
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    onSettingsChange({ ...settings, theme });
  };

  const handlePomodoroChange = (field: keyof AppSettings['pomodoro'], value: number) => {
    onSettingsChange({
      ...settings,
      pomodoro: { ...settings.pomodoro, [field]: value },
    });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-80 bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Settings</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Theme Settings */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Theme</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors",
                    settings.theme === 'light'
                      ? "border-zinc-900 dark:border-zinc-50 bg-zinc-100 dark:bg-zinc-900"
                      : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  )}
                >
                  <Sun className="h-5 w-5" />
                  <span className="text-xs">Light</span>
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors",
                    settings.theme === 'dark'
                      ? "border-zinc-900 dark:border-zinc-50 bg-zinc-100 dark:bg-zinc-900"
                      : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  )}
                >
                  <Moon className="h-5 w-5" />
                  <span className="text-xs">Dark</span>
                </button>
                <button
                  onClick={() => handleThemeChange('system')}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors",
                    settings.theme === 'system'
                      ? "border-zinc-900 dark:border-zinc-50 bg-zinc-100 dark:bg-zinc-900"
                      : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  )}
                >
                  <Monitor className="h-5 w-5" />
                  <span className="text-xs">System</span>
                </button>
              </div>
            </div>

            {/* Pomodoro Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Pomodoro Timer</h3>
              
              <div className="space-y-2">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">
                  Work Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.pomodoro.workDuration}
                  onChange={(e) => handlePomodoroChange('workDuration', parseInt(e.target.value) || 25)}
                  className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">
                  Short Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.pomodoro.breakDuration}
                  onChange={(e) => handlePomodoroChange('breakDuration', parseInt(e.target.value) || 5)}
                  className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">
                  Long Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.pomodoro.longBreakDuration}
                  onChange={(e) => handlePomodoroChange('longBreakDuration', parseInt(e.target.value) || 15)}
                  className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">
                  Cycles Before Long Break
                </label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={settings.pomodoro.cyclesBeforeLongBreak}
                  onChange={(e) => handlePomodoroChange('cyclesBeforeLongBreak', parseInt(e.target.value) || 4)}
                  className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
