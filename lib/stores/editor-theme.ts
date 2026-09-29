"use client";

import { useTheme } from "next-themes";
import { usePrefsStore } from "@/lib/stores/prefs-store";

/** Monaco theme actually in use: the explicit editor choice, or the site theme when set to "auto". */
export function useResolvedEditorTheme(): "vs-dark" | "light" {
  const pref = usePrefsStore((s) => s.editorTheme);
  const { resolvedTheme } = useTheme();
  if (pref !== "auto") return pref;
  return resolvedTheme === "light" ? "light" : "vs-dark";
}
