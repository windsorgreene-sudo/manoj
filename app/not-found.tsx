import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/layout/site-shell";
import { AstronautStage } from "@/components/three/astronaut-stage";

export const metadata: Metadata = { title: "Lost in space (404)", robots: { index: false } };

export default function NotFound() {
  return (
    <SiteShell footer={false}>
      <section className="container-cv flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center py-10 text-center">
        <AstronautStage />
        <p className="font-mono text-sm text-cyan">Error 404 · drag the astronaut to rotate</p>
        <h1 className="mt-3 font-heading text-4xl font-bold md:text-6xl">
          This page drifted into <span className="text-gradient">deep space</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">The link may be broken or the page may have moved. Let&apos;s get you back to solid ground.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-xl">
            <Link href="/">
              <Home /> Back home
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/tutorials">
              <Compass /> Browse tutorials
            </Link>
          </Button>
          <Button asChild variant="ghost" className="rounded-xl">
            <Link href="/problems">
              <Search /> Find a problem
            </Link>
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}
