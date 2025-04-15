import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import * as THREE from "three";

type LabelState = {
  position: THREE.Vector3;
  setPosition: (position: THREE.Vector3) => void;
};

export const useLabelStore = create<LabelState>()(
  immer((set) => ({
    position: new THREE.Vector3(),
    setPosition: (position: THREE.Vector3) => {
      set((state) => {
        state.position = position;
      });
    },
  }))
);
