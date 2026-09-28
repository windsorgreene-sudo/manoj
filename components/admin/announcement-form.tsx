"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { selectCls } from "@/components/admin/ui";
import { saveAnnouncement, type AnnouncementInput } from "@/lib/actions/admin/platform";

const blank: AnnouncementInput = { title: "", body: "", link: "", variant: "info", isBanner: true, isActive: true, endsAt: null, notifyInApp: false, notifyEmail: false };

function Form({ initial, onDone }: { initial: AnnouncementInput; onDone?: () => void }) {
  const router = useRouter();
  const [a, setA] = useState(initial);
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const r = await saveAnnouncement(a);
    setBusy(false);
    if (!r.ok) return toast.error(r.error);
    toast.success(`Saved${r.data.notified ? ` · ${r.data.notified} notified` : ""}${r.data.emailed ? ` · ${r.data.emailed} emailed` : ""}`);
    if (!initial.id) setA(blank);
    onDone?.();
    router.refresh();
  };
  const sw = (k: "isBanner" | "isActive" | "notifyInApp" | "notifyEmail", label: string) => (
    <label className="flex items-center gap-2 text-sm"><Switch checked={Boolean(a[k])} onCheckedChange={(v) => setA({ ...a, [k]: v })} aria-label={label} /> {label}</label>
  );
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="space-y-1.5"><Label htmlFor={`an-t-${initial.id ?? "new"}`}>Title</Label><Input id={`an-t-${initial.id ?? "new"}`} value={a.title} onChange={(e) => setA({ ...a, title: e.target.value })} className="rounded-xl" /></div>
      <div className="space-y-1.5"><Label htmlFor={`an-b-${initial.id ?? "new"}`}>Message</Label><Textarea id={`an-b-${initial.id ?? "new"}`} rows={3} value={a.body} onChange={(e) => setA({ ...a, body: e.target.value })} className="rounded-xl" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5"><Label htmlFor={`an-l-${initial.id ?? "new"}`}>Link (optional)</Label><Input id={`an-l-${initial.id ?? "new"}`} value={a.link ?? ""} onChange={(e) => setA({ ...a, link: e.target.value })} placeholder="/contests/…" className="rounded-xl" /></div>
        <div className="space-y-1.5"><Label htmlFor={`an-v-${initial.id ?? "new"}`}>Style</Label><select id={`an-v-${initial.id ?? "new"}`} className={`${selectCls} w-full`} value={a.variant} onChange={(e) => setA({ ...a, variant: e.target.value as "info" })}><option value="info">Info (gradient)</option><option value="success">Success</option><option value="warning">Warning</option></select></div>
      </div>
      <div className="flex flex-wrap gap-4">{sw("isBanner", "Site banner")}{sw("isActive", "Active")}{sw("notifyInApp", "In-app notification")}{sw("notifyEmail", "Email subscribers")}</div>
      <Button type="submit" className="rounded-xl" disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : <Megaphone />} {initial.id ? "Update" : "Publish announcement"}</Button>
    </form>
  );
}

export function AnnouncementForm({ initial, compact }: { initial?: AnnouncementInput; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  if (compact && initial)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild><Button size="xs" variant="outline">Edit</Button></DialogTrigger>
        <DialogContent className="rounded-2xl"><DialogHeader><DialogTitle>Edit announcement</DialogTitle></DialogHeader><Form initial={{ ...blank, ...initial }} onDone={() => setOpen(false)} /></DialogContent>
      </Dialog>
    );
  return <section className="glass h-fit p-5" aria-label="New announcement"><h2 className="mb-3 font-semibold">New announcement</h2><Form initial={blank} /></section>;
}
