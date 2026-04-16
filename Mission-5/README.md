# Mission 5 Task Board

Mission 5 is a React task board application built with Vite, Tailwind CSS, and dnd-kit. It lets you create tasks, assign priorities, search through tasks, drag cards between columns, and edit or delete items inline. Task data is saved in the browser with localStorage, so your board stays after refresh.

## Live Demo

https://mission5.vercel.app/

## Features

- Create tasks with a title and priority.
- Search tasks by name.
- Drag and drop tasks between To Do, In Progress, and Done.
- Edit task text inline.
- Delete tasks from any column.
- Move tasks with button controls as well as drag and drop.
- Persist tasks in localStorage.
- Responsive layout built with Tailwind CSS.

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 4
- dnd-kit for drag and drop
- localStorage for persistence

## Project Structure

- src/App.jsx: Main board logic, state management, search, task actions, and drag-and-drop context.
- src/components/TaskCard.jsx: Individual draggable task card.
- src/components/TaskColumn.jsx: Shared column layout and drop zone.
- src/components/Todo.jsx: To Do column wrapper.
- src/components/Inprogress.jsx: In Progress column wrapper.
- src/components/Done.jsx: Done column wrapper.

## How It Works

1. The app starts with saved tasks from localStorage if they exist.
2. If nothing is saved, fallback tasks are loaded.
3. Tasks can be added through the form at the top of the page.
4. The board filters tasks by the search field.
5. Each card can be dragged to another column or moved using buttons.
6. Clicking a task lets you edit its text inline.
7. Changes are written back to localStorage automatically.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Notes

- Tailwind is imported directly through src/App.css.
- Dragging uses PointerSensor from dnd-kit with an activation distance to reduce accidental drags.
- The app is responsive and uses a one-column layout on small screens, then expands to multiple columns on larger screens.
