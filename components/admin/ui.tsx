import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-heading text-3xl font-bold">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    PUBLISHED: "bg-success/15 text-success",
    ACTIVE: "bg-success/15 text-success",
    PAID: "bg-success/15 text-success",
    APPROVED: "bg-success/15 text-success",
    RESOLVED: "bg-success/15 text-success",
    DRAFT: "bg-surface-2 text-muted-foreground",
    DISMISSED: "bg-surface-2 text-muted-foreground",
    IN_REVIEW: "bg-cyan/15 text-cyan",
    PENDING: "bg-cyan/15 text-cyan",
    OPEN: "bg-warning/15 text-warning",
    SCHEDULED: "bg-brand/15 text-brand-soft",
    CHANGES_REQUESTED: "bg-warning/15 text-warning",
    REJECTED: "bg-danger/15 text-danger",
    FAILED: "bg-danger/15 text-danger",
    BANNED: "bg-danger/15 text-danger",
    ARCHIVED: "bg-surface-2 text-muted-foreground",
    CREATED: "bg-cyan/15 text-cyan",
    REFUNDED: "bg-warning/15 text-warning",
    CANCELLED: "bg-warning/15 text-warning",
    EXPIRED: "bg-surface-2 text-muted-foreground",
    HIDDEN: "bg-warning/15 text-warning",
  };
  return <span className={cn("inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold", cls[status] ?? "bg-surface-2 text-muted-foreground")}>{status.replace(/_/g, " ")}</span>;
}

/** Builds hrefs that keep existing query params (for server-rendered tables). */
export function withParams(base: string, params: Record<string, string | undefined>, patch: Record<string, string | undefined>) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...params, ...patch })) if (v) p.set(k, v);
  const s = p.toString();
  return s ? `${base}?${s}` : base;
}

export function SortHeader({ label, field, base, params }: { label: string; field: string; base: string; params: Record<string, string | undefined> }) {
  const active = params.sort === field;
  const dir = active && params.dir === "asc" ? "desc" : "asc";
  return (
    <th scope="col" className="px-4 py-3" aria-sort={active ? (params.dir === "asc" ? "ascending" : "descending") : "none"}>
      <Link href={withParams(base, params, { sort: field, dir, page: undefined })} className="inline-flex items-center gap-1 hover:text-foreground">
        {label}
        {active ? params.dir === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" /> : <ChevronsUpDown className="size-3 opacity-50" />}
      </Link>
    </th>
  );
}

export function Pagination({ page, pages, base, params }: { page: number; pages: number; base: string; params: Record<string, string | undefined> }) {
  if (pages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="mt-4 flex items-center justify-end gap-2">
      <Button asChild variant="outline" size="sm" className={cn("rounded-xl", page <= 1 && "pointer-events-none opacity-50")} aria-disabled={page <= 1}>
        <Link href={withParams(base, params, { page: String(page - 1) })}>Previous</Link>
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page} / {pages}
      </span>
      <Button asChild variant="outline" size="sm" className={cn("rounded-xl", page >= pages && "pointer-events-none opacity-50")} aria-disabled={page >= pages}>
        <Link href={withParams(base, params, { page: String(page + 1) })}>Next</Link>
      </Button>
    </nav>
  );
}

export function SearchForm({ base, params, placeholder, extra }: { base: string; params: Record<string, string | undefined>; placeholder: string; extra?: ReactNode }) {
  return (
    <form action={base} method="get" role="search" className="glass mb-4 flex flex-wrap items-center gap-2 p-3">
      {Object.entries(params)
        .filter(([k, v]) => v && !["q", "page", "status", "role", "difficulty"].includes(k))
        .map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
      <label htmlFor="admin-q" className="sr-only">
        Search
      </label>
      <input
        id="admin-q"
        name="q"
        defaultValue={params.q}
        placeholder={placeholder}
        className="h-9 min-w-56 flex-1 rounded-xl border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {extra}
      <Button type="submit" size="sm" className="rounded-xl">
        Apply
      </Button>
    </form>
  );
}

export const selectCls = "h-9 rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function Table({ children, caption }: { children: ReactNode; caption: string }) {
  return (
    <div className="glass relative overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}

export const thCls = "border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground";
export const tdCls = "px-4 py-3";
export const trCls = "border-b border-border/60 last:border-0 hover:bg-accent/40";
