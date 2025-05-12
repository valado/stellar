import { create } from "zustand";

// Types
import type { Vector3 } from "three";

type LabelsStore = {
  origin: Vector3 | null;
  isVisible: boolean;
  setOrigin: (origin: Vector3) => void;
  setIsVisible: (isVisible: boolean) => void;
  resetOrigin: () => void;
};

export const useLabels = create<LabelsStore>((set) => ({
  origin: null,
  isVisible: true,
  setOrigin: (origin) => set({ origin }),
  setIsVisible: (isVisible) => set({ isVisible }),
  resetOrigin: () => set({ origin: null }),
}));
