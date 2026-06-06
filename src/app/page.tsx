"use client";

import { useState, useEffect } from "react";
import { Plan, DayData } from "@/lib/types";
import LandingPage from "@/components/LandingPage";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dayplan-v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Plan;
        /* Migration: older saved plans may not have a notes array */
        if (!parsed.notes) parsed.notes = [];
        setPlan(parsed);
      } catch {
        localStorage.removeItem("dayplan-v1");
      }
    }
    setLoaded(true);
  }, []);

  const createPlan = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const days: DayData[] = Array.from({ length: totalDays }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return {
        dayNumber: i + 1,
        date: date.toISOString().split("T")[0],
        tasks: [],
      };
    });

    const newPlan: Plan = { startDate, endDate, totalDays, days, notes: [] };
    localStorage.setItem("dayplan-v1", JSON.stringify(newPlan));
    setPlan(newPlan);
  };

  const updatePlan = (updatedPlan: Plan) => {
    localStorage.setItem("dayplan-v1", JSON.stringify(updatedPlan));
    setPlan(updatedPlan);
  };

  const resetPlan = () => {
    localStorage.removeItem("dayplan-v1");
    setPlan(null);
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!plan) return <LandingPage onCreatePlan={createPlan} />;
  return <Dashboard plan={plan} onUpdatePlan={updatePlan} onResetPlan={resetPlan} />;
}
