import { create } from "zustand";
import { persist } from "zustand/middleware";

type Prefs = {
  codeLang: string;
  setCodeLang: (l: string) => void;
  /** "auto" follows the site theme; the editor toggle sets an explicit choice. */
  editorTheme: "auto" | "vs-dark" | "light";
  setEditorTheme: (t: Prefs["editorTheme"]) => void;
  fontSize: number;
  setFontSize: (n: number) => void;
};

export const usePrefsStore = create<Prefs>()(
  persist(
    (set) => ({
      codeLang: "cpp",
      setCodeLang: (codeLang) => set({ codeLang }),
      editorTheme: "auto",
      setEditorTheme: (editorTheme) => set({ editorTheme }),
      fontSize: 14,
      setFontSize: (fontSize) => set({ fontSize: Math.min(24, Math.max(11, fontSize)) }),
    }),
    {
      name: "cv-prefs",
      version: 1,
      // v0 always stored "vs-dark" as the default; switch everyone to "auto" once.
      migrate: (state) => ({ ...(state as Prefs), editorTheme: "auto" }),
    },
  ),
);
