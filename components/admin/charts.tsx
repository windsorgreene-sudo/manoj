"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Funnel, FunnelChart, LabelList, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const tt = { background: "var(--cv-surface)", border: "1px solid var(--cv-border)", borderRadius: 12, color: "var(--cv-text)", fontSize: 12 };
const COLORS = ["#7C3AED", "#06B6D4", "#84CC16", "#F59E0B", "#EF4444", "#A78BFA", "#22D3EE", "#FACC15"];

export function TrendChart({ data, keys, height = 260 }: { data: Record<string, string | number>[]; keys: { key: string; label: string; color: string }[]; height?: number }) {
  return (
    <div style={{ height }} role="img" aria-label={`Trend of ${keys.map((k) => k.label).join(" and ")}`}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ left: -20, right: 8 }}>
          <defs>
            {keys.map((k) => (
              <linearGradient key={k.key} id={`g-${k.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={k.color} stopOpacity={0.5} />
                <stop offset="1" stopColor={k.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke="var(--cv-border)" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: "var(--cv-muted)", fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={24} />
          <YAxis tick={{ fill: "var(--cv-muted)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip contentStyle={tt} />
          {keys.map((k) => (
            <Area key={k.key} type="monotone" dataKey={k.key} name={k.label} stroke={k.color} fill={`url(#g-${k.key})`} strokeWidth={2} isAnimationActive animationDuration={1200} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HBar({ data, dataKey, nameKey, height = 280, unit = "" }: { data: Record<string, string | number>[]; dataKey: string; nameKey: string; height?: number; unit?: string }) {
  return (
    <div style={{ height }} role="img" aria-label={data.map((d) => `${d[nameKey]}: ${d[dataKey]}${unit}`).join(", ")}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 16 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey={nameKey} width={160} tick={{ fill: "var(--cv-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tt} cursor={{ fill: "rgba(124,58,237,0.08)" }} formatter={(v) => [`${String(v)}${unit}`, ""]} />
          <Bar dataKey={dataKey} radius={[0, 8, 8, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Donut({ data, height = 220 }: { data: { name: string; value: number }[]; height?: number }) {
  return (
    <div className="flex items-center gap-4">
      <div style={{ height, width: height }} role="img" aria-label={data.map((d) => `${d.name}: ${d.value}`).join(", ")}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={2} stroke="none">
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tt} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="space-y-1 text-sm">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2">
            <span className="size-2.5 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} /> {d.name} <span className="text-muted-foreground">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DropOffFunnel({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-72" role="img" aria-label={`Course funnel: ${data.map((d) => `${d.name} ${d.value}`).join(", ")}`}>
      <ResponsiveContainer>
        <FunnelChart>
          <Tooltip contentStyle={tt} />
          <Funnel dataKey="value" data={data.map((d, i) => ({ ...d, fill: COLORS[i % COLORS.length] }))} isAnimationActive>
            <LabelList position="right" fill="var(--cv-text)" stroke="none" dataKey="name" fontSize={12} />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}
