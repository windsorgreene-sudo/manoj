"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Hides the site footer on full-screen app surfaces (problem workspace, playground). */
export function FooterGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (/^\/problems\/[^/]+$/.test(pathname) || pathname.startsWith("/playground")) return null;
  return <>{children}</>;
}
