import type { ReactNode } from "react";
import { requireUser } from "@/lib/session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireUser("ADMIN", "/admin");
  return <main id="main" className="min-h-dvh">{children}</main>;
}
