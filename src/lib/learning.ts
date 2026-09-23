"use client";

// Client-side learning state (demo, localStorage). When a real backend is
// connected, replace these functions with API calls; the UI stays the same.

const PROGRESS_KEY = "el-progress"; // completed lesson ids: `${course}/${lesson}`
const XP_KEY = "el-xp";
const VIEW_KEY = "el-recent-courses";

export function completedLessons(): string[] {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function isLessonComplete(courseSlug: string, lessonSlug: string): boolean {
  return completedLessons().includes(`${courseSlug}/${lessonSlug}`);
}

export function courseCompletedCount(courseSlug: string): number {
  const prefix = `${courseSlug}/`;
  return completedLessons().filter((k) => k.startsWith(prefix)).length;
}

/** Marks a lesson complete and awards XP once. Returns true if newly completed. */
export function markComplete(courseSlug: string, lessonSlug: string): boolean {
  const key = `${courseSlug}/${lessonSlug}`;
  const list = completedLessons();
  if (list.includes(key)) return false;
  list.push(key);
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(list));
    addXP(10);
  } catch {}
  return true;
}

export function toggleComplete(courseSlug: string, lessonSlug: string): boolean {
  const key = `${courseSlug}/${lessonSlug}`;
  const list = completedLessons();
  const idx = list.indexOf(key);
  if (idx >= 0) {
    list.splice(idx, 1);
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(list));
    } catch {}
    return false;
  }
  return markComplete(courseSlug, lessonSlug);
}

export function getXP(): number {
  try {
    return Number(localStorage.getItem(XP_KEY) || "0");
  } catch {
    return 0;
  }
}

export function addXP(amount: number): number {
  const next = getXP() + amount;
  try {
    localStorage.setItem(XP_KEY, String(next));
  } catch {}
  return next;
}

export interface Level {
  name: string;
  icon: string;
  min: number;
  max: number;
}

export const LEVELS: Level[] = [
  { name: "Seedling", icon: "🌱", min: 0, max: 99 },
  { name: "Explorer", icon: "🧭", min: 100, max: 299 },
  { name: "Builder", icon: "🛠️", min: 300, max: 699 },
  { name: "Expert", icon: "🎯", min: 700, max: 1499 },
  { name: "Master", icon: "🏆", min: 1500, max: Infinity },
];

export function levelForXP(xp: number): { level: Level; next?: Level; progress: number } {
  const idx = LEVELS.findIndex((l) => xp >= l.min && xp <= l.max);
  const level = LEVELS[idx] ?? LEVELS[0];
  const next = LEVELS[idx + 1];
  const span = (level.max === Infinity ? level.min + 1 : level.max) - level.min;
  const progress = level.max === Infinity ? 100 : Math.round(((xp - level.min) / span) * 100);
  return { level, next, progress: Math.min(100, Math.max(0, progress)) };
}

// Recently opened courses (for dashboard "continue learning").
export interface RecentCourse {
  slug: string;
  title: string;
  icon: string;
  color: string;
  at: number;
}

export function recordCourseView(c: Omit<RecentCourse, "at">) {
  try {
    const list = JSON.parse(localStorage.getItem(VIEW_KEY) || "[]") as RecentCourse[];
    const next = [{ ...c, at: Date.now() }, ...list.filter((r) => r.slug !== c.slug)].slice(0, 6);
    localStorage.setItem(VIEW_KEY, JSON.stringify(next));
  } catch {}
}

export function recentCourses(): RecentCourse[] {
  try {
    return JSON.parse(localStorage.getItem(VIEW_KEY) || "[]");
  } catch {
    return [];
  }
}
