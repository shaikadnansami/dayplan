"use client";

import { useState } from "react";
import {
  Plan, Task, DayData, DayStatus,
  getDayStatus, getCurrentDayNumber, formatDate,
} from "@/lib/types";
import CalendarGrid from "./CalendarGrid";
import TaskSection from "./TaskSection";
import DayPopup from "./DayPopup";
import { Calendar, RefreshCw, CheckCircle2, LayoutGrid, ListTodo } from "lucide-react";

interface Props {
  plan: Plan;
  onUpdatePlan: (plan: Plan) => void;
  onResetPlan: () => void;
}

type MobileTab = "tasks" | "calendar";

export default function Dashboard({ plan, onUpdatePlan, onResetPlan }: Props) {
  const currentDay = getCurrentDayNumber(plan);
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [popupDay, setPopupDay] = useState<number | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("tasks");

  const dayStatuses = Object.fromEntries(
    plan.days.map((d) => [d.dayNumber, getDayStatus(d, currentDay)])
  ) as Record<number, DayStatus>;

  const handleDayClick = (dayNum: number) => {
    setSelectedDay(dayNum);
    const status = dayStatuses[dayNum];
    if (status !== "future" && status !== "current") {
      setPopupDay(dayNum);
    } else {
      setPopupDay(null);
    }
  };

  const updateDayTasks = (dayNum: number, tasks: Task[]) => {
    onUpdatePlan({
      ...plan,
      days: plan.days.map((d) => (d.dayNumber === dayNum ? { ...d, tasks } : d)),
    });
  };

  const addTasksToNextDay = (fromDayNum: number) => {
    const fromDay = plan.days.find((d) => d.dayNumber === fromDayNum);
    if (!fromDay) return;
    const toCarry = fromDay.tasks
      .filter((t) => !t.completed || t.partial)
      .map((t) => ({ ...t, id: `${Date.now()}-${Math.random()}`, completed: false, partial: false }));
    const nextDay = plan.days.find((d) => d.dayNumber === fromDayNum + 1);
    if (!nextDay) return;
    updateDayTasks(fromDayNum + 1, [...nextDay.tasks, ...toCarry]);
  };

  const selectedDayData: DayData =
    plan.days.find((d) => d.dayNumber === selectedDay) ?? plan.days[currentDay - 1];
  const popupDayData = popupDay
    ? plan.days.find((d) => d.dayNumber === popupDay)
    : null;

  const completedCount = plan.days.filter(
    (d) => dayStatuses[d.dayNumber] === "complete"
  ).length;
  const passedDays = plan.days.filter((d) => d.dayNumber < currentDay).length;
  const isToday = selectedDay === currentDay;

  const startDate = new Date(plan.startDate);
  const planLabel = `${plan.totalDays} Days · ${startDate.toLocaleString("default", { month: "long" })} ${startDate.getFullYear()}`;

  /* ── Shared: task section ─────────────────────── */
  const taskPanel = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
            {isToday ? "Today's Tasks" : `Day ${selectedDay} Tasks`}
          </p>
          <p className="text-xs text-slate-400">{formatDate(selectedDayData.date)}</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedDayData.tasks.filter((t) => t.completed).length > 0 && (
            <span className="flex items-center gap-1 bg-green-100 text-green-600 text-xs font-semibold px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              {selectedDayData.tasks.filter((t) => t.completed).length} done
            </span>
          )}
          <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
            {selectedDayData.tasks.length} task
            {selectedDayData.tasks.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
      <div className="border-t border-slate-100 mb-4" />
      <div className="flex-1 overflow-y-auto">
        <TaskSection
          dayData={selectedDayData}
          isCurrentDay={isToday}
          onUpdateTasks={(tasks) => updateDayTasks(selectedDay, tasks)}
        />
      </div>
    </div>
  );

  /* ── Shared: calendar panel ───────────────────── */
  const calendarPanel = (
    <div className="flex flex-col gap-5">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-md p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4 sm:mb-5">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Active Plan
            </p>
            <p className="text-sm sm:text-base font-bold text-slate-800">{planLabel}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-500 rounded-xl flex items-center justify-center shadow-sm">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            {completedCount > 0 && (
              <span className="bg-green-400 text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                {completedCount} done ✓
              </span>
            )}
          </div>
        </div>
        <CalendarGrid
          totalDays={plan.totalDays}
          currentDay={currentDay}
          selectedDay={selectedDay}
          dayStatuses={dayStatuses}
          onDayClick={handleDayClick}
        />
      </div>

      {popupDayData && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 px-1">
            Day Details
          </p>
          <DayPopup
            dayData={popupDayData}
            status={dayStatuses[popupDayData.dayNumber]}
            onAddToNextDay={() => addTasksToNextDay(popupDayData.dayNumber)}
            onClose={() => setPopupDay(null)}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">

      {/* ══════════════ MOBILE ONLY ══════════════ */}

      {/* Mobile sticky header */}
      <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
            <Calendar className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-slate-800 text-sm">DayPlan</span>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold ml-1">
            {plan.totalDays}d
          </span>
        </div>
        <div className="flex items-center gap-3">
          {passedDays > 0 && (
            <span className="text-xs text-slate-500">
              <span className="font-bold text-green-500">{completedCount}</span>/{passedDays} done
            </span>
          )}
          <button
            onClick={onResetPlan}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50"
          >
            <RefreshCw className="w-3 h-3" />
            New
          </button>
        </div>
      </header>

      {/* Mobile tab bar */}
      <div className="lg:hidden sticky top-[52px] z-10 bg-white border-b border-slate-100 flex shadow-sm">
        {([
          { key: "tasks",    label: "Tasks",    icon: <ListTodo className="w-4 h-4" /> },
          { key: "calendar", label: "Calendar", icon: <LayoutGrid className="w-4 h-4" /> },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setMobileTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold border-b-2 ${
              mobileTab === tab.key
                ? "text-blue-500 border-blue-500"
                : "text-slate-400 border-transparent"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════ DESKTOP SIDEBAR ══════════════ */}
      <aside className="hidden lg:flex w-52 bg-white border-r border-slate-100 flex-col p-5 gap-4 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-800 text-base tracking-tight">DayPlan</span>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
          <p className="text-3xl font-extrabold text-blue-500">{plan.totalDays}</p>
          <p className="text-xs text-blue-400 font-semibold mt-0.5 uppercase tracking-wide">Day Plan</p>
        </div>

        <div className="space-y-1 px-1">
          {[
            { label: "Start", val: formatDate(plan.startDate) },
            { label: "End",   val: formatDate(plan.endDate) },
          ].map((row) => (
            <div key={row.label} className="flex justify-between text-xs">
              <span className="text-slate-400">{row.label}</span>
              <span className="text-slate-600 font-semibold">{row.val}</span>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-400">Progress</span>
            <span className="font-bold text-slate-600">{completedCount}/{passedDays}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div
              className="bg-green-400 h-1.5 rounded-full"
              style={{ width: passedDays > 0 ? `${(completedCount / passedDays) * 100}%` : "0%" }}
            />
          </div>
        </div>

        <div className="mt-auto space-y-2">
          <button className="w-full flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-500 bg-white hover:bg-slate-50 font-medium">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span className="truncate">{plan.totalDays} days selected</span>
          </button>
          <button
            onClick={onResetPlan}
            className="w-full flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-500 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-500 font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Start a new plan
          </button>
        </div>
      </aside>

      {/* ══════════════ MAIN CONTENT AREA ══════════════ */}
      <div className="flex-1 flex flex-col lg:flex-row min-w-0 overflow-auto">

        {/* Tasks panel — full width on mobile (tab-controlled), left on desktop */}
        <div
          className={`
            flex-1 bg-white lg:border-r border-slate-100 flex flex-col p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto
            ${mobileTab === "tasks" ? "flex" : "hidden lg:flex"}
          `}
        >
          {taskPanel}
        </div>

        {/* Calendar panel — full width on mobile (tab-controlled), right on desktop */}
        <div
          className={`
            lg:w-[380px] xl:w-[420px] flex-shrink-0 bg-slate-50 p-4 sm:p-5 lg:p-6 overflow-y-auto
            ${mobileTab === "calendar" ? "block" : "hidden lg:block"}
          `}
        >
          {calendarPanel}
        </div>
      </div>
    </div>
  );
}
