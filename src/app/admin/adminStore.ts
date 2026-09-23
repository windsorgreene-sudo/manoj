"use client";

// Client-side demo store for the teacher/admin portal.
// NOTE: This is a front-end demo backed by localStorage so the full workflow is
// usable without a backend. When a real database + auth are connected, only the
// functions in this file need to change; the UI stays the same.

export interface DraftArticle {
  id: string;
  title: string;
  category: string;
  contentType: string;
  difficulty: string;
  description: string;
  body: string; // plain text / markdown-ish for the demo
  tags: string;
  updatedAt: number;
  status: "draft" | "published";
}

const SESSION_KEY = "cv-admin-session";
const DRAFTS_KEY = "cv-admin-drafts";

// Demo credentials. Replace with real auth later.
export const DEMO_TEACHER = { email: "teacher@codevidya.in", password: "teach123" };

export function isLoggedIn(): boolean {
  try {
    return localStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function login(email: string, password: string): boolean {
  const ok =
    email.trim().toLowerCase() === DEMO_TEACHER.email && password === DEMO_TEACHER.password;
  if (ok) {
    try {
      localStorage.setItem(SESSION_KEY, "1");
    } catch {}
  }
  return ok;
}

export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

export function getDrafts(): DraftArticle[] {
  try {
    return JSON.parse(localStorage.getItem(DRAFTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getDraft(id: string): DraftArticle | undefined {
  return getDrafts().find((d) => d.id === id);
}

export function saveDraft(draft: DraftArticle): void {
  const drafts = getDrafts();
  const idx = drafts.findIndex((d) => d.id === draft.id);
  const next = { ...draft, updatedAt: Date.now() };
  if (idx >= 0) drafts[idx] = next;
  else drafts.unshift(next);
  try {
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  } catch {}
}

export function deleteDraft(id: string): void {
  const drafts = getDrafts().filter((d) => d.id !== id);
  try {
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  } catch {}
}

export function newId(): string {
  return "d_" + Math.random().toString(36).slice(2, 9);
}
