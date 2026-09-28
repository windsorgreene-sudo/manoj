import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { integrations } from "@/lib/env";
import { getCurrentUser } from "@/lib/session";
import { safeNext } from "@/lib/safe-next";

export const metadata: Metadata = { title: "Log in", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const target = safeNext(next);
  if (await getCurrentUser()) redirect(target);
  return <LoginForm next={target} google={integrations.google()} github={integrations.github()} />;
}
