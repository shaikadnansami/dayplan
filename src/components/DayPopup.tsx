"use client";

import { useState } from "react";
import { DayData, DayStatus, formatDate } from "@/lib/types";
import { X } from "lucide-react";

interface Props {
  dayData: DayData;
  status: DayStatus;
  onAddToNextDay: () => void;
  onClose: () => void;
}

export default function DayPopup({ dayData, status, onAddToNextDay, onClose }: Props) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!added) {
      setAdded(true);
      onAddToNextDay();
    }
  };

  const showAddButton = status === "incomplete" || status === "partial";

  /* Border matches wireframe: blue outline for partial, normal for others */
  const borderClass =
    status === "partial"
      ? "border-blue-400"
      : status === "incomplete"
      ? "border-slate-200"
      : "border-slate-200";

  return (
    <div
      className={`bg-white rounded-2xl border-2 ${borderClass} p-5 w-full relative`}
      style={{ minHeight: "160px" }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-slate-300 hover:text-slate-500"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Date — top left, plain text like wireframe */}
      <p className="text-slate-700 text-sm font-medium mb-6">
        {formatDate(dayData.date)}
      </p>

      {/* ── Status message ── */}
      {status === "complete" && (
        <p className="text-blue-500 text-center font-medium text-sm py-4">
          All Tasks are completed
        </p>
      )}

      {status === "partial" && (
        <p className="text-slate-700 text-sm text-center">
          Show the incomplete and partial tasks
        </p>
      )}

      {status === "incomplete" && (
        <p className="text-slate-700 text-sm text-center">
          Show the incomplete
        </p>
      )}

      {dayData.tasks.length === 0 && status !== "complete" && (
        <p className="text-slate-400 text-sm text-center">
          No tasks were recorded for this day.
        </p>
      )}

      {/* ── Add to next day ── */}
      {showAddButton && (
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleAdd}
            disabled={added}
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              added
                ? "bg-slate-900"
                : "bg-slate-200 hover:bg-slate-300"
            }`}
          >
            {added && (
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path
                  d="M1 5L4.5 8.5L11 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          <span className="text-slate-600 text-sm">
            {added ? "Added to next day ✓" : "Add This tasks to next day ?"}
          </span>
        </div>
      )}
    </div>
  );
}
