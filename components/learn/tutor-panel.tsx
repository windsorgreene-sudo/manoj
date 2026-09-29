"use client";

import { useLocale } from "@/components/i18n/intl-provider";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bot, Code2, HelpCircle, Lightbulb, ListChecks, Loader2, Send, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUiStore } from "@/lib/stores/ui-store";
import { useTutorCodeStore } from "@/lib/stores/tutor-code-store";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };
type Mode = "chat" | "explain" | "hint" | "review" | "quiz";

/** Tiny, safe Markdown renderer for tutor replies (text nodes only, no HTML injection). */
function Markdown({ text }: { text: string }) {
  const blocks = text.split(/```/);
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {blocks.map((b, i) =>
        i % 2 === 1 ? (
          <pre key={i} className="overflow-x-auto rounded-xl bg-black/40 p-3 font-mono text-xs">
            {b.replace(/^[a-z]*\n/, "")}
          </pre>
        ) : (
          b
            .split(/\n{2,}/)
            .filter(Boolean)
            .map((para, j) => (
              <p key={`${i}-${j}`} className="whitespace-pre-wrap">
                {para.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((seg, k) =>
                  seg.startsWith("**") ? (
                    <strong key={k}>{seg.slice(2, -2)}</strong>
                  ) : seg.startsWith("`") ? (
                    <code key={k} className="rounded bg-surface-2 px-1 font-mono text-xs">
                      {seg.slice(1, -1)}
                    </code>
                  ) : (
                    seg.replace(/^#+\s/gm, "").replace(/_\((.*)\)_/g, "($1)")
                  ),
                )}
              </p>
            ))
        ),
      )}
    </div>
  );
}

/** AI Tutor side panel, available on every learning page. */
export function TutorPanel() {
  const open = useUiStore((s) => s.tutorOpen);
  const setOpen = useUiStore((s) => s.setTutorOpen);
  const ctx = useUiStore((s) => s.tutorContext);
  const code = useTutorCodeStore((s) => s.code);
  const { locale } = useLocale();
  const [lang, setLang] = useState<"en" | "hi" | "hinglish">(locale);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [hintLevel, setHintLevel] = useState(1);
  const [error, setError] = useState<{ text: string; login?: boolean } | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // New context → fresh conversation (state reset during render, React-recommended pattern).
  const [ctxKey, setCtxKey] = useState(ctx?.title);
  if (ctx?.title !== ctxKey) {
    setCtxKey(ctx?.title);
    setMsgs([]);
    setHintLevel(1);
    setError(null);
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs]);

  const send = async (mode: Mode, text: string) => {
    if (busy || !text.trim()) return;
    setError(null);
    const history: Msg[] = [...msgs, { role: "user", content: text }];
    setMsgs([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, language: lang, context: ctx, code: mode === "review" ? code : undefined, hintLevel, messages: history.slice(-10) }),
      });
      if (!res.ok || !res.body) {
        const j = (await res.json().catch(() => ({}))) as { error?: string; code?: string };
        setError({ text: j.error ?? "The tutor is unavailable right now.", login: res.status === 401 });
        setMsgs(history);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMsgs([...history, { role: "assistant", content: acc }]);
      }
      if (mode === "hint") setHintLevel((l) => Math.min(4, l + 1));
    } catch {
      setError({ text: "Network error, please try again." });
      setMsgs(history);
    } finally {
      setBusy(false);
    }
  };

  const quick: { mode: Mode; label: string; Icon: typeof Bot; prompt: string; show: boolean }[] = [
    { mode: "explain", label: "Explain", Icon: HelpCircle, prompt: `Explain the key idea of "${ctx?.title ?? "this topic"}" simply.`, show: true },
    { mode: "hint", label: `Hint ${hintLevel}/4`, Icon: Lightbulb, prompt: `Give me hint ${hintLevel} for "${ctx?.title ?? "this problem"}".`, show: ctx?.kind === "problem" || ctx?.kind === "article" },
    { mode: "review", label: "Review my code", Icon: Code2, prompt: "Review my current code.", show: Boolean(code) },
    { mode: "quiz", label: "Quiz me", Icon: ListChecks, prompt: `Create a quiz from "${ctx?.title ?? "this article"}".`, show: ctx?.kind !== "problem" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md" data-lenis-prevent>
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-brand to-cyan text-white">
              <Bot className="size-4" />
            </span>
            AI Tutor
          </SheetTitle>
          <SheetDescription className="truncate">{ctx ? `Helping with: ${ctx.title}` : "Ask anything about programming."}</SheetDescription>
          <div className="flex gap-1 pt-1" role="radiogroup" aria-label="Tutor language">
            {(["en", "hinglish", "hi"] as const).map((l) => (
              <button
                key={l}
                type="button"
                role="radio"
                aria-checked={lang === l}
                onClick={() => setLang(l)}
                className={cn("rounded-lg px-2.5 py-1 text-xs font-medium", lang === l ? "bg-brand text-white" : "bg-surface-2 text-muted-foreground")}
              >
                {l === "en" ? "English" : l === "hinglish" ? "Hinglish" : "हिन्दी"}
              </button>
            ))}
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
          {msgs.length === 0 ? (
            <div className="glass p-5 text-sm text-muted-foreground">
              <Sparkles className="mb-2 size-5 text-cyan" />I give <strong className="text-foreground">progressive hints</strong> and never give the full solution unless you ask. Pick a quick action or type a question.
            </div>
          ) : null}
          {msgs.map((m, i) => (
            <div key={i} data-no-translate className={cn("max-w-[92%] rounded-2xl px-4 py-3", m.role === "user" ? "ml-auto bg-brand text-white" : "glass")}>
              {m.role === "assistant" ? m.content ? <Markdown text={m.content} /> : <Loader2 className="size-4 animate-spin" aria-label="Thinking" /> : <p className="text-sm whitespace-pre-wrap">{m.content}</p>}
            </div>
          ))}
          {error ? (
            <div className="rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm" role="alert">
              {error.text}{" "}
              {error.login ? (
                <Link href="/login" className="font-semibold underline">
                  Log in
                </Link>
              ) : null}
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {quick
              .filter((q) => q.show)
              .map((q) => (
                <Button key={q.mode} variant="outline" size="xs" className="rounded-lg" disabled={busy} onClick={() => send(q.mode, q.prompt)}>
                  <q.Icon /> {q.label}
                </Button>
              ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send("chat", input);
            }}
            className="flex gap-2"
          >
            <label htmlFor="tutor-input" className="sr-only">
              Message the tutor
            </label>
            <Textarea
              id="tutor-input"
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send("chat", input);
                }
              }}
              placeholder={lang === "hi" ? "अपना सवाल लिखें…" : "Ask a question…"}
              className="min-h-0 resize-none rounded-xl"
            />
            <Button type="submit" size="icon" className="size-auto rounded-xl px-3" disabled={busy || !input.trim()} aria-label="Send">
              {busy ? <Loader2 className="animate-spin" /> : <Send />}
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
