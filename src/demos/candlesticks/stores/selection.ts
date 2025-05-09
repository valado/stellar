import { create } from "zustand";

type SelectionStore = {
  selection: string;
  setSelection: (selection: string) => void;
  resetSelection: () => void;
};

const DEFAULT_SECTION = "AAPL";

export const useSelection = create<SelectionStore>((set) => ({
  selection: DEFAULT_SECTION,
  setSelection: (selection: string) => set({ selection }),
  resetSelection: () => set({ selection: DEFAULT_SECTION }),
}));
