"use client";

import { useLocale } from "@/components/i18n/intl-provider";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updatePreferences, updateProfile, type PrefsInput } from "@/lib/actions/dashboard";
import { authClient } from "@/lib/auth-client";
import { LANGUAGE_META, LANGUAGES } from "@/lib/languages";
import { passwordSchema } from "@/lib/validators/auth";

type P = { bio: string; college: string; location: string; website: string; github: string; linkedin: string } & PrefsInput;

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="glass space-y-4 p-6" aria-labelledby={`s-${title}`}>
      <div>
        <h2 id={`s-${title}`} className="font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

export function SettingsForms({ user, profile, hasPassword }: { user: { name: string; email: string; image: string | null; username: string }; profile: P; hasPassword: boolean }) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const { setLocale } = useLocale();
  const fileRef = useRef<HTMLInputElement>(null);
  const [f, setF] = useState({ name: user.name, username: user.username, bio: profile.bio, college: profile.college, location: profile.location, website: profile.website, github: profile.github, linkedin: profile.linkedin });
  const [prefs, setPrefs] = useState<PrefsInput>({ theme: profile.theme, locale: profile.locale, preferredLang: profile.preferredLang, emailNotifications: profile.emailNotifications, pushNotifications: profile.pushNotifications, weeklyDigest: profile.weeklyDigest });
  const [pw, setPw] = useState({ current: "", next: "" });
  const [busy, setBusy] = useState<string | null>(null);
  const [avatar, setAvatar] = useState(user.image);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy("profile");
    const r = await updateProfile(f);
    setBusy(null);
    if (r.ok) {
      toast.success("Profile updated");
      router.refresh();
    } else toast.error(r.error);
  };
  const savePrefs = async (next: PrefsInput) => {
    setPrefs(next);
    const r = await updatePreferences(next);
    if (!r.ok) toast.error(r.error);
    else toast.success("Preferences saved");
    setTheme(next.theme);
    setLocale(next.locale === "hi" ? "hi" : "en");
  };
  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = passwordSchema.safeParse(pw.next);
    if (!v.success) return toast.error(v.error.issues[0]?.message);
    setBusy("pw");
    const { error } = await authClient.changePassword({ currentPassword: pw.current, newPassword: pw.next, revokeOtherSessions: true });
    setBusy(null);
    if (error) toast.error(error.message ?? "Could not change password");
    else {
      toast.success("Password changed. Other sessions were signed out.");
      setPw({ current: "", next: "" });
    }
  };
  const upload = async (file: File) => {
    setBusy("avatar");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("purpose", "avatar");
    const res = await fetch("/api/uploads", { method: "POST", body: fd });
    const j = (await res.json()) as { url?: string; error?: string };
    setBusy(null);
    if (!res.ok || !j.url) return toast.error(j.error ?? "Upload failed");
    setAvatar(j.url);
    toast.success("Avatar updated");
    router.refresh();
  };

  const field = (k: keyof typeof f, label: string, props: React.ComponentProps<typeof Input> = {}) => (
    <div className="space-y-1.5">
      <Label htmlFor={`f-${k}`}>{label}</Label>
      <Input id={`f-${k}`} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="rounded-xl" {...props} />
    </div>
  );

  return (
    <div className="space-y-6">
      <Section title="Profile" description="This information appears on your public profile.">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            {avatar ? <AvatarImage src={avatar} alt="" /> : null}
            <AvatarFallback className="bg-brand/20 text-lg">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" aria-label="Upload avatar" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => fileRef.current?.click()} disabled={busy === "avatar"}>
            {busy === "avatar" ? <Loader2 className="animate-spin" /> : <Camera />} Change avatar
          </Button>
          <p className="text-xs text-muted-foreground">PNG/JPG/WebP, max 5 MB</p>
        </div>
        <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2">
          {field("name", "Full name")}
          {field("username", "Username", { pattern: "[a-z0-9_]{3,20}" })}
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="f-bio">Bio</Label>
            <Textarea id="f-bio" rows={3} maxLength={280} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} className="rounded-xl" />
          </div>
          {field("college", "College")}
          {field("location", "Location")}
          {field("website", "Website", { type: "url", placeholder: "https://" })}
          {field("github", "GitHub URL", { type: "url", placeholder: "https://github.com/…" })}
          {field("linkedin", "LinkedIn URL", { type: "url", placeholder: "https://linkedin.com/in/…" })}
          <div className="flex items-end">
            <Button type="submit" className="rounded-xl" disabled={busy === "profile"}>{busy === "profile" ? <Loader2 className="animate-spin" /> : null} Save profile</Button>
          </div>
        </form>
      </Section>

      <Section title="Preferences" description="Theme, interface language and default coding language.">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label id="l-theme">Theme</Label>
            <Select value={prefs.theme} onValueChange={(v) => savePrefs({ ...prefs, theme: v as "dark" | "light" })}>
              <SelectTrigger aria-labelledby="l-theme" className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="dark">Dark</SelectItem><SelectItem value="light">Light</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label id="l-locale">Language</Label>
            <Select value={prefs.locale} onValueChange={(v) => savePrefs({ ...prefs, locale: v as "en" | "hi" })}>
              <SelectTrigger aria-labelledby="l-locale" className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="hi">हिन्दी</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label id="l-code">Default code language</Label>
            <Select value={prefs.preferredLang} onValueChange={(v) => savePrefs({ ...prefs, preferredLang: v as PrefsInput["preferredLang"] })}>
              <SelectTrigger aria-labelledby="l-code" className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{LANGUAGES.map((l) => <SelectItem key={l} value={l}>{LANGUAGE_META[l].label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      <Section title="Notifications" description="Choose what we send you.">
        {(
          [
            ["emailNotifications", "Email notifications", "Contest reminders, replies and account alerts"],
            ["pushNotifications", "In-app notifications", "Badges, follows and announcements"],
            ["weeklyDigest", "Weekly digest", "The best new tutorials and problems every Sunday"],
          ] as const
        ).map(([k, label, desc]) => (
          <div key={k} className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor={`n-${k}`}>{label}</Label>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <Switch id={`n-${k}`} aria-label={label} checked={prefs[k]} onCheckedChange={(v) => savePrefs({ ...prefs, [k]: v })} />
          </div>
        ))}
      </Section>

      <Section title="Password" description={hasPassword ? "Change your password. Other devices will be signed out." : "You signed up with a social account, so there's no password to change."}>
        {hasPassword ? (
          <form onSubmit={changePassword} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label htmlFor="pw-cur">Current password</Label><Input id="pw-cur" type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1.5"><Label htmlFor="pw-new">New password</Label><Input id="pw-new" type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className="rounded-xl" /></div>
            <div><Button type="submit" className="rounded-xl" disabled={busy === "pw" || !pw.current || !pw.next}>{busy === "pw" ? <Loader2 className="animate-spin" /> : null} Update password</Button></div>
          </form>
        ) : null}
        <p className="text-xs text-muted-foreground">Signed in as {user.email}</p>
      </Section>
    </div>
  );
}
