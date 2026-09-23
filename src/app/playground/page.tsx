import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PlaygroundClient } from "./PlaygroundClient";

export const metadata: Metadata = {
  title: "Code Playground",
  description:
    "Write and run code in your browser. Supports JavaScript, TypeScript, Python, Java, C++, C and Bash.",
  alternates: { canonical: "/playground" },
};

export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6">
      <Breadcrumbs items={[{ label: "Playground" }]} />
      <header className="animate-fade-up mt-4 mb-5">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
          Code Playground
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-text-muted">
          Write code and run it instantly, right in your browser. JavaScript runs live with no
          setup; other languages run when a hosted runner is connected. Press Run or Ctrl+Enter.
        </p>
      </header>
      <PlaygroundClient />
    </div>
  );
}
