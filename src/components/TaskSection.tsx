"use client";

import { useState } from "react";
import { Task, DayData } from "@/lib/types";
import { Plus, X, Trash2, AlertTriangle } from "lucide-react";

interface Props {
  dayData: DayData;
  isEditable: boolean;
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

/* ── Auto-growing task field ───────────────────────────────────
 * Wraps long text and grows downward instead of scrolling sideways,
 * with a vertical scrollbar past a height cap. Sized via a CSS grid
 * "ghost twin" (an invisible div mirroring the text) rather than
 * measuring scrollHeight in JS — that approach is unreliable on
 * mobile (hidden tabs / font-load timing can report 0 and clip the
 * text invisibly), while the grid technique needs no measurement. */
function TaskTextArea({
  value,
  onChange,
  placeholder,
  readOnly,
  fieldClassName,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  readOnly: boolean;
  /** Typography/color/cursor classes — applied to both the field and its sizing twin so they measure identically */
  fieldClassName: string;
}) {
  const shared = `text-sm leading-relaxed pt-1 max-h-40 ${fieldClassName}`;

  return (
    <div className="grid flex-1 min-w-0">
      {/* Invisible twin — its wrapped height drives the grid row's height */}
      <div
        aria-hidden="true"
        className={`[grid-area:1/1] invisible whitespace-pre-wrap break-words overflow-hidden ${shared}`}
      >
        {`${value || placeholder} `}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={1}
        className={`[grid-area:1/1] w-full resize-none overflow-y-auto bg-transparent outline-none ${shared}`}
      />
    </div>
  );
}

/* ── Confirmation modal ───────────────────────────────── */
function DeleteConfirmModal({
  taskText,
  onConfirm,
  onCancel,
}: {
  taskText: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={onCancel}
    >
      {/* Card — stop click bubbling to backdrop */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-800 text-center mb-2">
          Delete this task?
        </h3>

        {/* Task preview */}
        <p className="text-sm text-slate-500 text-center mb-1">
          You are about to delete:
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 mb-5 mx-2">
          <p className="text-sm text-slate-700 text-center font-medium truncate">
            {taskText || "Untitled task"}
          </p>
        </div>

        {/* Warning note */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-600">This action cannot be undone.</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border-2 border-slate-200 rounded-xl py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 active:bg-slate-100 touch-manipulation"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-xl py-3 text-sm font-semibold text-white touch-manipulation"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────────── */
export default function TaskSection({ dayData, isEditable, onUpdateTasks }: Props) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

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

  const toggleCompleted = (task: Task) => {
    updateTask(task.id, { completed: !task.completed, partial: false });
  };

  const togglePartial = (task: Task) => {
    updateTask(task.id, { partial: !task.partial, completed: false });
  };

  const pendingTask = dayData.tasks.find((t) => t.id === pendingDeleteId);

  return (
    <>
      <div className="flex flex-col gap-0.5 w-full">
        {/* Empty state */}
        {dayData.tasks.length === 0 && (
          <div className="py-10 flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-slate-400 text-sm text-center">
              {isEditable
                ? 'No tasks yet — click "+ Add Task" below to start'
                : "No tasks were added for this day."}
            </p>
          </div>
        )}

        {/* Task rows */}
        {dayData.tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 py-2.5 px-2 group rounded-xl hover:bg-slate-50"
          >
            {/* Complete checkbox */}
            <div className="pt-0.5">
              <SquareCheck
                checked={task.completed}
                onClick={() => toggleCompleted(task)}
                disabled={!isEditable}
              />
            </div>

            {/* Task text — wraps and grows down, scrolls vertically past max height */}
            <TaskTextArea
              value={task.text}
              onChange={(text) => updateTask(task.id, { text })}
              placeholder={isEditable ? "Enter task..." : "—"}
              readOnly={!isEditable}
              fieldClassName={`${
                task.completed
                  ? "line-through text-slate-400"
                  : task.partial
                  ? "text-orange-600"
                  : "text-slate-700 placeholder-slate-300"
              } ${!isEditable ? "cursor-default" : "cursor-text"}`}
            />

            {/* Partial label + checkbox */}
            <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
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
                disabled={!isEditable}
              />
            </div>

            {/* Delete — opens confirmation modal */}
            {isEditable && (
              <button
                onClick={() => setPendingDeleteId(task.id)}
                className="lg:opacity-0 lg:group-hover:opacity-100 text-slate-300 hover:text-red-400 active:text-red-500 flex-shrink-0 ml-1 p-1 -m-1 mt-1 touch-manipulation"
                aria-label="Delete task"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}

        {/* Add Task */}
        {isEditable && (
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

      {/* Confirmation modal — rendered outside the list so it's always on top */}
      {pendingTask && (
        <DeleteConfirmModal
          taskText={pendingTask.text}
          onConfirm={() => {
            removeTask(pendingTask.id);
            setPendingDeleteId(null);
          }}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </>
  );
}
