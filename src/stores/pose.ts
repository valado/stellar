import { create } from "zustand";

// Types
import type { Vector3, Quaternion } from "three";

type Pose = {
  position: Vector3;
  quaternion: Quaternion;
};

type PoseState = {
  pose: Pose | null;
  setPose: (pose: Pose) => void;
  resetPose: () => void;
};

export const usePose = create<PoseState>((set) => ({
  pose: null,
  setPose: (pose) => set({ pose }),
  resetPose: () => set({ pose: null }),
}));
