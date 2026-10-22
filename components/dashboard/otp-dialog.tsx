"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function OtpDialog({
  open,
  title = "Enter verification code",
  description = "Enter the 6-digit code sent to your email to confirm this action.",
  loading,
  error,
  onVerify,
  onClose,
}: {
  open: boolean;
  title?: string;
  description?: string;
  loading?: boolean;
  error?: string;
  onVerify: (code: string) => void;
  onClose: () => void;
}) {
  const [code, setCode] = useState("");

  function handleClose() {
    setCode("");
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-sm rounded-2xl border border-border bg-[var(--card)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={handleClose} aria-label="Close">
            <X className="size-4" />
          </Button>
        </div>

        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="000000"
          className="mt-5 w-full rounded-[0.75rem] border border-[var(--border)] bg-transparent px-3 py-3 text-center font-mono text-2xl tracking-[0.5em] text-foreground outline-none focus-visible:border-[var(--primary)] focus-visible:ring-3 focus-visible:ring-[var(--primary)]/50"
        />

        {error && <p className="mt-2 text-xs text-[var(--primary-deep)]">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={() => onVerify(code)}
            disabled={loading || code.length !== 6}
            className={cn(loading && "opacity-70")}
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
}
