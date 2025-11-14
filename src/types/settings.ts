export interface PomodoroSettings {
  workDuration: number; // in minutes
  breakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  cyclesBeforeLongBreak: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  pomodoro: PomodoroSettings;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  pomodoro: {
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    cyclesBeforeLongBreak: 4,
  },
};
