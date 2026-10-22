"use client";

import { useSettingsStore } from "@/stores/settings-store";
import { formatCurrency } from "@/lib/format";

/**
 * Currency + privacy display helpers driven by the user's settings store.
 * Components use this so amounts respect the selected currency and the
 * "hide balances" preference instead of hardcoding USD.
 */
export function useMoney() {
  const currency = useSettingsStore((s) => s.currency);
  const hideBalances = useSettingsStore((s) => s.privacy.hideBalances);

  const format = (value: unknown) => formatCurrency(value, currency);
  const amount = (value: unknown) => (hideBalances ? "••••••" : format(value));

  return { currency, hideBalances, format, amount };
}

export function useLocale() {
  return useSettingsStore((s) => s.locale);
}
