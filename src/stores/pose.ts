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
  resetPose: () => void;
};

const DEFAULT_POSE = {
  position: new THREE.Vector3(),
  quaternion: new THREE.Quaternion(),
};

export const usePoseStore = create<PoseState>()(
  immer((set) => ({
    pose: DEFAULT_POSE,
    setPose: (pose) =>
      set((state) => {
        state.pose = pose;
      }),
    resetPose: () => {
      set((state) => {
        state.pose = DEFAULT_POSE;
      });
    },
  }))
);
