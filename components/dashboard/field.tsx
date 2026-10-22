"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-xs font-semibold text-muted-foreground"
      >
        {label}
        {required && <span className="ml-0.5 text-[var(--primary-deep)]">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      {error && <p className="text-[11px] text-[var(--primary-deep)]">{error}</p>}
    </div>
  );
}

const textareaStyles =
  "w-full min-w-0 rounded-[0.75rem] border border-[var(--border)] bg-transparent px-2.5 py-2 text-base text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-[var(--primary)] focus-visible:ring-3 focus-visible:ring-[var(--primary)]/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[var(--muted)]/50 disabled:opacity-50 aria-invalid:border-[var(--primary-deep)] aria-invalid:ring-3 aria-invalid:ring-[var(--primary-deep)]/20 md:text-sm dark:bg-[var(--muted)]/30";

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea data-slot="textarea" className={cn(textareaStyles, className)} {...props} />
  );
}
