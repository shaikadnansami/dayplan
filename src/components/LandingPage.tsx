"use client";

import { useState } from "react";
import { Calendar, CheckCircle2, Target, Layers, ArrowRight, Sparkles } from "lucide-react";

interface Props {
  onCreatePlan: (startDate: string, endDate: string) => void;
}

export default function LandingPage({ onCreatePlan }: Props) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError("End date must be after start date.");
      return;
    }
    setError("");
    onCreatePlan(startDate, endDate);
  };

  const diffDays =
    startDate && endDate
      ? Math.ceil(
          (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-blue-100/60 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-500 rounded-xl flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-semibold text-slate-800 tracking-tight">DayPlan</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Your personal task tracker</span>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-blue-200">
              <Calendar className="w-3.5 h-3.5" />
              Multi-day task planning
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 leading-tight mb-4 sm:mb-5">
              Plan Your Days,
              <br />
              <span className="text-blue-500">Achieve Your Goals</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-500 leading-relaxed mb-7 sm:mb-10">
              Create a structured plan across any date range. Track daily tasks, mark completions, and stay consistent — all in one beautiful view.
            </p>

            {/* Plan creator card */}
            <div className="bg-white rounded-2xl p-7 shadow-md border border-slate-100">
              <h2 className="text-base font-semibold text-slate-700 mb-5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                Set your plan period
              </h2>

              <div className="flex gap-3 mb-5">
                <div className="flex-1">
                  <label className="text-xs font-medium text-slate-500 mb-1.5 block uppercase tracking-wide">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); setError(""); }}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-slate-50"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-slate-500 mb-1.5 block uppercase tracking-wide">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => { setEndDate(e.target.value); setError(""); }}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-slate-50"
                  />
                </div>
              </div>

              {diffDays && diffDays > 0 && (
                <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 text-sm text-blue-600 font-medium text-center">
                  {diffDays} day{diffDays > 1 ? "s" : ""} plan selected
                </div>
              )}

              {error && (
                <p className="text-red-500 text-sm mb-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                onClick={handleCreate}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                Create My Plan
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Illustration — hidden on small screens to save space */}
          <div className="hidden lg:flex justify-center">
            <PlanIllustration />
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16">
          {[
            {
              icon: <Calendar className="w-5 h-5" />,
              color: "bg-blue-100 text-blue-500",
              title: "Visual Calendar",
              desc: "See your entire plan at a glance with color-coded day statuses.",
            },
            {
              icon: <CheckCircle2 className="w-5 h-5" />,
              color: "bg-green-100 text-green-500",
              title: "Task Tracking",
              desc: "Mark tasks as fully complete or partially done. Never lose progress.",
            },
            {
              icon: <Target className="w-5 h-5" />,
              color: "bg-orange-100 text-orange-500",
              title: "Stay on Track",
              desc: "Roll over incomplete tasks to the next day with one click.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
            >
              <div className={`w-10 h-10 ${f.color} rounded-xl flex items-center justify-center mb-4`}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-slate-800 mb-1.5">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Color legend */}
        <div className="mt-10 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <p className="text-sm font-semibold text-slate-600 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            Day Status Color Guide
          </p>
          <div className="flex flex-wrap gap-5">
            {[
              { color: "bg-green-400", label: "All tasks completed" },
              { color: "bg-orange-400", label: "Partial / mixed completion" },
              { color: "bg-red-500", label: "Incomplete tasks" },
              { color: "bg-white border-2 border-slate-200", label: "Future day" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className={`w-5 h-5 rounded-md ${item.color} shadow-sm`} />
                <span className="text-sm text-slate-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function PlanIllustration() {
  const days = [
    { n: 1, color: "#ffffff", border: "#e2e8f0", text: "#64748b" },
    { n: 2, color: "#4ade80", border: "#4ade80", text: "#ffffff" },
    { n: 3, color: "#fb923c", border: "#fb923c", text: "#ffffff" },
    { n: 4, color: "#f87171", border: "#f87171", text: "#ffffff" },
    { n: 5, color: "#ffffff", border: "#e2e8f0", text: "#64748b" },
    { n: 6, color: "#ffffff", border: "#e2e8f0", text: "#64748b" },
    { n: 7, color: "#ffffff", border: "#e2e8f0", text: "#64748b" },
    { n: 8, color: "#ffffff", border: "#e2e8f0", text: "#64748b" },
    { n: 9, color: "#ffffff", border: "#e2e8f0", text: "#64748b" },
    { n: 10, color: "#ffffff", border: "#e2e8f0", text: "#64748b" },
  ];

  return (
    <div className="relative">
      {/* Main card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 w-80">
        {/* Card header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Active Plan</p>
            <p className="text-sm font-semibold text-slate-700 mt-0.5">15 Days · May 2026</p>
          </div>
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
            <Calendar className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Calendar grid */}
        <div className="mb-5">
          <div className="flex justify-end pr-1 mb-1">
            <span className="text-slate-400 text-base">↓</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {days.map((d) => (
              <div
                key={d.n}
                className="aspect-square rounded-xl flex items-center justify-center text-sm font-semibold border"
                style={{ background: d.color, borderColor: d.border, color: d.text }}
              >
                {d.n}
              </div>
            ))}
          </div>
        </div>

        {/* Task preview */}
        <div className="space-y-2.5">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Today&apos;s Tasks</p>
          {[
            { text: "Review project plan", done: true },
            { text: "Team standup meeting", done: true },
            { text: "Write documentation", done: false },
          ].map((task, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
                  task.done ? "bg-slate-900" : "bg-slate-100 border border-slate-200"
                }`}
              >
                {task.done && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${task.done ? "line-through text-slate-400" : "text-slate-600"}`}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating status badge */}
      <div className="absolute -top-4 -right-4 bg-green-400 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
        2 done ✓
      </div>

      {/* Floating incomplete badge */}
      <div className="absolute -bottom-4 -left-4 bg-white border border-slate-200 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full shadow-md">
        Roll over to next day?
      </div>
    </div>
  );
}
