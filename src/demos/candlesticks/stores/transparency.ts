import { create } from "zustand";

type TransparencyStore = {
  isTransparent: boolean;
  setIsTransparent: (isTransparent: boolean) => void;
};

export const useTransparency = create<TransparencyStore>((set) => ({
  isTransparent: false,
  setIsTransparent: (isTransparent) => set({ isTransparent }),
}));
