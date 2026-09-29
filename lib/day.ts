/**
 * Calendar-day helpers in India Standard Time (UTC+05:30, no DST). Streaks, the Problem of the
 * Day and the activity heatmap all roll over at midnight IST, not midnight UTC (05:30 IST).
 */
export const DAY_MS = 86_400_000;
const IST_OFFSET_MS = 330 * 60_000;

/** The IST calendar date of `d`, as a Date at 00:00 UTC of that date (a stable day key for @db.Date columns). */
export function istDay(d = new Date()) {
  const t = new Date(d.getTime() + IST_OFFSET_MS);
  return new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()));
}

/** The real instant at which the IST day containing `d` began (for createdAt range queries). */
export function istDayStart(d = new Date()) {
  return new Date(istDay(d).getTime() - IST_OFFSET_MS);
}

/** YYYY-MM-DD of the IST calendar date of `d`. */
export function istDateKey(d: Date) {
  return istDay(d).toISOString().slice(0, 10);
}
