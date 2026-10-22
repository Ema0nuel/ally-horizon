"use client";

import type * as React from "react";
import { useState } from "react";
import { Banknote, Bitcoin, CheckCircle2, ExternalLink } from "lucide-react";

import { bankConfig } from "@/lib/bank-config";
import { formatCurrency } from "@/lib/format";
import { createNotification } from "@/lib/notifications";
import { sendEmail } from "@/lib/emails";
import { getBrowserClient } from "@/lib/supabase/browser";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccountStatCards } from "@/components/dashboard/account-stat-cards";
import { Field, Textarea } from "@/components/dashboard/field";
import { CryptoDepositModal } from "@/components/dashboard/crypto-deposit-modal";
import { PageHeader } from "@/components/dashboard/page-header";
import type { Account, Profile } from "@/components/dashboard/types";

type Step = "choose" | "regular" | "crypto";

export default function DepositPage() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile) as Profile | null;
  const account = useAuthStore((s) => s.account) as Account | null;

  const [step, setStep] = useState<Step>("choose");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [cryptoOpen, setCryptoOpen] = useState(false);

  function reset() {
    setStep("choose");
    setAmount("");
    setDescription("");
    setDone(false);
    setError("");
  }

  function validate(minimum: number): number | null {
    setError("");
    const value = Number.parseFloat(amount);
    if (Number.isNaN(value) || value < minimum) {
      setError(`Minimum deposit is ${formatCurrency(minimum)}.`);
      return null;
    }
    return value;
  }

  async function recordPending(
    value: number,
    extra: { type: string; method: string; description: string; [k: string]: unknown }
  ) {
    const supabase = getBrowserClient();
    const balance = account?.balance ?? 0;
    const { error: txError } = await supabase.from("transactions").insert({
      account_id: account?.id,
      user_id: user?.id,
      amount: value,
      balance_before: balance,
      balance_after: balance,
      status: "pending",
      ...extra,
    });
    if (txError) throw new Error(txError.message);
  }

  async function submitRegular(e: React.FormEvent) {
    e.preventDefault();
    const value = validate(bankConfig.limits.minDeposit);
    if (!value || !user?.id || !account?.id) return;

    setSubmitting(true);
    try {
      await recordPending(value, {
        type: "deposit",
        method: "bank",
        description: description.trim() || "Deposit request",
      });

      await createNotification({
        userId: user.id,
        title: "Deposit request recorded",
        message: `Your deposit request of ${formatCurrency(value)} is pending processing.`,
        type: "info",
      });

      if (profile?.email) {
        await sendEmail({
          to: profile.email,
          subject: "Deposit request received",
          html: `<p>Hi ${profile.full_name ?? "there"},</p><p>Your deposit request of <b>${formatCurrency(value)}</b> has been received and is pending processing.</p>`,
        });
      }

      if (bankConfig.paymentLink) {
        window.open(bankConfig.paymentLink, "_blank", "noopener,noreferrer");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  function openCrypto(e: React.FormEvent) {
    e.preventDefault();
    const value = validate(bankConfig.limits.minCryptoDeposit);
    if (!value) return;
    setCryptoOpen(true);
  }

  async function completeCrypto(symbol: string, network: string, address: string) {
    const value = Number.parseFloat(amount);
    if (!user?.id || !account?.id || !address) return;

    setSubmitting(true);
    try {
      await recordPending(value, {
        type: "crypto",
        method: "crypto",
        description: description.trim()
          ? `Crypto deposit (${symbol} · ${network}) — ${description.trim()}`
          : `Crypto deposit (${symbol} · ${network})`,
        direction: "crypto-to-fiat",
        crypto_symbol: symbol,
        wallet_address: address,
      });

      await createNotification({
        userId: user.id,
        title: "Crypto deposit submitted",
        message: `Your ${symbol} deposit of ${formatCurrency(value)} is pending confirmation.`,
        type: "info",
      });

      setCryptoOpen(false);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="space-y-8">
        <PageHeader title="Deposit" crumbs={[{ label: "Deposit" }]} />
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-14 text-center">
          <CheckCircle2 className="size-10 text-[var(--primary-deep)]" />
          <h2 className="font-heading text-xl font-bold text-foreground">
            Deposit request recorded
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Your request has been received and is pending processing. You will be notified
            once it completes.
          </p>
          <div className="flex gap-2">
            {bankConfig.paymentLink && (
              <a href={bankConfig.paymentLink} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <ExternalLink className="size-4" />
                  Open deposit portal
                </Button>
              </a>
            )}
            <Button onClick={reset}>Make another deposit</Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "choose") {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Deposit"
          description="Choose how you'd like to fund your account."
          crumbs={[{ label: "Deposit" }]}
        />

        <AccountStatCards />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setStep("crypto")}
            style={{ animationDelay: "0ms" }}
            className="flex animate-fade-in-up flex-col gap-3 rounded-2xl border border-border bg-card p-6 text-left transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:bg-[var(--lilac)]/50 active:scale-[0.98]"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-[var(--lilac)] text-[var(--primary-deep)]">
              <Bitcoin className="size-6" />
            </span>
            <h2 className="font-heading text-lg font-bold text-foreground">
              Crypto deposit
            </h2>
            <p className="text-sm text-muted-foreground">
              Fund your account with Bitcoin, Ethereum, and more.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setStep("regular")}
            style={{ animationDelay: "60ms" }}
            className="flex animate-fade-in-up flex-col gap-3 rounded-2xl border border-border bg-card p-6 text-left transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:bg-[var(--lilac)]/50 active:scale-[0.98]"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-[var(--lilac)] text-[var(--primary-deep)]">
              <Banknote className="size-6" />
            </span>
            <h2 className="font-heading text-lg font-bold text-foreground">
              Regular deposit
            </h2>
            <p className="text-sm text-muted-foreground">
              Fund your account via bank transfer or card.
            </p>
          </button>
        </div>
      </div>
    );
  }

  const minimum =
    step === "crypto" ? bankConfig.limits.minCryptoDeposit : bankConfig.limits.minDeposit;

  return (
    <div className="space-y-8">
      <PageHeader
        title={step === "crypto" ? "Crypto deposit" : "Regular deposit"}
        description="Enter the amount and a description to continue."
        crumbs={[{ label: "Deposit" }, { label: step === "crypto" ? "Crypto" : "Regular" }]}
      />

      <AccountStatCards />

      <form
        onSubmit={step === "crypto" ? openCrypto : submitRegular}
        className="max-w-xl space-y-4 rounded-2xl border border-border bg-card p-5"
      >
        <Field
          label="Amount"
          htmlFor="deposit-amount"
          required
          hint={`Minimum ${formatCurrency(minimum)}`}
        >
          <Input
            id="deposit-amount"
            type="number"
            min={minimum}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
        </Field>

        <Field label="Description" htmlFor="deposit-desc">
          <Textarea
            id="deposit-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Monthly savings"
          />
        </Field>

        {error && <p className="text-xs text-[var(--primary-deep)]">{error}</p>}

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting…" : "Continue"}
          </Button>
          <Button type="button" variant="outline" onClick={reset} disabled={submitting}>
            Back
          </Button>
        </div>
      </form>

      <CryptoDepositModal
        open={cryptoOpen}
        amount={Number.parseFloat(amount) || 0}
        description={description.trim()}
        submitting={submitting}
        onComplete={completeCrypto}
        onCancel={() => setCryptoOpen(false)}
      />
    </div>
  );
}
