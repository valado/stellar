import { create } from "zustand";

type CashMultiplierState = {
  multiplier: number;
  increment: () => void;
  decrement: () => void;
  resetMultiplier: () => void;
};

const MIN_MULTIPLIER = 0;
const MAX_MULTIPLIER = 100;

export const useCashMultiplier = create<CashMultiplierState>((set) => ({
  multiplier: 0,
  increment: () =>
    set((state) => {
      if (state.multiplier + 1 > MAX_MULTIPLIER) {
        return state;
      }

      return {
        multiplier: state.multiplier + 1,
      };
    }),
  decrement: () =>
    set((state) => {
      if (state.multiplier - 1 < MIN_MULTIPLIER) {
        return state;
      }

      return {
        multiplier: state.multiplier - 1,
      };
    }),
  resetMultiplier: () => set({ multiplier: MIN_MULTIPLIER }),
}));
