"use client";

import type * as React from "react";
import { Briefcase, RefreshCw, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { maskAccountNumber } from "@/lib/format";
import { useMoney } from "@/hooks/use-preferences";
import { useBalanceStore } from "@/stores/balance-store";
import { useAuthStore } from "@/stores/auth-store";
import type { Account } from "./types";

type Stat = {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "balance" | "status" | "type";
};

const toneStyles: Record<Stat["tone"], string> = {
  balance: "bg-[var(--accent)]/15 text-[var(--primary-deep)]",
  status: "bg-[var(--lilac)] text-[var(--primary-deep)]",
  type: "bg-[var(--lilac)] text-[var(--primary-deep)]",
};

export function AccountStatCards() {
  const account = useAuthStore((s) => s.account) as Account | null;
  const { amount } = useMoney();
  const balanceHidden = useBalanceStore((s) => s.balanceHidden);

  const stats: Stat[] = [
    {
      label: "Available balance",
      value: balanceHidden ? "••••••" : amount(account?.balance),
      icon: Briefcase,
      tone: "balance",
    },
    {
      label: "Account status",
      value: account?.is_active ? "Active" : "Inactive",
      icon: RefreshCw,
      tone: "status",
    },
    {
      label: "Account type",
      value: account?.account_type || "USD SAVING",
      icon: Star,
      tone: "type",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map((s, i) => (
        <div
          key={s.label}
          style={{ animationDelay: `${i * 60}ms` }}
          className="flex animate-fade-in-up items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-transform duration-200 ease-out hover:-translate-y-0.5"
        >
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full",
              toneStyles[s.tone]
            )}
          >
            <s.icon className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {s.label}
            </p>
            <p className="truncate font-mono text-sm font-semibold text-foreground">
              {s.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AccountNumberChip() {
  const account = useAuthStore((s) => s.account) as Account | null;
  return (
    <p className="font-mono text-xs text-muted-foreground">
      {maskAccountNumber(account?.account_number)}
    </p>
  );
}
