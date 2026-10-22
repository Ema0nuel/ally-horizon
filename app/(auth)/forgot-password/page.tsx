"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { CaptchaWidget } from "@/components/auth/captcha-widget";
import { inputClass } from "@/components/auth/password-input";
import { forgotPassword } from "@/lib/auth";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground";

const submitBtnClass =
  "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-8 text-sm font-semibold text-[var(--accent-foreground)] transition-all hover:bg-[var(--accent)]/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const COOLDOWN_SECONDS = 60;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function startCooldown(seconds: number) {
    setCooldown(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!isValidEmail || cooldown > 0) return;

    if (!captchaToken) {
      setError("Please complete the captcha challenge.");
      return;
    }

    startCooldown(COOLDOWN_SECONDS);
    setLoading(true);
    try {
      await forgotPassword(email.trim(), captchaToken);
      setInfo("Password reset instructions sent to your email.");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      const isRateLimited =
        /too many requests/i.test(message) || message.includes("429");
      setError(
        isRateLimited
          ? "Too many requests. Please wait a minute and try again."
          : message || "Failed to send reset instructions."
      );
      startCooldown(isRateLimited ? COOLDOWN_SECONDS : 10);
    } finally {
      setCaptchaToken(null);
      setCaptchaKey((k) => k + 1);
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Forgot password"
      subtitle="We'll email you a secure link to reset it."
      footer={
        <p className="text-center font-sans text-sm font-semibold text-muted-foreground">
          Remembered it?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error ? (
          <p className="rounded-xl border border-[var(--primary-deep)]/30 bg-[var(--primary-deep)]/10 px-4 py-3 font-sans text-sm font-semibold text-[var(--primary-deep)]">
            {error}
          </p>
        ) : null}
        {info ? (
          <p className="rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-3 font-sans text-sm font-semibold text-[var(--primary-deep)]">
            {info}
          </p>
        ) : null}

        <div className="rounded-xl border border-border bg-muted/50 px-4 py-3 font-sans text-xs font-semibold leading-relaxed text-muted-foreground">
          You can request a password reset a maximum of 2 times within an hour.
          Please use it wisely.
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email address
          </label>
          <input
            id="email"
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <CaptchaWidget key={`cap-${captchaKey}`} onToken={setCaptchaToken} />

        <button
          type="submit"
          disabled={!isValidEmail || cooldown > 0}
          className={submitBtnClass}
        >
          {cooldown > 0
            ? `Please wait ${cooldown}s`
            : loading
              ? "Sending..."
              : "Send instructions"}
        </button>
      </form>
    </AuthShell>
  );
}
