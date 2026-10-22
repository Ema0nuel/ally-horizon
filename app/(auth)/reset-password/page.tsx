"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordInput } from "@/components/auth/password-input";
import { resetPassword } from "@/lib/auth";
import { getBrowserClient } from "@/lib/supabase/browser";

const submitBtnClass =
  "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-8 text-sm font-semibold text-[var(--accent-foreground)] transition-all hover:bg-[var(--accent)]/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

type Status = "checking" | "ready" | "invalid";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    let active = true;
    getBrowserClient()
      .auth.getSession()
      .then(({ data }) => {
        if (!active) return;
        setStatus(data.session ? "ready" : "invalid");
      })
      .catch(() => {
        if (active) setStatus("invalid");
      });
    return () => {
      active = false;
    };
  }, []);

  const valid = password.length >= 8 && password === confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(password);
      setInfo("Password reset successful!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password.");
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Reset password"
      subtitle="Choose a new password for your account."
      footer={
        <p className="text-center font-sans text-sm font-semibold text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </p>
      }
    >
      {status === "checking" ? (
        <p className="text-center font-sans text-sm font-semibold text-muted-foreground">
          Verifying your reset link…
        </p>
      ) : status === "invalid" ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card px-6 py-10 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-[var(--lilac)] text-[var(--primary-deep)]">
            <KeyRound className="size-6" strokeWidth={1.5} />
          </span>
          <p className="max-w-sm font-sans text-sm font-semibold leading-relaxed text-muted-foreground">
            This reset link is invalid or has expired. Request a new one to
            continue.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white transition-all hover:bg-[var(--primary-deep)]"
          >
            Request a new link
          </Link>
        </div>
      ) : (
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

          <PasswordInput
            id="new-password"
            label="New password"
            value={password}
            onChange={setPassword}
            showStrength
            autoComplete="new-password"
          />

          <PasswordInput
            id="confirm-password"
            label="Confirm password"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
          />

          <button type="submit" disabled={!valid || loading} className={submitBtnClass}>
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
