import { create } from "zustand";
import { persist } from "zustand/middleware";

type Prefs = {
  codeLang: string;
  setCodeLang: (l: string) => void;
  editorTheme: "vs-dark" | "light";
  setEditorTheme: (t: Prefs["editorTheme"]) => void;
  fontSize: number;
  setFontSize: (n: number) => void;
};

export const usePrefsStore = create<Prefs>()(
  persist(
    (set) => ({
      codeLang: "cpp",
      setCodeLang: (codeLang) => set({ codeLang }),
      editorTheme: "vs-dark",
      setEditorTheme: (editorTheme) => set({ editorTheme }),
      fontSize: 14,
      setFontSize: (fontSize) => set({ fontSize: Math.min(24, Math.max(11, fontSize)) }),
    }),
    { name: "cv-prefs" },
  ),
);
