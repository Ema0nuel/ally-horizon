"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordInput, inputClass } from "@/components/auth/password-input";
import { useAdminAuthStore } from "@/stores/admin-auth-store";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground";

const submitBtnClass =
  "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-8 text-sm font-semibold text-[var(--accent-foreground)] transition-all hover:bg-[var(--accent)]/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useAdminAuthStore((s) => s.login);
  const isLoading = useAdminAuthStore((s) => s.isLoading);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password);
    if (success) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Invalid credentials. Please check your email and password.");
    }
  };

  return (
    <AuthShell
      title="Admin Access"
      subtitle="Sign in to manage the platform"
      footer={
        <p className="text-center font-sans text-sm font-semibold text-muted-foreground">
          Ally Administration
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error ? (
          <p className="rounded-xl border border-[var(--primary-deep)]/30 bg-[var(--primary-deep)]/10 px-4 py-3 font-sans text-sm font-semibold text-[var(--primary-deep)]">
            {error}
          </p>
        ) : null}

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            className={inputClass}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="support@allyhorizon.cc"
            autoComplete="email"
            required
          />
        </div>

        <PasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Enter password"
          autoComplete="current-password"
        />

        <button type="submit" disabled={isLoading} className={submitBtnClass}>
          {isLoading ? "Signing in..." : "Sign in to Admin"}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          Access restricted to authorized personnel only.
        </p>
      </form>
    </AuthShell>
  );
}
