"use client";

import { DayStatus } from "@/lib/types";

interface Props {
  totalDays: number;
  currentDay: number;
  selectedDay: number;
  dayStatuses: Record<number, DayStatus>;
  /** Day numbers that have an important-date note attached */
  noteDays?: Set<number>;
  onDayClick: (day: number) => void;
}

const STATUS_STYLES: Record<DayStatus, string> = {
  future:     "bg-white border-2 border-slate-200 text-slate-500 hover:border-slate-300",
  current:    "bg-white border-2 border-blue-400 text-slate-800 font-extrabold shadow-sm",
  complete:   "bg-green-400 border-2 border-green-400 text-white shadow-md hover:bg-green-500",
  partial:    "bg-orange-400 border-2 border-orange-400 text-white shadow-md hover:bg-orange-500",
  incomplete: "bg-red-400 border-2 border-red-400 text-white shadow-md hover:bg-red-500",
};

const COLS = 5;

export default function CalendarGrid({
  totalDays,
  currentDay,
  selectedDay,
  dayStatuses,
  noteDays,
  onDayClick,
}: Props) {
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);
  const currentCol = (currentDay - 1) % COLS;

  return (
    <div className="flex flex-col w-full">
      {/* Arrow row — same 5-col grid as the day cells */}
      <div
        className="w-full mb-1.5"
        style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: "8px" }}
      >
        {Array.from({ length: COLS }).map((_, col) => (
          <div key={col} className="flex justify-center items-end h-5">
            {col === currentCol && (
              <span className="text-slate-400 text-sm leading-none">↓</span>
            )}
          </div>
        ))}
      </div>

      {/* Day cells — responsive 5-column grid that fills container */}
      <div
        className="w-full"
        style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: "8px" }}
      >
        {days.map((day) => {
          const status = dayStatuses[day] ?? "future";
          const isSelected = day === selectedDay;
          const hasNote = noteDays?.has(day);

          return (
            <button
              key={day}
              onClick={() => onDayClick(day)}
              className={`
                relative aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center
                text-xs sm:text-sm font-bold cursor-pointer select-none
                ${STATUS_STYLES[status]}
                ${isSelected ? "ring-2 ring-blue-500 ring-offset-1 sm:ring-offset-2" : ""}
              `}
            >
              {day}
              {hasNote && (
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white"
                  aria-label="Has an important-date note"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-4">
        {[
          { color: "bg-green-400",  label: "Complete",   shape: "rounded-sm" },
          { color: "bg-orange-400", label: "Partial",    shape: "rounded-sm" },
          { color: "bg-red-400",    label: "Incomplete", shape: "rounded-sm" },
          { color: "bg-white border border-slate-300", label: "Future", shape: "rounded-sm" },
          { color: "bg-blue-500",   label: "Has a note", shape: "rounded-full" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 ${item.shape} flex-shrink-0 ${item.color}`} />
            <span className="text-xs text-slate-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
