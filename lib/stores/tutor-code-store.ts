import { create } from "zustand";

/** The code currently open in an editor (so the tutor can review it). */
export const useTutorCodeStore = create<{ code: string; setCode: (c: string) => void }>((set) => ({
  code: "",
  setCode: (code) => set({ code }),
}));
