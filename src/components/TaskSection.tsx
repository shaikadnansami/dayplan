"use client";

import { Task, DayData } from "@/lib/types";
import { Plus, X } from "lucide-react";

interface Props {
  dayData: DayData;
  isCurrentDay: boolean;
  onUpdateTasks: (tasks: Task[]) => void;
}

function SquareCheck({
  checked,
  onClick,
  disabled,
}: {
  checked: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border-2 ${
        checked
          ? "bg-slate-900 border-slate-900"
          : "bg-white border-slate-300 hover:border-slate-400"
      } ${disabled ? "cursor-default" : "cursor-pointer"}`}
    >
      {checked && (
        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
          <path
            d="M1 4.5L3.8 7.5L10 1"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

export default function TaskSection({ dayData, isCurrentDay, onUpdateTasks }: Props) {
  const addTask = () => {
    const newTask: Task = {
      id: `${Date.now()}-${Math.random()}`,
      text: "",
      completed: false,
      partial: false,
    };
    onUpdateTasks([...dayData.tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    onUpdateTasks(dayData.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const removeTask = (id: string) => {
    onUpdateTasks(dayData.tasks.filter((t) => t.id !== id));
  };

  /* Marking complete clears partial; marking partial clears complete */
  const toggleCompleted = (task: Task) => {
    updateTask(task.id, { completed: !task.completed, partial: false });
  };

  const togglePartial = (task: Task) => {
    updateTask(task.id, { partial: !task.partial, completed: false });
  };

  return (
    <div className="flex flex-col gap-0.5 w-full">
      {/* Empty state */}
      {dayData.tasks.length === 0 && (
        <div className="py-10 flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
            <Plus className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-slate-400 text-sm text-center">
            {isCurrentDay
              ? 'No tasks yet — click "+ Add Task" below to start'
              : "No tasks were added for this day."}
          </p>
        </div>
      )}

      {/* Task rows */}
      {dayData.tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-3 py-2.5 px-2 group rounded-xl hover:bg-slate-50"
        >
          {/* Complete checkbox (left) */}
          <SquareCheck
            checked={task.completed}
            onClick={() => toggleCompleted(task)}
            disabled={!isCurrentDay}
          />

          {/* Task text */}
          <input
            type="text"
            value={task.text}
            onChange={(e) => updateTask(task.id, { text: e.target.value })}
            placeholder={isCurrentDay ? "Enter task..." : "—"}
            readOnly={!isCurrentDay}
            className={`flex-1 min-w-0 bg-transparent outline-none text-sm leading-relaxed ${
              task.completed
                ? "line-through text-slate-400"
                : task.partial
                ? "text-orange-600"
                : "text-slate-700 placeholder-slate-300"
            } ${!isCurrentDay ? "cursor-default" : ""}`}
          />

          {/* Partial label + checkbox (right) */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span
              className={`text-xs font-medium ${
                task.partial ? "text-orange-500" : "text-slate-400"
              }`}
            >
              Partial
            </span>
            <SquareCheck
              checked={task.partial}
              onClick={() => togglePartial(task)}
              disabled={!isCurrentDay}
            />
          </div>

          {/* Delete — always visible on mobile, hover-only on desktop */}
          {isCurrentDay && (
            <button
              onClick={() => removeTask(task.id)}
              className="lg:opacity-0 lg:group-hover:opacity-100 text-slate-300 hover:text-red-400 active:text-red-500 flex-shrink-0 ml-1 p-1 -m-1 touch-manipulation"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}

      {/* Add Task — today only */}
      {isCurrentDay && (
        <button
          onClick={addTask}
          className="mt-5 flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm font-medium py-2 px-2 rounded-xl hover:bg-blue-50 w-fit"
        >
          <div className="w-6 h-6 rounded-lg border-2 border-blue-400 flex items-center justify-center">
            <Plus className="w-3.5 h-3.5" />
          </div>
          Add Task
        </button>
      )}
    </div>
  );
}
