"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LogoMark } from "@/components/Logo";
import { articles, categories } from "@/content";
import { formatDate } from "@/lib/site";
import {
  isLoggedIn,
  login,
  logout,
  getDrafts,
  deleteDraft,
  DEMO_TEACHER,
  type DraftArticle,
} from "./adminStore";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthed(isLoggedIn());
    setReady(true);
  }, []);

  if (!ready) return <div className="min-h-[50vh]" />;

  return authed ? (
    <Dashboard onLogout={() => { logout(); setAuthed(false); }} />
  ) : (
    <LoginScreen onLogin={() => setAuthed(true)} />
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) onLogin();
    else setError("Invalid email or password.");
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[440px] flex-col justify-center px-4 py-10">
      <div className="animate-fade-up rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-md)]">
        <div className="mb-4 flex items-center gap-2">
          <LogoMark className="h-10 w-10 rounded-xl" />
          <div>
            <p className="font-display text-lg font-bold text-text">Teacher Portal</p>
            <p className="text-xs text-text-muted">Sign in to manage content</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-text">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@codevidya.in"
              className="w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-text">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-primary focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-contrast shadow-[var(--shadow-sm)] transition-all hover:bg-primary-hover hover:shadow-[var(--shadow-primary)]"
          >
            Sign in
          </button>
        </form>
        <div className="mt-4 rounded-lg bg-surface-2 p-3 text-xs text-text-muted">
          <p className="font-semibold text-text">Demo login</p>
          <p>Email: {DEMO_TEACHER.email}</p>
          <p>Password: {DEMO_TEACHER.password}</p>
          <p className="mt-1 text-text-faint">
            This is a front-end demo. Content is saved in your browser and is ready to connect to a
            real database and authentication later.
          </p>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [drafts, setDrafts] = useState<DraftArticle[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrafts(getDrafts());
  }, []);

  const remove = (id: string) => {
    deleteDraft(id);
    setDrafts(getDrafts());
  };

  const publishedCount = articles.length;

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6">
      <Breadcrumbs items={[{ label: "Teacher Portal" }]} />

      <header className="animate-fade-up mt-4 flex flex-wrap items-center justify-between gap-3 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary-soft to-surface p-6 shadow-[var(--shadow-sm)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Teacher portal</p>
          <h1 className="font-display mt-1 text-2xl font-bold text-text sm:text-3xl">Content Dashboard</h1>
          <p className="mt-1 text-[15px] text-text-muted">Create and manage tutorials, notes and resources.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-contrast shadow-[var(--shadow-sm)] transition-all hover:bg-primary-hover hover:shadow-[var(--shadow-primary)]"
          >
            + New article
          </Link>
          <button
            onClick={onLogout}
            className="rounded-lg border border-border-strong px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Published", value: publishedCount },
          { label: "My drafts", value: drafts.filter((d) => d.status === "draft").length },
          { label: "Categories", value: categories.length },
          { label: "Total items", value: publishedCount + drafts.length },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-surface p-4 text-center shadow-[var(--shadow-xs)]">
            <div className="font-display text-2xl font-bold text-primary">{s.value}</div>
            <div className="mt-0.5 text-xs text-text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* My drafts */}
      <section className="mt-8">
        <h2 className="mb-3 border-b border-border pb-2 text-lg font-bold text-text">My Articles (drafts)</h2>
        {drafts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-strong bg-surface p-8 text-center">
            <p className="text-sm text-text-muted">No drafts yet. Create your first article.</p>
            <Link href="/admin/new" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
              + New article
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs uppercase tracking-wide text-text-muted">
                <tr>
                  <th className="px-4 py-2.5">Title</th>
                  <th className="hidden px-4 py-2.5 sm:table-cell">Category</th>
                  <th className="hidden px-4 py-2.5 sm:table-cell">Updated</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {drafts.map((d) => (
                  <tr key={d.id} className="bg-surface hover:bg-surface-2">
                    <td className="px-4 py-3 font-medium text-text">{d.title || "Untitled"}</td>
                    <td className="hidden px-4 py-3 text-text-muted sm:table-cell">{d.category}</td>
                    <td className="hidden px-4 py-3 text-text-faint sm:table-cell">
                      {formatDate(new Date(d.updatedAt).toISOString())}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/edit/${d.id}`} className="text-primary hover:underline">
                        Edit
                      </Link>
                      <button
                        onClick={() => remove(d.id)}
                        className="ml-3 text-text-muted hover:text-rose-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Published (read-only from content) */}
      <section className="mt-8">
        <h2 className="mb-3 border-b border-border pb-2 text-lg font-bold text-text">Published Library</h2>
        <p className="mb-3 text-[13px] text-text-muted">
          These are live on the site. Editing published content will be enabled once a database is
          connected.
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {articles.slice(0, 10).map((a) => (
            <Link
              key={a.slug}
              href={`/${a.category}/${a.slug}`}
              className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm transition-colors hover:border-primary"
            >
              <span className="min-w-0 truncate font-medium text-text">{a.title}</span>
              <span className="ml-2 shrink-0 text-xs text-text-faint">{a.contentType}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
