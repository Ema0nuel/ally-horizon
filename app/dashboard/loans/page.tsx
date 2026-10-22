"use client";

import type * as React from "react";
import { useEffect, useState } from "react";

import { bankConfig } from "@/lib/bank-config";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { createNotification } from "@/lib/notifications";
import { sendEmail } from "@/lib/emails";
import { getBrowserClient } from "@/lib/supabase/browser";
import { useAuthStore } from "@/stores/auth-store";
import { useMoney } from "@/hooks/use-preferences";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/dashboard/field";
import { SelectField } from "@/components/dashboard/select-field";
import { PageHeader } from "@/components/dashboard/page-header";
import type { Account, Loan, Profile } from "@/components/dashboard/types";

function statusTone(status: string | null): "default" | "secondary" | "destructive" | "outline" {
  switch (status?.toLowerCase()) {
    case "approved":
      return "default";
    case "rejected":
      return "destructive";
    case "pending":
      return "outline";
    default:
      return "secondary";
  }
}

export default function LoansPage() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile) as Profile | null;
  const account = useAuthStore((s) => s.account) as Account | null;
  const { format } = useMoney();

  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState(bankConfig.loan.durations[0]?.value ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;
    let active = true;
    async function load() {
      const supabase = getBrowserClient();
      const { data } = await supabase
        .from("loan")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (active) {
        setLoans((data as Loan[]) ?? []);
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [user?.id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id || !account?.id) return;
    setError("");

    const value = Number.parseFloat(amount);
    if (Number.isNaN(value) || value < bankConfig.limits.minLoan) {
      setError(`Minimum loan amount is ${formatCurrency(bankConfig.limits.minLoan)}.`);
      return;
    }
    if (!reason.trim()) {
      setError("Please provide a reason for the loan.");
      return;
    }

    setSubmitting(true);
    const supabase = getBrowserClient();
    const interest = (
      bankConfig.loan.interest.min +
      Math.random() * (bankConfig.loan.interest.max - bankConfig.loan.interest.min)
    ).toFixed(2);

    const due = new Date();
    due.setMonth(due.getMonth() + Number.parseInt(duration, 10));

    const { error: insertError } = await supabase.from("loan").insert({
      user_id: user.id,
      account_id: account.id,
      amount: value,
      interest_rate: Number.parseFloat(interest),
      status: "pending",
      due_date: due.toISOString().slice(0, 10),
      repaid_amount: 0,
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    await createNotification({
      userId: user.id,
      title: "Loan request submitted",
      message: `Your loan request of ${formatCurrency(value)} is pending approval.`,
      type: "info",
    });

    if (profile?.email) {
      await sendEmail({
        to: profile.email,
        subject: "Loan request received",
        html: `<p>Hi ${profile.full_name ?? "there"},</p><p>Your loan request of <b>${formatCurrency(value)}</b> has been received and is pending approval.</p>`,
      });
    }

    setSubmitting(false);
    setAmount("");
    setReason("");
    const { data } = await supabase
      .from("loan")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setLoans((data as Loan[]) ?? []);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Loans"
        description="Apply for a loan and track the status of your requests."
        crumbs={[{ label: "Loans" }]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-border bg-card p-5"
        >
          <h2 className="font-heading text-lg font-medium text-foreground">Request a loan</h2>

          <Field
            label="Loan amount"
            htmlFor="loan-amount"
            required
            hint={`Minimum ${formatCurrency(bankConfig.limits.minLoan)}`}
          >
            <Input
              id="loan-amount"
              type="number"
              min={bankConfig.limits.minLoan}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </Field>

          <Field label="Purpose / reason" htmlFor="loan-reason" required>
            <Input
              id="loan-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Home renovation"
            />
          </Field>

          <SelectField
            label="Duration"
            id="loan-duration"
            value={duration}
            onChange={setDuration}
            options={bankConfig.loan.durations}
            required
          />

          {error && <p className="text-xs text-[var(--primary-deep)]">{error}</p>}

          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting…" : "Request loan"}
          </Button>
        </form>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-heading text-lg font-medium text-foreground">Your loans</h2>
          {loading ? (
            <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
          ) : loans.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No loan requests yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {loans.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-semibold text-foreground">
                      {format(l.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {l.interest_rate != null ? `${l.interest_rate}% interest` : ""}
                      {l.due_date ? ` · due ${formatDateTime(l.due_date)}` : ""}
                    </p>
                  </div>
                  <Badge variant={statusTone(l.status)}>{l.status ?? "pending"}</Badge>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
