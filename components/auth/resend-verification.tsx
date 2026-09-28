"use client";

import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function ResendVerification({ defaultEmail }: { defaultEmail: string }) {
  const [email, setEmail] = useState(defaultEmail);
  const [busy, setBusy] = useState(false);
  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!z.email().safeParse(email).success) return toast.error("Enter a valid email");
    setBusy(true);
    const { error } = await authClient.sendVerificationEmail({ email, callbackURL: "/verify-email" });
    setBusy(false);
    if (error) toast.error(error.message ?? "Could not send email");
    else toast.success("Verification email sent.");
  };
  return (
    <form onSubmit={send} className="flex gap-2">
      <label htmlFor="resend-email" className="sr-only">Email</label>
      <Input id="resend-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" className="h-10 rounded-xl" />
      <Button type="submit" disabled={busy} className="h-10 rounded-xl">Resend</Button>
    </form>
  );
}
