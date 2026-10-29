"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { CaptchaWidget } from "@/components/auth/captcha-widget";
import { PasswordInput, inputClass } from "@/components/auth/password-input";
import { loginAndSendOtp, resendOtp, verifyOtp } from "@/lib/auth";
import { useAuthStore } from "@/stores/auth-store";

const LAST_ACCESS_KEY = "lastAccessID";
const OTP_EXPIRES_KEY = "otpExpiresAt";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground";

const submitBtnClass =
  "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-8 text-sm font-semibold text-[var(--accent-foreground)] transition-all hover:bg-[var(--accent)]/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const emptySubscribe = () => () => {};

function readResumedAccessId(): string {
  if (typeof window === "undefined") return "";
  const saved = sessionStorage.getItem(LAST_ACCESS_KEY);
  const expires = sessionStorage.getItem(OTP_EXPIRES_KEY);
  if (saved && expires && new Date(expires) > new Date()) return saved;
  return "";
}

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);

  const resumedAccessId = useSyncExternalStore(
    emptySubscribe,
    readResumedAccessId,
    () => ""
  );

  const [manualStep, setManualStep] = useState<"credentials" | "otp" | null>(null);
  const [manualAccessId, setManualAccessId] = useState<string | null>(null);

  const [accessID, setAccessID] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);

  function resetCaptcha() {
    setCaptchaToken(null);
    setCaptchaKey((k) => k + 1);
  }

  const step = manualStep ?? (resumedAccessId ? "otp" : "credentials");
  const lastAccessID = manualAccessId ?? resumedAccessId;

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  function clearResume() {
    sessionStorage.removeItem(LAST_ACCESS_KEY);
    sessionStorage.removeItem(OTP_EXPIRES_KEY);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (step === "credentials") {
      if (!accessID.trim() || !password) {
        setError("Please enter your Access ID and password.");
        return;
      }
      if (!captchaToken) {
        setError("Please complete the captcha challenge.");
        return;
      }
      setLoading(true);
      try {
        await loginAndSendOtp(accessID.trim(), password, captchaToken);
        sessionStorage.setItem(LAST_ACCESS_KEY, accessID.trim());
        sessionStorage.setItem(
          OTP_EXPIRES_KEY,
          new Date(Date.now() + 10 * 60 * 1000).toISOString()
        );
        setManualAccessId(accessID.trim());
        setManualStep("otp");
        setInfo("OTP sent to your email.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Login failed.");
      } finally {
        resetCaptcha();
        setLoading(false);
      }
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }
    setLoading(true);
    try {
      const user = await verifyOtp(lastAccessID, otp, password);
      clearResume();
      await setAuthenticated(user);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!lastAccessID) {
      setError("Please enter your Access ID and password first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await resendOtp(lastAccessID);
      setInfo("OTP resent to your email.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title={step === "credentials" ? "Log in" : "Enter verification code"}
      subtitle={
        step === "credentials"
          ? "Access your account securely."
          : "Enter the 6-digit code sent to your email."
      }
      footer={
        <p className="text-center font-sans text-sm font-semibold text-muted-foreground">
          New to Ally?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Create an account
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

        {step === "credentials" ? (
          <>
            <div>
              <label htmlFor="accessID" className={labelClass}>
                Access ID
              </label>
              <input
                id="accessID"
                className={inputClass}
                type="text"
                value={accessID}
                onChange={(e) => {
                  const value = e.target.value;
                  setAccessID(value.includes("@") ? value.toLowerCase() : value);
                }}
                placeholder="Email, username, or account number"
                autoComplete="username"
              />
            </div>

            <PasswordInput
              id="password"
              label="Password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />

            <CaptchaWidget key={`cap-${captchaKey}`} onToken={setCaptchaToken} />

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                New user?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Register
                </Link>
              </span>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className={submitBtnClass}>
              {loading ? "Sending code..." : "Log in"}
            </button>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="otp" className={labelClass}>
                One-time code
              </label>
              <input
                id="otp"
                className={inputClass}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit code"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="text-xs font-semibold text-primary hover:underline disabled:opacity-50"
              >
                Resend code
              </button>
              <button
                type="button"
                onClick={() => {
                  clearResume();
                  setManualStep("credentials");
                  setManualAccessId("");
                  resetCaptcha();
                }}
                className="text-xs font-semibold text-muted-foreground hover:underline"
              >
                Back to login
              </button>
            </div>

            <button type="submit" disabled={loading} className={submitBtnClass}>
              {loading ? "Verifying..." : "Verify & log in"}
            </button>
          </>
        )}
      </form>
    </AuthShell>
  );
}
