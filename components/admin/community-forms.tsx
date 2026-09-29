"use client";

import { useState } from "react";
import { ActionButton } from "@/components/admin/action-button";
import { selectCls } from "@/components/admin/ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adjustXp, adminIssueCertificate, messageUser, resetStreak, setUserBadge, verifyUserEmail } from "@/lib/actions/admin/community";

export function IssueCertificateForm({ courses }: { courses: { slug: string; title: string }[] }) {
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState(courses[0]?.slug ?? "");
  return (
    <div className="glass flex flex-wrap items-end gap-3 p-5">
      <div className="space-y-1"><Label htmlFor="ic-email">Learner email</Label><Input id="ic-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@example.com" className="w-64" /></div>
      <div className="space-y-1">
        <Label htmlFor="ic-course">Course</Label>
        <select id="ic-course" className={selectCls} value={course} onChange={(e) => setCourse(e.target.value)}>{courses.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}</select>
      </div>
      <ActionButton className="rounded-xl" disabled={!email || !course} action={() => adminIssueCertificate({ email, courseSlug: course })} success="Certificate issued" onDone={() => setEmail("")}>Issue certificate</ActionButton>
    </div>
  );
}

type BadgeOpt = { slug: string; name: string; owned: boolean };

/** Extra admin tools on a user's page: XP, badges, direct message, email verification, streak. */
export function UserTools({ userId, badges, emailVerified }: { userId: string; badges: BadgeOpt[]; emailVerified: boolean }) {
  const [amount, setAmount] = useState("50");
  const [reason, setReason] = useState("");
  const [badge, setBadge] = useState(badges[0]?.slug ?? "");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const owned = badges.find((b) => b.slug === badge)?.owned ?? false;
  return (
    <div className="space-y-4">
      <div className="glass space-y-2 p-5">
        <Label htmlFor="xp-amt">Give or take XP</Label>
        <div className="flex gap-2">
          <Input id="xp-amt" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-24 rounded-xl" aria-describedby="xp-hint" />
          <Input aria-label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (the user sees this)" className="rounded-xl" />
        </div>
        <p id="xp-hint" className="text-xs text-muted-foreground">Use a negative number to remove XP.</p>
        <ActionButton size="sm" className="rounded-xl" disabled={!Number(amount) || reason.trim().length < 3} action={() => adjustXp({ userId, amount: Number(amount), reason })} success="XP updated" onDone={() => setReason("")}>Apply</ActionButton>
      </div>
      <div className="glass space-y-2 p-5">
        <Label htmlFor="badge-sel">Badge</Label>
        <select id="badge-sel" className={`${selectCls} w-full`} value={badge} onChange={(e) => setBadge(e.target.value)}>{badges.map((b) => <option key={b.slug} value={b.slug}>{b.name}{b.owned ? " (owned)" : ""}</option>)}</select>
        <ActionButton size="sm" variant={owned ? "outline" : "default"} className="rounded-xl" action={() => setUserBadge({ userId, badgeSlug: badge, award: !owned })} success={owned ? "Badge removed" : "Badge awarded"}>{owned ? "Remove badge" : "Award badge"}</ActionButton>
      </div>
      <div className="glass space-y-2 p-5">
        <Label htmlFor="msg-title">Send a notification</Label>
        <Input id="msg-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="rounded-xl" />
        <Textarea aria-label="Message" value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="Message" className="rounded-xl" />
        <Input aria-label="Link (optional)" value={link} onChange={(e) => setLink(e.target.value)} placeholder="/courses (optional)" className="rounded-xl" />
        <ActionButton size="sm" className="rounded-xl" disabled={title.trim().length < 2 || body.trim().length < 2} action={() => messageUser({ userId, title, body, link })} success="Notification sent" onDone={() => { setTitle(""); setBody(""); setLink(""); }}>Send</ActionButton>
      </div>
      <div className="glass flex flex-wrap gap-2 p-5">
        {!emailVerified ? <ActionButton size="sm" variant="outline" className="rounded-xl" action={() => verifyUserEmail(userId)} success="Email marked as verified">Mark email verified</ActionButton> : null}
        <ActionButton size="sm" variant="outline" className="rounded-xl" action={() => resetStreak(userId)} confirm="Reset this user's streak to 0?" success="Streak reset">Reset streak</ActionButton>
      </div>
    </div>
  );
}
