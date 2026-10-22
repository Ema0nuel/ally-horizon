"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const balanceStorageKey = "zenus-balance-visibility";

type BalanceState = {
  balanceHidden: boolean;
  toggleBalance: () => void;
  setBalanceHidden: (hidden: boolean) => void;
};

export const useBalanceStore = create<BalanceState>()(
  persist(
    (set) => ({
      balanceHidden: false,
      toggleBalance: () =>
        set((state) => ({ balanceHidden: !state.balanceHidden })),
      setBalanceHidden: (hidden) => set({ balanceHidden: hidden }),
    }),
    { name: balanceStorageKey }
  )
);
