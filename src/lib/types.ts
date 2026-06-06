export interface Task {
  id: string;
  text: string;
  completed: boolean;
  partial: boolean;
}

export type DayStatus = "future" | "current" | "complete" | "partial" | "incomplete";

export interface DayData {
  dayNumber: number;
  date: string;
  tasks: Task[];
  /** When true on day N, day N+1's task list becomes editable ahead of time */
  planNextDay?: boolean;
}

export interface PlanNote {
  id: string;
  date: string;
  text: string;
}

export interface Plan {
  startDate: string;
  endDate: string;
  totalDays: number;
  days: DayData[];
  notes: PlanNote[];
}

export function getDayStatus(day: DayData, currentDayNum: number): DayStatus {
  if (day.dayNumber > currentDayNum) return "future";
  if (day.dayNumber === currentDayNum) return "current";
  if (day.tasks.length === 0) return "incomplete";

  const allCompleted = day.tasks.every((t) => t.completed);
  const anyPartial = day.tasks.some((t) => t.partial);
  const anyCompleted = day.tasks.some((t) => t.completed);

  if (allCompleted && !anyPartial) return "complete";
  if (anyPartial || anyCompleted) return "partial";
  return "incomplete";
}

export function getCurrentDayNumber(plan: Plan): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(plan.startDate);
  start.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.min(Math.max(diff + 1, 1), plan.totalDays);
}

/**
 * A day's task list is editable when it's today, OR when the previous day
 * opted in via "planNextDay" to unlock planning ahead of time.
 */
export function isDayUnlocked(plan: Plan, dayNumber: number, currentDay: number): boolean {
  if (dayNumber === currentDay) return true;
  if (dayNumber === currentDay + 1) {
    const today = plan.days.find((d) => d.dayNumber === currentDay);
    return today?.planNextDay === true;
  }
  return false;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}
