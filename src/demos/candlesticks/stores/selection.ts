import { create } from "zustand";

type SelectionStore = {
  selection: string;
  setSelection: (selection: string) => void;
};

export const useSelection = create<SelectionStore>((set) => ({
  selection: "AAPL",
  setSelection: (selection: string) => set({ selection }),
}));
