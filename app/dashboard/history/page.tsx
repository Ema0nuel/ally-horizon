"use client";

import type * as React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { formatDateTime } from "@/lib/format";
import { getBrowserClient } from "@/lib/supabase/browser";
import { useAuthStore } from "@/stores/auth-store";
import { useMoney } from "@/hooks/use-preferences";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import type { Account, Profile, Transaction } from "@/components/dashboard/types";

const creditTypes = ["deposit", "credit", "incoming", "interest", "refund", "topup"];

function isCredit(type: string | null) {
  return creditTypes.includes((type ?? "").toLowerCase());
}

function statusTone(status: string | null): "default" | "secondary" | "destructive" | "outline" {
  switch (status?.toLowerCase()) {
    case "completed":
    case "approved":
      return "default";
    case "declined":
    case "failed":
    case "rejected":
      return "destructive";
    case "pending":
      return "outline";
    default:
      return "secondary";
  }
}

function fullDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function fullTime(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function HistoryPage() {
  const account = useAuthStore((s) => s.account) as Account | null;
  const profile = useAuthStore((s) => s.profile) as Profile | null;
  const { format } = useMoney();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Transaction | null>(null);

  useEffect(() => {
    const accountId = account?.id;
    if (!accountId) return;
    let active = true;
    async function load() {
      const supabase = getBrowserClient();
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("account_id", accountId)
        .order("created_at", { ascending: false })
        .limit(100);
      if (active) {
        setTransactions((data as Transaction[]) ?? []);
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [account?.id]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="History"
        description="Your account statement and full transaction history."
        crumbs={[{ label: "History" }]}
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {loading ? (
          <p className="p-6 text-sm text-muted-foreground">Loading…</p>
        ) : transactions.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 text-right font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => {
                  const credit = isCredit(t.type);
                  return (
                    <tr
                      key={t.id}
                      className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/50"
                      onClick={() => setSelected(t)}
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {formatDateTime(t.created_at)}
                      </td>
                      <td className="px-4 py-3">{t.description || t.type || "Transaction"}</td>
                      <td className="px-4 py-3 capitalize text-muted-foreground">{t.type}</td>
                      <td
                        className={cn(
                          "px-4 py-3 text-right font-mono font-semibold",
                          credit ? "text-[var(--primary-deep)]" : "text-foreground"
                        )}
                      >
                        {credit ? "+" : "−"}
                        {format(t.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusTone(t.status)}>{t.status ?? "Pending"}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Transaction receipt"
            className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between px-6 pt-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/logo.png"
                  alt="Ally"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="h-10 w-auto dark:hidden"
                />
                <Image
                  src="/images/logo.png"
                  alt="Ally"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="hidden h-10 w-auto dark:block"
                />
                <div>
                  <p className="font-heading text-base font-bold text-primary">
                    {siteConfig.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {siteConfig.phone} · {siteConfig.contactEmail}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="px-6 py-5 text-center">
              <h2 className="font-heading text-xl font-medium tracking-wide text-foreground">
                Transaction Receipt
              </h2>
              <p className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">
                Official confirmation of transaction
              </p>
            </div>

            <dl className="divide-y divide-dashed divide-border border-y border-dashed border-border px-6">
              <ReceiptRow label="Reference" value={selected.id} mono />
              <ReceiptRow label="Date" value={fullDate(selected.created_at)} />
              <ReceiptRow label="Time" value={fullTime(selected.created_at)} />
              <ReceiptRow label="Type" value={selected.type ?? "—"} />
              <ReceiptRow
                label="Status"
                value={
                  <Badge variant={statusTone(selected.status)}>
                    {selected.status ?? "Pending"}
                  </Badge>
                }
              />
            </dl>

            <div className="space-y-3 px-6 py-5">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  Description
                </p>
                <p className="mt-1 text-sm text-foreground">
                  {selected.description || "—"}
                </p>
              </div>

              <div className="rounded-xl bg-muted/60 p-4 text-center">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  Amount
                </p>
                <p className="mt-1 font-mono text-3xl font-semibold text-foreground">
                  {format(selected.amount)}
                </p>
              </div>

              <dl className="space-y-2 text-sm">
                <ReceiptRow label="Account holder" value={profile?.full_name ?? "—"} />
                <ReceiptRow
                  label="Account number"
                  value={account?.account_number ?? "—"}
                  mono
                />
                <ReceiptRow
                  label="Balance before"
                  value={format(selected.balance_before)}
                />
                <ReceiptRow
                  label="Balance after"
                  value={format(selected.balance_after)}
                />
              </dl>
            </div>

            <div className="border-t border-dashed border-border px-6 py-4 text-center">
              <p className="text-xs text-muted-foreground">
                Thank you for banking with {siteConfig.name}.
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground/70">
                This is a computer-generated receipt and does not require a signature.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReceiptRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "text-right text-sm text-foreground",
          mono && "break-all font-mono text-xs"
        )}
      >
        {value}
      </dd>
    </div>
  );
}
