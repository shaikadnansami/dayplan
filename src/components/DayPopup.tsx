"use client";

import { useState } from "react";
import { DayData, DayStatus, formatDate } from "@/lib/types";
import { X, PartyPopper, ArrowRight } from "lucide-react";

interface Props {
  dayData: DayData;
  status: DayStatus;
  /** Carries over only the chosen task ids to the next day */
  onAddToNextDay: (taskIds: string[]) => void;
  onClose: () => void;
}

function MiniCheck({ checked }: { checked: boolean }) {
  return (
    <div
      className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border-2 ${
        checked ? "bg-slate-900 border-slate-900" : "bg-white border-slate-300"
      }`}
    >
      {checked && (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5L3.2 5.7L8 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

export default function DayPopup({ dayData, status, onAddToNextDay, onClose }: Props) {
  const carryCandidates = dayData.tasks.filter((t) => !t.completed || t.partial);

  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(carryCandidates.map((t) => t.id))
  );
  const [done, setDone] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allSelected = selected.size === carryCandidates.length && carryCandidates.length > 0;
  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(carryCandidates.map((t) => t.id)));
  };

  const handleConfirm = () => {
    if (selected.size === 0 || done) return;
    onAddToNextDay(Array.from(selected));
    setDone(true);
  };

  const borderClass = status === "partial" ? "border-blue-300" : "border-slate-200";

  return (
    <div className={`bg-white rounded-2xl border-2 ${borderClass} p-5 w-full relative`}>
      {/* Close */}
      <button onClick={onClose} className="absolute top-3 right-3 text-slate-300 hover:text-slate-500">
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Date */}
      <p className="text-slate-700 text-sm font-medium mb-4">{formatDate(dayData.date)}</p>

      {/* ── All complete: celebration ── */}
      {status === "complete" && (
        <div className="flex flex-col items-center text-center py-4 gap-2">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
            <PartyPopper className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-blue-500 font-semibold text-sm">All tasks are completed!</p>
          <p className="text-slate-400 text-xs">You crushed it today — all the best for tomorrow! 🌟</p>
        </div>
      )}

      {/* ── Nothing recorded ── */}
      {dayData.tasks.length === 0 && status !== "complete" && (
        <p className="text-slate-400 text-sm text-center py-4">No tasks were recorded for this day.</p>
      )}

      {/* ── Incomplete / partial: per-task selection ── */}
      {carryCandidates.length > 0 && (
        <>
          <p className="text-slate-600 text-sm mb-3">
            {status === "partial"
              ? "Here's what was incomplete or partial — pick what to carry to tomorrow:"
              : "Here's what's incomplete — pick what to carry to tomorrow:"}
          </p>

          {/* Select all */}
          <button
            onClick={toggleAll}
            disabled={done}
            className="flex items-center gap-2.5 mb-2 px-1 py-1.5 rounded-lg hover:bg-slate-50 w-full text-left"
          >
            <MiniCheck checked={allSelected} />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              {allSelected ? "Unselect all" : "Select all"}
            </span>
          </button>

          {/* Task list */}
          <div className="space-y-1 mb-4 max-h-52 overflow-y-auto pr-1">
            {carryCandidates.map((task) => (
              <button
                key={task.id}
                onClick={() => toggle(task.id)}
                disabled={done}
                className="flex items-start gap-2.5 px-1 py-2 rounded-lg hover:bg-slate-50 w-full text-left"
              >
                <div className="mt-0.5">
                  <MiniCheck checked={selected.has(task.id)} />
                </div>
                <span className="text-sm text-slate-700 break-words">
                  {task.text || "Untitled task"}
                </span>
                {task.partial && (
                  <span className="text-[10px] font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded-full flex-shrink-0 ml-auto">
                    Partial
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Confirm button */}
          <button
            onClick={handleConfirm}
            disabled={selected.size === 0 || done}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors ${
              done
                ? "bg-green-100 text-green-600"
                : selected.size === 0
                ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {done ? (
              "Added to tomorrow ✓"
            ) : (
              <>
                Add {selected.size > 0 ? selected.size : ""} task{selected.size !== 1 ? "s" : ""} to tomorrow
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}
