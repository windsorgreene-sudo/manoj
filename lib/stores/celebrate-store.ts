import { create } from "zustand";

export type Celebration = {
  xp?: number;
  level?: number;
  leveledUp?: boolean;
  streak?: number;
  badges?: { slug: string; name: string; icon: string; color: string }[];
  accepted?: boolean;
};

type State = { current: Celebration | null; celebrate: (c: Celebration) => void; clear: () => void };

export const useCelebrateStore = create<State>((set) => ({
  current: null,
  celebrate: (current) => set({ current }),
  clear: () => set({ current: null }),
}));
