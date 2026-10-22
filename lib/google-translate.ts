"use client";

const SCRIPT_ID = "google-translate-script";
const ELEMENT_ID = "google_translate_element";
const SCRIPT_SRC =
  "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

export const INCLUDED_LANGUAGES = "en,fr,es,de,pt,zh-CN,ar";

type TranslateOptions = {
  pageLanguage: string;
  includedLanguages: string;
  layout: number;
  autoDisplay: boolean;
};

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: (new (
          options: TranslateOptions,
          elementId: string
        ) => void) & { InlineLayout: { SIMPLE: number } };
      };
    };
  }
}

let loaded = false;

/** Injects the Google Translate script and points it at a hidden mount node. */
export function loadGoogleTranslate() {
  if (typeof window === "undefined") return;

  window.googleTranslateElementInit = () => {
    const translate = window.google?.translate;
    if (translate?.TranslateElement) {
      new translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: INCLUDED_LANGUAGES,
          layout: translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        ELEMENT_ID
      );
    }
  };

  if (loaded) return;
  loaded = true;

  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    document.head.appendChild(script);
  }
}

/**
 * Persists the chosen language via the `googtrans` cookie so Google Translate
 * re-applies it on the next full page load.
 */
export function setTranslateCookie(code: string) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? ";Secure" : "";
  const sameSite = ";SameSite=Lax";
  if (code === "en") {
    document.cookie = `googtrans=;path=/${secure}${sameSite};expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  } else {
    document.cookie = `googtrans=/en/${code};path=/${secure}${sameSite};expires=Fri, 31 Dec 9999 23:59:59 GMT`;
  }
}

/**
 * Applies a language change. The reload happens synchronously here — never in
 * a React effect — so it fires exactly once per user action and cannot loop.
 */
export function changeLanguage(code: string) {
  setTranslateCookie(code);
  if (typeof window !== "undefined") {
    window.location.reload();
  }
}
