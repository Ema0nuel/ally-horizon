"use client";

import { useEffect, useRef } from "react";

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        }
      ) => string;
      reset: (widgetId: string) => void;
    };
    turnstileReady?: boolean;
    turnstileQueue?: Array<() => void>;
  }
}

type CaptchaWidgetProps = {
  onToken: (token: string | null) => void;
};

// Cloudflare Turnstile challenge. Tokens are single use and short lived;
// the server verifies them before any auth action runs.
export function CaptchaWidget({ onToken }: CaptchaWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    let cancelled = false;

    function renderWidget() {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      if (widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => onTokenRef.current(token),
        "expired-callback": () => onTokenRef.current(null),
        "error-callback": () => onTokenRef.current(null),
      });
    }

    if (window.turnstile) {
      renderWidget();
    } else {
      window.turnstileQueue = window.turnstileQueue ?? [];
      if (!window.turnstileReady) {
        window.turnstileReady = true;
        window.turnstileQueue.push(renderWidget);
        const script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.async = true;
        script.onload = () => {
          window.turnstileQueue?.forEach((fn) => fn());
          window.turnstileQueue = [];
        };
        document.head.appendChild(script);
      } else {
        window.turnstileQueue.push(renderWidget);
      }
    }

    return () => {
      cancelled = true;
    };
  }, [siteKey]);

  if (!siteKey) {
    return (
      <p className="rounded-xl border border-[var(--primary-deep)]/30 bg-[var(--primary-deep)]/10 px-4 py-3 font-sans text-sm font-semibold text-[var(--primary-deep)]">
        Captcha is not configured. Contact support.
      </p>
    );
  }

  return <div ref={containerRef} className="flex justify-center" />;
}
