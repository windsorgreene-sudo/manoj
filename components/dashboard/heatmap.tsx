import { cn } from "@/lib/utils";

const LEVELS = ["bg-surface-2", "bg-brand/30", "bg-brand/55", "bg-brand/80", "bg-brand"];
const level = (c: number) => (c === 0 ? 0 : c <= 1 ? 1 : c <= 3 ? 2 : c <= 5 ? 3 : 4);

/** GitHub-style activity heatmap (server-renderable, no JS). */
export function Heatmap({ data }: { data: { date: string; count: number }[] }) {
  if (!data.length) return null;
  const first = new Date(data[0].date);
  const pad = first.getUTCDay();
  const cells = [...Array.from({ length: pad }, () => null), ...data];
  const weeks: ({ date: string; count: number } | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  const total = data.reduce((t, d) => t + d.count, 0);
  const activeDays = data.filter((d) => d.count > 0).length;
  const months: { label: string; col: number }[] = [];
  weeks.forEach((w, i) => {
    const d = w.find(Boolean);
    if (!d) return;
    const m = new Date(d.date).toLocaleString("en-IN", { month: "short", timeZone: "UTC" });
    if (!months.length || months[months.length - 1].label !== m) {
      if (months.length && i - months[months.length - 1].col < 3) months.pop();
      months.push({ label: m, col: i });
    }
  });

  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">
        <strong className="text-foreground">{total}</strong> activities in the last year · {activeDays} active days
      </p>
      <div className="overflow-x-auto pb-2" data-lenis-prevent>
        <div className="inline-block">
          <div className="relative mb-1 h-4 text-[10px] text-muted-foreground">
            {months.map((m) => (
              <span key={`${m.label}-${m.col}`} className="absolute" style={{ left: m.col * 14 }}>
                {m.label}
              </span>
            ))}
          </div>
          <div className="flex gap-[3px]" role="img" aria-label={`Activity heatmap: ${activeDays} active days in the last year`}>
            {weeks.map((w, i) => (
              <div key={i} className="flex flex-col gap-[3px]">
                {w.map((d, j) =>
                  d ? <span key={j} title={`${d.count} on ${d.date}`} className={cn("size-[11px] rounded-[3px]", LEVELS[level(d.count)])} /> : <span key={j} className="size-[11px]" />,
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
            Less {LEVELS.map((l) => <span key={l} className={cn("size-[11px] rounded-[3px]", l)} />)} More
          </div>
        </div>
      </div>
    </div>
  );
}
