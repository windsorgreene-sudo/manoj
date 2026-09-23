"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { courses } from "@/content/courses";
import {
  isLoggedIn,
  getDraft,
  saveDraft,
  newId,
  type DraftArticle,
} from "./adminStore";

const CONTENT_TYPES = ["lesson", "notes", "mcq", "assignment"];
const DIFFICULTIES = ["beginner", "intermediate", "advanced"];

const empty = (): DraftArticle => ({
  id: newId(),
  title: "",
  category: courses[0]?.slug ?? "c-programming",
  contentType: "lesson",
  difficulty: "beginner",
  description: "",
  body: "",
  tags: "",
  updatedAt: Date.now(),
  status: "draft",
});

export function ArticleEditor({ id }: { id?: string }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [draft, setDraft] = useState<DraftArticle>(empty());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const ok = isLoggedIn();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthed(ok);
    if (ok && id) {
      const existing = getDraft(id);
      if (existing) setDraft(existing);
    }
    setReady(true);
  }, [id]);

  if (!ready) return <div className="min-h-[50vh]" />;

  if (!authed) {
    return (
      <div className="mx-auto max-w-[600px] px-4 py-16 text-center">
        <p className="text-text-muted">Please sign in to the teacher portal first.</p>
        <Link href="/admin" className="mt-3 inline-block font-medium text-primary hover:underline">
          Go to sign in →
        </Link>
      </div>
    );
  }

  const set = (patch: Partial<DraftArticle>) => setDraft((d) => ({ ...d, ...patch }));

  const onSave = (status: "draft" | "published") => {
    saveDraft({ ...draft, status });
    setSaved(true);
    setTimeout(() => router.push("/admin"), 700);
  };

  const field =
    "w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-primary focus:outline-none";

  return (
    <div className="mx-auto max-w-[820px] px-4 py-6">
      <Breadcrumbs items={[{ label: "Teacher Portal", href: "/admin" }, { label: id ? "Edit article" : "New article" }]} />

      <div className="animate-fade-up mt-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text">
          {id ? "Edit article" : "New article"}
        </h1>
        <Link href="/admin" className="text-sm text-text-muted hover:text-primary">
          Cancel
        </Link>
      </div>

      <div className="mt-5 space-y-4 rounded-lg border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Title</label>
          <input
            value={draft.title}
            onChange={(e) => set({ title: e.target.value })}
            placeholder="e.g. Recursion in C"
            className={field}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Subject</label>
            <select value={draft.category} onChange={(e) => set({ category: e.target.value })} className={field}>
              {courses.map((c) => (
                <option key={c.slug} value={c.slug}>{c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Type</label>
            <select value={draft.contentType} onChange={(e) => set({ contentType: e.target.value })} className={field}>
              {CONTENT_TYPES.map((t) => (
                <option key={t} value={t} className="capitalize">{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Difficulty</label>
            <select value={draft.difficulty} onChange={(e) => set({ difficulty: e.target.value })} className={field}>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d} className="capitalize">{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text">Short description</label>
          <textarea
            value={draft.description}
            onChange={(e) => set({ description: e.target.value })}
            rows={2}
            placeholder="One or two lines shown in listings and search."
            className={field}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text">Content</label>
          <textarea
            value={draft.body}
            onChange={(e) => set({ body: e.target.value })}
            rows={12}
            placeholder="Write the lesson content here. (A rich editor and code blocks connect with the backend.)"
            className={`${field} font-mono text-[13px] leading-6`}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text">Tags (comma separated)</label>
          <input
            value={draft.tags}
            onChange={(e) => set({ tags: e.target.value })}
            placeholder="c, recursion, functions"
            className={field}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <button
            onClick={() => onSave("published")}
            disabled={!draft.title.trim()}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-contrast shadow-[var(--shadow-sm)] transition-all hover:bg-primary-hover hover:shadow-[var(--shadow-primary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save &amp; publish
          </button>
          <button
            onClick={() => onSave("draft")}
            disabled={!draft.title.trim()}
            className="rounded-lg border border-border-strong px-5 py-2 text-sm font-medium text-text transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
          >
            Save as draft
          </button>
          {saved && <span className="text-sm font-medium text-ok">Saved</span>}
        </div>
        <p className="text-xs text-text-faint">
          Demo: articles save to your browser. Connecting a database will publish them live on the
          site automatically.
        </p>
      </div>
    </div>
  );
}
