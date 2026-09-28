"use client";

import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/lib/stores/ui-store";

export function TutorLauncher({ title, kind, content, className }: { title: string; kind: "article" | "problem" | "lesson" | "general"; content?: string; className?: string }) {
  const setCtx = useUiStore((s) => s.setTutorContext);
  const setOpen = useUiStore((s) => s.setTutorOpen);
  return (
    <Button
      size="sm"
      className={className ?? "rounded-xl bg-gradient-to-r from-brand to-cyan text-white hover:opacity-90"}
      onClick={() => {
        setCtx({ title, kind, content });
        setOpen(true);
      }}
    >
      <Bot /> Ask AI Tutor
    </Button>
  );
}
