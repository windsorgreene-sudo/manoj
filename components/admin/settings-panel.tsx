"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Plus, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createFlag, saveBranding, setFlag } from "@/lib/actions/admin/platform";

type Flag = { key: string; enabled: boolean; description: string };

export function SettingsPanel({ branding, flags, integrations }: { branding: { siteName: string; tagline: string; supportEmail: string }; flags: Flag[]; integrations: Record<string, boolean> }) {
  const router = useRouter();
  const [b, setB] = useState(branding);
  const [nk, setNk] = useState("");
  const [nd, setNd] = useState("");
  const maintenance = flags.find((f) => f.key === "maintenance_mode");
  const toggle = async (key: string, enabled: boolean) => {
    if (key === "maintenance_mode" && enabled && !window.confirm("Enable maintenance mode? Non-admin visitors will see a maintenance screen.")) return;
    const r = await setFlag({ key, enabled });
    if (r.ok) { toast.success(`${key} ${enabled ? "enabled" : "disabled"}`); router.refresh(); } else toast.error(r.error);
  };
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="glass space-y-3 p-5" aria-labelledby="br">
        <h2 id="br" className="font-semibold">Branding</h2>
        <div className="space-y-1.5"><Label htmlFor="b-name">Site name</Label><Input id="b-name" value={b.siteName} onChange={(e) => setB({ ...b, siteName: e.target.value })} className="rounded-xl" /></div>
        <div className="space-y-1.5"><Label htmlFor="b-tag">Tagline</Label><Input id="b-tag" value={b.tagline} onChange={(e) => setB({ ...b, tagline: e.target.value })} className="rounded-xl" /></div>
        <div className="space-y-1.5"><Label htmlFor="b-mail">Support email</Label><Input id="b-mail" type="email" value={b.supportEmail} onChange={(e) => setB({ ...b, supportEmail: e.target.value })} className="rounded-xl" /></div>
        <Button className="rounded-xl" onClick={async () => { const r = await saveBranding(b); if (r.ok) toast.success("Branding saved"); else toast.error(r.error); }}>Save branding</Button>
      </section>
      <section className="glass space-y-3 p-5" aria-labelledby="mm">
        <h2 id="mm" className="font-semibold">Maintenance mode</h2>
        <div className="flex items-center justify-between rounded-xl border border-border p-4">
          <div><p className="font-medium">{maintenance?.enabled ? "Site is in maintenance" : "Site is live"}</p><p className="text-xs text-muted-foreground">Admins can still use the site.</p></div>
          <Switch checked={Boolean(maintenance?.enabled)} onCheckedChange={(v) => toggle("maintenance_mode", v)} aria-label="Maintenance mode" />
        </div>
        <h2 className="pt-2 font-semibold">Integrations</h2>
        <ul className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(integrations).map(([k, v]) => (
            <li key={k} className="flex items-center gap-2">{v ? <CheckCircle2 className="size-4 text-success" /> : <XCircle className="size-4 text-muted-foreground" />} {k} <span className="text-xs text-muted-foreground">{v ? "configured" : "fallback"}</span></li>
          ))}
        </ul>
      </section>
      <section className="glass space-y-3 p-5 xl:col-span-2" aria-labelledby="ff">
        <h2 id="ff" className="font-semibold">Feature flags</h2>
        <ul className="divide-y divide-border">
          {flags.filter((f) => f.key !== "maintenance_mode").map((f) => (
            <li key={f.key} className="flex items-center justify-between gap-4 py-3">
              <div><p className="font-mono text-sm">{f.key}</p><p className="text-xs text-muted-foreground">{f.description}</p></div>
              <Switch checked={f.enabled} onCheckedChange={(v) => toggle(f.key, v)} aria-label={f.key} />
            </li>
          ))}
        </ul>
        <form className="flex flex-wrap items-end gap-2" onSubmit={async (e) => { e.preventDefault(); const r = await createFlag({ key: nk, description: nd }); if (r.ok) { setNk(""); setNd(""); toast.success("Flag created"); router.refresh(); } else toast.error(r.error); }}>
          <div className="space-y-1.5"><Label htmlFor="nf-k">New flag key</Label><Input id="nf-k" value={nk} onChange={(e) => setNk(e.target.value)} placeholder="beta_feature" className="rounded-xl font-mono" /></div>
          <div className="flex-1 space-y-1.5"><Label htmlFor="nf-d">Description</Label><Input id="nf-d" value={nd} onChange={(e) => setNd(e.target.value)} className="rounded-xl" /></div>
          <Button type="submit" variant="outline" className="rounded-xl"><Plus /> Add flag</Button>
        </form>
      </section>
    </div>
  );
}
