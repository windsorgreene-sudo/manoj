import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FooterGate } from "@/components/layout/footer-gate";
import { CommandPalette } from "@/components/layout/command-palette";
import { TutorPanel } from "@/components/learn/tutor-panel";
import { SiteStatus } from "@/components/layout/site-status";

/** Shared chrome for public (marketing + learn) pages. */
export function SiteShell({ children, footer = true }: { children: ReactNode; footer?: boolean }) {
  return (
    <>
      <SiteStatus />
      <Navbar />
      <main id="main" className="relative">
        {children}
      </main>
      {footer ? (
        <FooterGate>
          <Footer />
        </FooterGate>
      ) : null}
      <CommandPalette />
      <TutorPanel />
    </>
  );
}
