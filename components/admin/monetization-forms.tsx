"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createCoupon, savePlan } from "@/lib/actions/admin/monetization";

export type PlanRow = { id: string; slug: string; name: string; description: string; priceInr: number; interval: string; features: string[]; isActive: boolean };

export function PlanEditor({ plan }: { plan: PlanRow }) {
  const router = useRouter();
  const [p, setP] = useState(plan);
  const [features, setFeatures] = useState(plan.features.join("\n"));
  const [busy, setBusy] = useState(false);
  const fid = `plan-${plan.id}`;
  return (
    <form
      className="glass space-y-3 p-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const r = await savePlan({ id: p.id, name: p.name, description: p.description, priceInr: p.priceInr, isActive: p.isActive, features: features.split("\n").map((f) => f.trim()).filter(Boolean) });
        setBusy(false);
        if (!r.ok) return void toast.error(r.error);
        toast.success("Plan saved");
        router.refresh();
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-xs text-muted-foreground">{p.slug} · {p.interval.toLowerCase()}</p>
        <label className="flex items-center gap-2 text-xs">Active <Switch checked={p.isActive} onCheckedChange={(v) => setP({ ...p, isActive: v })} aria-label={`${p.name} active`} /></label>
      </div>
      <div className="grid grid-cols-[1fr_120px] gap-2">
        <div className="space-y-1"><Label htmlFor={`${fid}-n`}>Name</Label><Input id={`${fid}-n`} value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} /></div>
        <div className="space-y-1"><Label htmlFor={`${fid}-p`}>Price (₹)</Label><Input id={`${fid}-p`} type="number" min={0} value={p.priceInr} onChange={(e) => setP({ ...p, priceInr: Number(e.target.value) })} /></div>
      </div>
      <div className="space-y-1"><Label htmlFor={`${fid}-d`}>Description</Label><Input id={`${fid}-d`} value={p.description} onChange={(e) => setP({ ...p, description: e.target.value })} /></div>
      <div className="space-y-1"><Label htmlFor={`${fid}-f`}>Features (one per line)</Label><Textarea id={`${fid}-f`} rows={4} value={features} onChange={(e) => setFeatures(e.target.value)} /></div>
      <Button type="submit" size="sm" className="rounded-lg" disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : null} Save plan</Button>
    </form>
  );
}

export function CouponForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [pct, setPct] = useState(10);
  const [maxUses, setMaxUses] = useState("");
  const [expires, setExpires] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="glass flex flex-wrap items-end gap-3 p-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const r = await createCoupon({ code, percentOff: pct, maxUses: maxUses ? Number(maxUses) : null, expiresAt: expires ? new Date(`${expires}T23:59:59`).toISOString() : null });
        setBusy(false);
        if (!r.ok) return void toast.error(r.error);
        toast.success("Coupon created");
        setCode("");
        router.refresh();
      }}
    >
      <div className="space-y-1"><Label htmlFor="c-code">Code</Label><Input id="c-code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="DIWALI30" className="w-36 font-mono" required /></div>
      <div className="space-y-1"><Label htmlFor="c-pct">% off</Label><Input id="c-pct" type="number" min={1} max={100} value={pct} onChange={(e) => setPct(Number(e.target.value))} className="w-20" /></div>
      <div className="space-y-1"><Label htmlFor="c-max">Max uses</Label><Input id="c-max" type="number" min={1} value={maxUses} onChange={(e) => setMaxUses(e.target.value)} placeholder="∞" className="w-24" /></div>
      <div className="space-y-1"><Label htmlFor="c-exp">Expires</Label><Input id="c-exp" type="date" value={expires} onChange={(e) => setExpires(e.target.value)} className="w-40" /></div>
      <Button type="submit" className="rounded-xl" disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : <Plus />} Create coupon</Button>
    </form>
  );
}
