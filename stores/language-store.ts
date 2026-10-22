"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = {
  code: string;
  label: string;
  flag: string;
};

export const LANGUAGES: Language[] = [
  { code: "en", label: "English", flag: "https://flagcdn.com/us.svg" },
  { code: "fr", label: "Français", flag: "https://flagcdn.com/fr.svg" },
  { code: "es", label: "Español", flag: "https://flagcdn.com/es.svg" },
  { code: "de", label: "Deutsch", flag: "https://flagcdn.com/de.svg" },
  { code: "pt", label: "Português", flag: "https://flagcdn.com/pt.svg" },
  { code: "zh-CN", label: "中文", flag: "https://flagcdn.com/cn.svg" },
  { code: "ar", label: "العربية", flag: "https://flagcdn.com/sa.svg" },
];

export const languageStorageKey = "zenus-language";

type LanguageState = {
  language: string;
  setLanguage: (code: string) => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (code) => set({ language: code }),
    }),
    { name: languageStorageKey }
  )
);
