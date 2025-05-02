import { create } from "zustand";

type CashMultiplierState = {
  cashMultiplier: number;
  incrementCashMultiplier: () => void;
  decrementCashMultiplier: () => void;
  resetCashMultiplier: () => void;
};

const MIN_MULTIPLIER = 0;
const MAX_MULTIPLIER = 100;

export const useCashMultiplier = create<CashMultiplierState>((set) => ({
  cashMultiplier: 0,
  incrementCashMultiplier: () =>
    set((state) => {
      if (state.cashMultiplier + 1 > MAX_MULTIPLIER) {
        return state;
      }

      return {
        cashMultiplier: state.cashMultiplier + 1,
      };
    }),
  decrementCashMultiplier: () =>
    set((state) => {
      if (state.cashMultiplier - 1 < MIN_MULTIPLIER) {
        return state;
      }

      return {
        cashMultiplier: state.cashMultiplier - 1,
      };
    }),
  resetCashMultiplier: () => set({ cashMultiplier: MIN_MULTIPLIER }),
}));
