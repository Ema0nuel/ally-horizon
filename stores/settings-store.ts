"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

export type NotificationPrefs = {
  transfers: boolean;
  security: boolean;
  account: boolean;
  marketing: boolean;
};

export type PrivacyPrefs = {
  hideBalances: boolean;
  idleTimeoutMinutes: number;
  biometricLock: boolean;
};

type SettingsState = {
  theme: Theme;
  currency: string;
  locale: string;
  notifications: NotificationPrefs;
  privacy: PrivacyPrefs;
  setTheme: (theme: Theme) => void;
  setCurrency: (currency: string) => void;
  setLocale: (locale: string) => void;
  setNotification: (key: keyof NotificationPrefs, value: boolean) => void;
  setPrivacy: <K extends keyof PrivacyPrefs>(key: K, value: PrivacyPrefs[K]) => void;
  reset: () => void;
};

const defaultSettings = {
  theme: "system" as Theme,
  currency: "USD",
  locale: "en-US",
  notifications: {
    transfers: true,
    security: true,
    account: true,
    marketing: false,
  },
  privacy: {
    hideBalances: false,
    idleTimeoutMinutes: 0,
    biometricLock: false,
  },
};

export const settingsStorageKey = "zenus-settings";
export const themeStorageKey = "zenus-theme";

export function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  }
  return theme;
}

/** Applies a theme to the document and mirrors it for the pre-hydration script. */
export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const resolved = resolveTheme(theme);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // ignore storage errors (private mode, etc.)
  }
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },

      setCurrency: (currency) => set({ currency }),

      setLocale: (locale) => set({ locale }),

      setNotification: (key, value) =>
        set((state) => ({
          notifications: { ...state.notifications, [key]: value },
        })),

      setPrivacy: (key, value) =>
        set((state) => ({
          privacy: { ...state.privacy, [key]: value },
        })),

      reset: () => {
        set({ ...defaultSettings });
        applyTheme(defaultSettings.theme);
      },
    }),
    {
      name: settingsStorageKey,
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme);
      },
    }
  )
);
