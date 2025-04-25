import { create } from "zustand";
import { createXRStore } from "@react-three/xr";

// Components
import { Input } from "$components/Input";

// Types
import type { XRStore } from "@react-three/xr";

type XRSessionState = {
  store: XRStore;
  isInAR: boolean;
  setStore: (store: XRStore) => void;
  setIsInAR: (isInAR: boolean) => void;
};

const DEFAULT_STORE = createXRStore({
  planeDetection: false,
  meshDetection: false,
  gaze: false,
  hand: () => <Input kind="hand" />,
  controller: () => <Input kind="controller" />,
});

export const useXRSession = create<XRSessionState>((set) => ({
  store: DEFAULT_STORE,
  isInAR: false,
  setStore: (store) => set({ store }),
  setIsInAR: (isInAR) => set({ isInAR }),
}));
