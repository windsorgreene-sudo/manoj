import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CommandPalette } from "@/components/layout/command-palette";
import { getCurrentUser } from "@/lib/session";

/** Shared chrome for public (marketing + learn) pages. */
export async function SiteShell({ children, footer = true }: { children: ReactNode; footer?: boolean }) {
  const user = await getCurrentUser();
  return (
    <>
      <Navbar user={user} />
      <main id="main" className="relative">
        {children}
      </main>
      {footer ? <Footer /> : null}
      <CommandPalette />
    </>
  );
}
