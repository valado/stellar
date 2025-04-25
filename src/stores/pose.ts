import { create } from "zustand";

// Types
import type { Vector3, Quaternion } from "three";

type Pose = {
  position: Vector3;
  quaternion: Quaternion;
};

type PoseState = {
  pose: Pose | null;
  isPoseSet: boolean;
  setPose: (pose: Pose) => void;
  resetPose: () => void;
};

export const usePose = create<PoseState>((set) => ({
  pose: null,
  isPoseSet: false,
  setPose: (pose) =>
    set({
      isPoseSet: true,
      pose,
    }),
  resetPose: () => set({ isPoseSet: false, pose: null }),
}));
