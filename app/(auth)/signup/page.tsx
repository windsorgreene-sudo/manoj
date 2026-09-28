import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth/signup-form";
import { integrations } from "@/lib/env";
import { getCurrentUser } from "@/lib/session";
import { safeNext } from "@/lib/safe-next";

export const metadata: Metadata = { title: "Create your account", robots: { index: false } };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const target = safeNext(next);
  if (await getCurrentUser()) redirect(target);
  return <SignupForm next={target} google={integrations.google()} github={integrations.github()} />;
}
