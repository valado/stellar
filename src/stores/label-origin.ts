import { create } from "zustand";

// Types
import type { Vector3 } from "three";

type LabelOriginState = {
  labelOrigin: Vector3 | null;
  setLabelOrigin: (labelOrigin: Vector3) => void;
  resetLabelOrigin: () => void;
};

export const useLabelOrigin = create<LabelOriginState>((set) => ({
  labelOrigin: null,
  setLabelOrigin: (labelOrigin) => set({ labelOrigin }),
  resetLabelOrigin: () => set({ labelOrigin: null }),
}));
