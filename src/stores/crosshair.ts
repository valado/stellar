import { create } from "zustand";

type CrosshairState = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export const useCrosshairStore = create<CrosshairState>((set) => ({
  visible: false,
  setVisible: (visible) => {
    set({ visible });
  },
}));
