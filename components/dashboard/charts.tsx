"use client";

import { Bar, BarChart, Cell, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { LANGUAGE_META, type LanguageKey } from "@/lib/languages";

const tooltipStyle = { background: "var(--cv-surface)", border: "1px solid var(--cv-border)", borderRadius: 12, color: "var(--cv-text)", fontSize: 12 };

export function DifficultyDonut({ data, totals }: { data: Record<"EASY" | "MEDIUM" | "HARD", number>; totals: Record<"EASY" | "MEDIUM" | "HARD", number> }) {
  const rows = [
    { name: "Easy", value: data.EASY, total: totals.EASY ?? 0, color: "var(--cv-success)" },
    { name: "Medium", value: data.MEDIUM, total: totals.MEDIUM ?? 0, color: "var(--cv-warning)" },
    { name: "Hard", value: data.HARD, total: totals.HARD ?? 0, color: "var(--cv-danger)" },
  ];
  const solved = rows.reduce((t, r) => t + r.value, 0);
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative size-44" role="img" aria-label={`Solved ${solved}: ${rows.map((r) => `${r.name} ${r.value}`).join(", ")}`}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={solved ? rows : [{ name: "None", value: 1, color: "var(--cv-surface-2)" }]} dataKey="value" innerRadius={56} outerRadius={78} paddingAngle={solved ? 3 : 0} stroke="none" isAnimationActive>
              {(solved ? rows : [{ color: "var(--cv-surface-2)" }]).map((r, i) => (
                <Cell key={i} fill={r.color} />
              ))}
            </Pie>
            {solved ? <Tooltip contentStyle={tooltipStyle} /> : null}
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="font-heading text-3xl font-bold">{solved}</p>
            <p className="text-xs text-muted-foreground">solved</p>
          </div>
        </div>
      </div>
      <ul className="w-full flex-1 space-y-3">
        {rows.map((r) => (
          <li key={r.name}>
            <div className="flex justify-between text-sm">
              <span style={{ color: r.color }}>{r.name}</span>
              <span className="tabular-nums text-muted-foreground">
                {r.value}/{r.total}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full" style={{ width: `${r.total ? (r.value / r.total) * 100 : 0}%`, background: r.color }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TopicRadar({ data }: { data: { topic: string; strength: number }[] }) {
  return (
    <div className="h-72" role="img" aria-label={`Topic strength: ${data.map((d) => `${d.topic} ${d.strength}%`).join(", ")}`}>
      <ResponsiveContainer>
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="var(--cv-border)" />
          <PolarAngleAxis dataKey="topic" tick={{ fill: "var(--cv-muted)", fontSize: 11 }} />
          <Radar dataKey="strength" stroke="#06B6D4" fill="#7C3AED" fillOpacity={0.45} isAnimationActive />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${String(v)}%`, "Strength"]} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LanguagesBar({ data }: { data: { language: string; count: number }[] }) {
  const rows = data.map((d) => ({ name: LANGUAGE_META[d.language as LanguageKey]?.label ?? d.language, count: d.count }));
  return (
    <div className="h-56" role="img" aria-label={`Languages used: ${rows.map((r) => `${r.name} ${r.count}`).join(", ")}`}>
      <ResponsiveContainer>
        <BarChart data={rows} layout="vertical" margin={{ left: 10 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={80} tick={{ fill: "var(--cv-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(124,58,237,0.08)" }} />
          <Bar dataKey="count" fill="#7C3AED" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WeeklyStudyBar({ data }: { data: { week: string; minutes: number }[] }) {
  const rows = data.map((d) => ({ ...d, hours: Math.round((d.minutes / 60) * 10) / 10 }));
  return (
    <div className="h-56" role="img" aria-label={`Weekly study time: ${rows.map((r) => `${r.week} ${r.hours}h`).join(", ")}`}>
      <ResponsiveContainer>
        <BarChart data={rows}>
          <XAxis dataKey="week" tick={{ fill: "var(--cv-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--cv-muted)", fontSize: 11 }} axisLine={false} tickLine={false} width={30} unit="h" />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(6,182,212,0.08)" }} formatter={(v) => [`${String(v)} h`, "Study time"]} />
          <Bar dataKey="hours" fill="#06B6D4" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
