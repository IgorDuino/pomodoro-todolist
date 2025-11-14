export interface Task {
  id: string;
  title: string;
  type: 'checklist' | 'pomodoro';
  completed: boolean;
  date: string; // ISO date string
  // Pomodoro-specific fields
  pomodoroCount?: number; // Total number of 25-min cycles
  completedPomodoros?: number; // Completed cycles
  currentCycleTime?: number; // Time in current cycle (seconds)
  isRunning?: boolean;
}

export interface DayTasks {
  date: string;
  tasks: Task[];
}
