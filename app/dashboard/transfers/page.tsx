"use client";

import Link from "next/link";

import { bankConfig } from "@/lib/bank-config";
import { AccountStatCards } from "@/components/dashboard/account-stat-cards";
import { PageHeader } from "@/components/dashboard/page-header";

export default function TransfersPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Transfers"
        description="Choose how you'd like to send money."
        crumbs={[{ label: "Transfers" }]}
      />

      <AccountStatCards />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {bankConfig.transferTypes.map((t, i) => (
          <Link
            key={t.key}
            href={`/dashboard/transfers/${t.key}`}
            style={{ animationDelay: `${i * 60}ms` }}
            className="group flex animate-fade-in-up flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:bg-[var(--lilac)]/50 active:scale-[0.98]"
          >
            <h2 className="font-heading text-lg font-bold text-foreground">{t.label}</h2>
            <p className="text-sm text-muted-foreground">{t.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
