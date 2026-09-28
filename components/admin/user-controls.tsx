"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActionButton } from "@/components/admin/action-button";
import { selectCls } from "@/components/admin/ui";
import { setUserBan, setUserRole } from "@/lib/actions/admin/platform";

export function UserControls({ userId, role, banned }: { userId: string; role: "STUDENT" | "CONTRIBUTOR" | "ADMIN"; banned: boolean }) {
  const [r, setR] = useState(role);
  const [reason, setReason] = useState("");
  const [days, setDays] = useState("7");
  return (
    <div className="glass space-y-4 p-5">
      <div className="space-y-1.5">
        <Label htmlFor="role">Role</Label>
        <div className="flex gap-2">
          <select id="role" className={selectCls} value={r} onChange={(e) => setR(e.target.value as typeof role)}><option>STUDENT</option><option>CONTRIBUTOR</option><option>ADMIN</option></select>
          <ActionButton size="sm" className="rounded-xl" disabled={r === role} action={() => setUserRole({ userId, role: r })} confirm={`Change role to ${r}? The user will be signed out.`} success="Role updated">Apply</ActionButton>
        </div>
      </div>
      {banned ? (
        <ActionButton variant="outline" className="w-full rounded-xl" action={() => setUserBan({ userId, banned: false })} success="User unbanned">Lift ban / suspension</ActionButton>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="ban-reason">Ban / suspend</Label>
          <Input id="ban-reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (shown to the user)" className="rounded-xl" />
          <div className="flex gap-2">
            <Input aria-label="Suspension days" type="number" min={1} value={days} onChange={(e) => setDays(e.target.value)} className="w-20 rounded-xl" />
            <ActionButton size="sm" variant="outline" className="rounded-xl" action={() => setUserBan({ userId, banned: true, reason, days: Number(days) || 7 })} confirm="Suspend this user?" success="User suspended">Suspend</ActionButton>
            <ActionButton size="sm" variant="destructive" className="rounded-xl" action={() => setUserBan({ userId, banned: true, reason, days: null })} confirm="Permanently ban this user?" success="User banned">Ban</ActionButton>
          </div>
        </div>
      )}
    </div>
  );
}
