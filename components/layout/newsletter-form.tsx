"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({ email: z.email("Enter a valid email") });

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [pending, start] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    start(async () => {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (res.ok) {
        toast.success("You're in! Check your inbox for the weekly digest.");
        setEmail("");
      } else toast.error("Could not subscribe right now. Try again later.");
    });
  };

  return (
    <form onSubmit={submit} className="flex max-w-sm gap-2" aria-label="Newsletter signup">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <Input
        id="newsletter-email"
        type="email"
        placeholder="you@college.edu"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-10 rounded-xl"
        required
      />
      <Button type="submit" className="h-10 rounded-xl" disabled={pending} aria-label="Subscribe">
        {pending ? <Loader2 className="animate-spin" /> : <ArrowRight />}
      </Button>
    </form>
  );
}
