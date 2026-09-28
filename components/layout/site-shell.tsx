import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CommandPalette } from "@/components/layout/command-palette";
import { TutorPanel } from "@/components/learn/tutor-panel";

/** Shared chrome for public (marketing + learn) pages. */
export function SiteShell({ children, footer = true }: { children: ReactNode; footer?: boolean }) {
  return (
    <>
      <Navbar />
      <main id="main" className="relative">
        {children}
      </main>
      {footer ? <Footer /> : null}
      <CommandPalette />
      <TutorPanel />
    </>
  );
}
