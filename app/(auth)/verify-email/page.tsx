import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, MailWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResendVerification } from "@/components/auth/resend-verification";

export const metadata: Metadata = { title: "Verify your email", robots: { index: false } };

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ error?: string; email?: string }> }) {
  const { error, email } = await searchParams;
  if (!error) {
    return (
      <div className="glass space-y-4 p-8 text-center">
        <CheckCircle2 className="mx-auto size-12 text-success" />
        <h1 className="font-heading text-2xl font-bold">Email verified</h1>
        <p className="text-muted-foreground">Your account is active. Let&apos;s start your first streak!</p>
        <Button asChild className="rounded-xl">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="glass space-y-4 p-8 text-center">
      <MailWarning className="mx-auto size-12 text-warning" />
      <h1 className="font-heading text-2xl font-bold">Link expired or invalid</h1>
      <p className="text-muted-foreground">Verification links are valid for 1 hour. Request a fresh one below.</p>
      <ResendVerification defaultEmail={email ?? ""} />
    </div>
  );
}
