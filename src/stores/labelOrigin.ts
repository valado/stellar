import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import * as THREE from "three";

type LabelOriginState = {
  origin: THREE.Vector3;
  setOrigin: (position: THREE.Vector3) => void;
};

export const useLabelOriginStore = create<LabelOriginState>()(
  immer((set) => ({
    origin: new THREE.Vector3(),
    setOrigin: (position: THREE.Vector3) => {
      set((state) => {
        state.origin = position;
      });
    },
  }))
);
