# Pomodoro Todo List

A modern productivity application built with Next.js that combines task management with the Pomodoro Technique.

## Features

- **Two Task Types:**
  - **Checklist Tasks**: Simple tasks that can be checked off when completed
  - **Pomodoro Tasks**: Tasks that are divided into 25-minute Pomodoro cycles with progress tracking

- **Pomodoro Timer:**
  - 25-minute work sessions
  - 5-minute break intervals
  - Visual circular progress indicator
  - Play/pause and reset controls

- **Day Navigation:**
  - Browse tasks across different days
  - Quick navigation with arrow buttons
  - "Today" button for instant return to current day
  - Smart date labels (Today, Tomorrow, Yesterday, or full date)

- **Progress Tracking:**
  - Visual progress bars for Pomodoro tasks divided into sections
  - Task completion counter
  - Persistent storage using localStorage

- **Modern UI:**
  - Built with shadcn/ui-inspired components
  - Clean, minimalist design
  - Dark mode support
  - Responsive layout

## Screenshots

![Empty State](https://github.com/user-attachments/assets/568a4f4b-7bcb-4e4d-8a8f-c7cba9bf6370)

![Tasks Added](https://github.com/user-attachments/assets/c71fe35f-c544-460b-aa55-fb858b547267)

![Timer Running](https://github.com/user-attachments/assets/20a143d4-12cc-485d-b15a-0f7ec014a069)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

1. **Adding a Task:**
   - Click the "Add Task" button
   - Enter a task title
   - Choose between "Checklist" or "Pomodoro" type
   - For Pomodoro tasks, set the number of 25-minute cycles (1-12)

2. **Completing Checklist Tasks:**
   - Click the checkbox next to the task to mark it complete

3. **Working on Pomodoro Tasks:**
   - Click the play button (▶) to start the timer
   - The timer shows a circular progress indicator
   - Use pause (⏸) to pause the timer
   - Use reset (↻) to restart the current cycle
   - When a cycle completes, you'll be offered a 5-minute break
   - Progress bars show completed cycles

4. **Navigating Days:**
   - Use left/right arrows to move between days
   - Click "Today" to return to the current day
   - Tasks are organized by day

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Custom components inspired by shadcn/ui
- **Icons:** Lucide React
- **Date Handling:** date-fns

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main application page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── task-item.tsx      # Task display component
│   │   ├── pomodoro-timer.tsx # Timer component
│   │   ├── day-navigation.tsx # Day selector
│   │   └── add-task-dialog.tsx# Task creation form
│   ├── types/
│   │   └── task.ts            # TypeScript interfaces
│   └── lib/
│       └── utils.ts           # Utility functions
```

## License

MIT

