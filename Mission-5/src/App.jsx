import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Todo from "./components/Todo";
import Inprogress from "./components/Inprogress";
import Done from "./components/Done";
import "./App.css";

const PRIORITIES = ["High", "Medium", "Low"];
const STORAGE_KEY = "mission5.tasks";

const priorityClassByValue = {
  High: "border-red-500",
  Medium: "border-yellow-400",       
  Low: "border-green-500",
};

const initialFallbackTasks = [
  {
    id: "t-1",
    text: "Learn dnd-kit basics",
    priority: "Medium",
    status: "todo",
  },
  {
    id: "t-2",
    text: "Drag this card to Done",
    priority: "High",
    status: "inprogress",
  },
];

function loadTasksFromStorage() {
  if (typeof window === "undefined") {
    return initialFallbackTasks;
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return initialFallbackTasks;
    }

    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      return initialFallbackTasks;
    }

    return parsed;
  } catch {
    return initialFallbackTasks;
  }
}

function App() {
  const [tasks, setTasks] = useState(loadTasksFromStorage);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [searchTerm, setSearchTerm] = useState("");

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return tasks;
    }

    return tasks.filter((task) => task.text.toLowerCase().includes(query));
  }, [searchTerm, tasks]);

  const addTask = (event) => {
    event.preventDefault();
    const value = newTaskText.trim();
    if (!value) {
      return;
    }

    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `task-${Date.now()}`;

    setTasks((previousTasks) => [
      ...previousTasks,
      {
        id,
        text: value,
        priority: newTaskPriority,
        status: "todo",
      },
    ]);

    setNewTaskText("");
    setNewTaskPriority("Medium");
  };

  const deleteTask = (taskId) => {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== taskId),
    );

    if (editingTaskId === taskId) {
      setEditingTaskId(null);
      setEditingValue("");
    }
  };

  const moveTask = (taskId, targetStatus) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId ? { ...task, status: targetStatus } : task,
      ),
    );
  };

  const startEditingTask = (task) => {
    setEditingTaskId(task.id);
    setEditingValue(task.text);
  };

  const saveEditingTask = () => {
    if (!editingTaskId) {
      return;
    }

    const value = editingValue.trim();
    if (!value) {
      return;
    }

    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === editingTaskId ? { ...task, text: value } : task,
      ),
    );
    setEditingTaskId(null);
    setEditingValue("");
  };

  const cancelEditingTask = () => {
    setEditingTaskId(null);
    setEditingValue("");
  };

  const onDragEnd = ({ active, over }) => {
    if (!over) {
      return;
    }

    const draggedTaskId = active.data.current?.taskId;
    if (!draggedTaskId) {
      return;
    }

    const destinationStatus = over.data.current?.status;
    if (!destinationStatus) {
      return;
    }

    moveTask(draggedTaskId, destinationStatus);
  };

  return (
    <main className="min-h-screen px-6 py-8 mx-auto max-w-8xl bg-gradient-to-b from-blue-50 to-slate-50">
      <header>
        <h1 className="m-0 mb-4 text-4xl font-bold">Mission 5 Task Board</h1>

        <div className="grid grid-cols-1 gap-3">
          <input
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 focus-visible:border-blue-600"
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search tasks by name"
          />

          <form
            className="grid grid-cols-1 gap-2 sm:grid-cols-3"
            onSubmit={addTask}
          >
            <input
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 focus-visible:border-blue-600"
              type="text"
              value={newTaskText}
              onChange={(event) => setNewTaskText(event.target.value)}
              placeholder="Add a task"
            />

            <select
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 focus-visible:border-blue-600"
              value={newTaskPriority}
              onChange={(event) => setNewTaskPriority(event.target.value)}
            >
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-3 py-2 font-semibold text-white bg-blue-600 border-0 rounded-lg cursor-pointer hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Add
            </button>
          </form>
        </div>
      </header>

      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <section className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
          <Todo
            tasks={filteredTasks.filter((task) => task.status === "todo")}
            onDelete={deleteTask}
            onMove={moveTask}
            onStartEditing={startEditingTask}
            onSaveEditing={saveEditingTask}
            onCancelEditing={cancelEditingTask}
            editingTaskId={editingTaskId}
            editingValue={editingValue}
            setEditingValue={setEditingValue}
            priorityClassByValue={priorityClassByValue}
          />

          <Inprogress
            tasks={filteredTasks.filter((task) => task.status === "inprogress")}
            onDelete={deleteTask}
            onMove={moveTask}
            onStartEditing={startEditingTask}
            onSaveEditing={saveEditingTask}
            onCancelEditing={cancelEditingTask}
            editingTaskId={editingTaskId}
            editingValue={editingValue}
            setEditingValue={setEditingValue}
            priorityClassByValue={priorityClassByValue}
          />

          <Done
            tasks={filteredTasks.filter((task) => task.status === "done")}
            onDelete={deleteTask}
            onMove={moveTask}
            onStartEditing={startEditingTask}
            onSaveEditing={saveEditingTask}
            onCancelEditing={cancelEditingTask}
            editingTaskId={editingTaskId}
            editingValue={editingValue}
            setEditingValue={setEditingValue}
            priorityClassByValue={priorityClassByValue}
          />
        </section>
      </DndContext>
    </main>
  );
}

export default App;
