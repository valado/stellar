import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import * as THREE from "three";

type Pose = {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
};

type PoseState = {
  pose: Pose;
  setPose: (pose: Pose) => void;
};

export const usePoseStore = create<PoseState>()(
  immer((set) => ({
    pose: {
      position: new THREE.Vector3(),
      quaternion: new THREE.Quaternion(),
    },
    setPose: (pose) =>
      set((state) => {
        state.pose = pose;
      }),
  }))
);
