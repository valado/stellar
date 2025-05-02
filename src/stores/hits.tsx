import { create } from "zustand";

// Types
import type { Matrix4 } from "three";

type HitStore = {
  hits: Partial<Record<XRHandedness, Matrix4>>;
  setHit: (handedness: XRHandedness, hit: Matrix4) => void;
  resetHits: () => void;
};

export const useHits = create<HitStore>((set) => ({
  hits: {},
  setHit: (handedness, hit) =>
    set((state) => ({
      hits: {
        ...state.hits,
        [handedness]: hit,
      },
    })),
  resetHits: () =>
    set({
      hits: {},
    }),
}));
