import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = { title: "Verify a certificate", description: "Check that a Kodshala certificate is genuine using its certificate ID.", alternates: { canonical: "/verify" } };

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code } = await searchParams;
  const clean = code?.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 30);
  if (clean) redirect(`/verify/${clean}`);
  return (
    <div className="container-cv flex min-h-[60vh] items-center justify-center py-16">
      <form action="/verify" method="get" className="glass w-full max-w-md p-8">
        <ShieldCheck className="size-10 text-success" aria-hidden />
        <h1 className="mt-4 font-heading text-2xl font-bold">Verify a certificate</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter the certificate ID printed on the bottom-left of the certificate, or scan its QR code.</p>
        <div className="mt-6 space-y-1.5">
          <Label htmlFor="code">Certificate ID</Label>
          <Input id="code" name="code" required placeholder="KS-PY-2026-A7F3" autoComplete="off" className="font-mono uppercase" />
        </div>
        <Button type="submit" className="mt-4 w-full rounded-xl">Verify</Button>
      </form>
    </div>
  );
}
