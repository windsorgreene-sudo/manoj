import { create } from "zustand";

type UiState = {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  tutorOpen: boolean;
  setTutorOpen: (open: boolean) => void;
  tutorContext: { title: string; kind: "article" | "problem" | "lesson" | "general"; content?: string } | null;
  setTutorContext: (ctx: UiState["tutorContext"]) => void;
};

export const useUiStore = create<UiState>((set) => ({
  searchOpen: false,
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  tutorOpen: false,
  setTutorOpen: (tutorOpen) => set({ tutorOpen }),
  tutorContext: null,
  setTutorContext: (tutorContext) => set({ tutorContext }),
}));
