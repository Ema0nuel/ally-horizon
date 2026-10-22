"use client";

import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { maskAccountNumber } from "@/lib/format";
import { useMoney } from "@/hooks/use-preferences";
import { useBalanceStore } from "@/stores/balance-store";
import type { Account, Profile } from "./types";

export function BalanceCard({
  account,
  profile,
}: {
  account: Account | null;
  profile: Profile | null;
}) {
  const accountType = account?.account_type ?? "USD Saving";
  const isActive = account?.is_active === true;
  const { format, hideBalances } = useMoney();
  const balanceHidden = useBalanceStore((s) => s.balanceHidden);
  const toggleBalance = useBalanceStore((s) => s.toggleBalance);

  const hidden = balanceHidden || hideBalances;
  const balanceText = hidden ? "••••••" : format(account?.balance);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary-deep)] to-[var(--primary)] p-6 text-white shadow-xl ring-1 ring-white/10">
      <div
        className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-[var(--accent)]/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-10 size-64 rounded-full bg-[var(--accent)]/10 blur-3xl"
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
            Available balance
          </p>
          <p className="mt-2 font-heading text-4xl font-bold tracking-tight text-white">
            {balanceText}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="shrink-0 rounded-4xl border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
            {accountType}
          </span>
          <button
            type="button"
            onClick={toggleBalance}
            aria-label={balanceHidden ? "Show balance" : "Hide balance"}
            title={balanceHidden ? "Show balance" : "Hide balance"}
            className="flex size-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          >
            {balanceHidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <div className="relative mt-8 flex items-center justify-between">
        <div className="flex h-9 w-12 items-center justify-center rounded-md bg-gradient-to-br from-[var(--accent)] to-[var(--accent)]/70">
          <div className="grid h-5 w-7 grid-cols-3 gap-px">
            <span className="rounded-[2px] bg-[var(--primary-deep)]/70" />
            <span className="rounded-[2px] bg-[var(--primary-deep)]/70" />
            <span className="rounded-[2px] bg-[var(--primary-deep)]/70" />
            <span className="rounded-[2px] bg-[var(--primary-deep)]/70" />
            <span className="rounded-[2px] bg-[var(--primary-deep)]/70" />
            <span className="rounded-[2px] bg-[var(--primary-deep)]/70" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "size-2 rounded-full",
              isActive ? "bg-[var(--accent)]" : "bg-white/40"
            )}
          />
          <span className="text-xs font-semibold text-white/70">
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="relative mt-8 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
            Account number
          </p>
          <p className="mt-1 font-mono text-sm text-white/90">
            {maskAccountNumber(account?.account_number)}
          </p>
        </div>
        <div className="min-w-0 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
            Account holder
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-white/90">
            {profile?.full_name ?? "Account holder"}
          </p>
        </div>
      </div>

      <div className="relative mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
        <span className="text-white/50">Interest rate</span>
        <span className="font-semibold text-[var(--accent)]">
          {account?.interest_rate != null
            ? `${account.interest_rate}% APY`
            : "—"}
        </span>
      </div>
    </div>
  );
}
