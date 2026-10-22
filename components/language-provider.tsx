"use client";

import { useEffect } from "react";

import { loadGoogleTranslate } from "@/lib/google-translate";

/**
 * Loads the Google Translate widget into a hidden mount node. Language changes
 * are applied from the language selector's click handler (not here), so this
 * never triggers navigation. The visible Google Translate branding is stripped
 * via CSS.
 */
export function LanguageProvider() {
  useEffect(() => {
    loadGoogleTranslate();
  }, []);

  return <div id="google_translate_element" aria-hidden="true" />;
}
