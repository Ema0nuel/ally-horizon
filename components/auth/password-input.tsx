"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

const inputClass =
  "h-11 w-full rounded-[0.75rem] border border-[var(--border)] bg-transparent px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40 disabled:cursor-not-allowed disabled:opacity-50";

function checkStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "Weak", color: "bg-[var(--border)]" };
  if (score === 3) return { score, label: "Medium", color: "bg-[var(--lilac)]" };
  return { score, label: "Strong", color: "bg-[var(--accent)]" };
}

export function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder = "********",
  showStrength = false,
  autoComplete = "current-password",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showStrength?: boolean;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);
  const strength = checkStrength(value);

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={16}
          className={cn(inputClass, "pr-12")}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {showStrength && value ? (
        <div className="mt-2">
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all duration-500", strength.color)}
              style={{ width: `${strength.score * 25}%` }}
            />
          </div>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">{strength.label}</p>
        </div>
      ) : null}
    </div>
  );
}

export { inputClass, checkStrength };
