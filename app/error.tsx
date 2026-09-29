"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Home, RotateCcw, ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Route-level 500 page. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main id="main" className="container-cv flex min-h-dvh flex-col items-center justify-center text-center">
      <div className="relative mb-8">
        <div aria-hidden className="absolute inset-0 -z-10 rounded-full bg-danger/20 blur-3xl" />
        <ServerCrash className="size-20 text-danger" />
      </div>
      <p className="font-mono text-sm text-danger">Error 500</p>
      <h1 className="mt-3 font-heading text-4xl font-bold md:text-5xl">Our servers hit a runtime error</h1>
      <p className="mx-auto mt-4 max-w-md text-muted-foreground">
        Something broke on our side, not yours. Our team has been notified.
        {error.digest ? <span className="mt-2 block font-mono text-xs">Reference: {error.digest}</span> : null}
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset} className="rounded-xl">
          <RotateCcw /> Try again
        </Button>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/">
            <Home /> Home
          </Link>
        </Button>
      </div>
    </main>
  );
}
