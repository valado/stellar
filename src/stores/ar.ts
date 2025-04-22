import { create } from "zustand";

type ARStore = {
  isAR: boolean;
  setIsAR: (isAR: boolean) => void;
};

export const useARStore = create<ARStore>((set) => ({
  isAR: false,
  setIsAR: (isAR: boolean) =>
    set({
      isAR,
    }),
}));
