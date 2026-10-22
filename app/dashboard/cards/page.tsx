"use client";

import type * as React from "react";
import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { bankConfig } from "@/lib/bank-config";
import { formatDateTime } from "@/lib/format";
import { copyText } from "@/lib/clipboard";
import { getCardStatusLabel, getCardStatusTone } from "@/lib/card-status";
import { createNotification } from "@/lib/notifications";
import { sendEmail } from "@/lib/emails";
import { getBrowserClient } from "@/lib/supabase/browser";
import { useAuthStore } from "@/stores/auth-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/dashboard/field";
import { SelectField } from "@/components/dashboard/select-field";
import { PageHeader } from "@/components/dashboard/page-header";
import type { Account, Card, Profile } from "@/components/dashboard/types";

function generateCardNumber() {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join("");
}

function generateCvv() {
  return String(Math.floor(100 + Math.random() * 900));
}

function generateExpiryDate() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + bankConfig.cardExpiryYears);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-01`;
}

function formatExpiry(value: string | null) {
  if (!value) return "—";
  const [y, m] = value.split("-");
  return `${m}/${(y ?? "").slice(2)}`;
}

function groupNumber(value: string | null) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function isActiveCard(status: string | null) {
  return status === "approved" || status === "issued";
}

export default function CardsPage() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile) as Profile | null;
  const account = useAuthStore((s) => s.account) as Account | null;

  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [cardType, setCardType] = useState(bankConfig.cardTypes[0]?.value ?? "");
  const [holder, setHolder] = useState(profile?.full_name ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;
    let active = true;
    async function load() {
      const supabase = getBrowserClient();
      const { data } = await supabase
        .from("cards")
        .select("*")
        .eq("user_id", userId)
        .order("issued_at", { ascending: false });
      if (active) {
        setCards((data as Card[]) ?? []);
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [user?.id]);

  async function reload() {
    if (!user?.id) return;
    const supabase = getBrowserClient();
    const { data } = await supabase
      .from("cards")
      .select("*")
      .eq("user_id", user.id)
      .order("issued_at", { ascending: false });
    setCards((data as Card[]) ?? []);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id || !account?.id) return;
    setError("");
    setSubmitting(true);

    const supabase = getBrowserClient();
    const typeLabel =
      bankConfig.cardTypes.find((c) => c.value === cardType)?.label ?? cardType;

    const { error: insertError } = await supabase.from("cards").insert({
      user_id: user.id,
      account_id: account.id,
      card_type: cardType,
      card_number: generateCardNumber(),
      cvv: generateCvv(),
      expiry_date: generateExpiryDate(),
      status: "pending",
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    await createNotification({
      userId: user.id,
      title: "Card request submitted",
      message: `Your ${typeLabel} request is pending approval.`,
      type: "info",
    });

    if (profile?.email) {
      await sendEmail({
        to: profile.email,
        subject: "Card request received",
        html: `<p>Hi ${profile.full_name ?? "there"},</p><p>Your ${typeLabel} request has been received and is pending approval.</p>`,
      });
    }

    setSubmitting(false);
    setHolder(profile?.full_name ?? "");
    await reload();
  }

  const activeCards = cards.filter((c) => isActiveCard(c.status));
  const inactiveCards = cards.filter((c) => !isActiveCard(c.status));
  const billingAddress = [profile?.address, profile?.city, profile?.state, profile?.zip]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Cards"
        description="Request a new card and manage your existing cards."
        crumbs={[{ label: "Cards" }]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-border bg-card p-5"
        >
          <h2 className="font-heading text-lg font-medium text-foreground">Request a card</h2>
          <SelectField
            label="Card type"
            id="card-type"
            value={cardType}
            onChange={setCardType}
            options={bankConfig.cardTypes}
            required
          />

          <Field label="Card holder" htmlFor="card-holder" required>
            <Input
              id="card-holder"
              value={holder}
              onChange={(e) => setHolder(e.target.value)}
              placeholder="Name on card"
            />
          </Field>

          {error && <p className="text-xs text-[var(--primary-deep)]">{error}</p>}

          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit request"}
          </Button>
        </form>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-heading text-lg font-medium text-foreground">Your cards</h2>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : cards.length === 0 ? (
            <p className="text-sm text-muted-foreground">No cards requested yet.</p>
          ) : (
            <div className="space-y-5">
              {activeCards.map((c) => (
                <BankCard
                  key={c.id}
                  card={c}
                  holder={profile?.full_name ?? ""}
                  address={billingAddress}
                  currency={bankConfig.baseCurrency}
                  issuedAt={c.issued_at}
                />
              ))}

              {inactiveCards.length > 0 && (
                <ul className="divide-y divide-border">
                  {inactiveCards.map((c) => (
                    <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold capitalize text-foreground">
                          {c.card_type ?? "Card"}
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">
                          •••• •••• •••• ••••
                        </p>
                        {c.issued_at && (
                          <p className="text-[11px] text-muted-foreground">
                            {formatDateTime(c.issued_at)}
                          </p>
                        )}
                      </div>
                      <Badge variant={getCardStatusTone(c.status)}>
                        {getCardStatusLabel(c.status)}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function BankCard({
  card,
  holder,
  address,
  currency,
  issuedAt,
}: {
  card: Card;
  holder: string;
  address: string;
  currency: string;
  issuedAt: string | null;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const typeLabel = card.card_type === "visa" ? "VISA" : "Mastercard";

  async function copy(field: string, value: string | null) {
    if (!value) return;
    const ok = await copyText(value);
    if (ok) {
      setCopied(field);
      setTimeout(() => setCopied(null), 1500);
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary-deep)] to-[var(--primary)] p-6 text-white shadow-lg ring-1 ring-white/10">
        <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[var(--accent)]/20 blur-3xl" />

        <div className="relative flex items-start justify-between">
          <span className="flex h-8 w-11 items-center justify-center rounded-md bg-gradient-to-br from-[var(--accent)] to-[var(--accent)]/70">
            <span className="grid h-4 w-6 grid-cols-3 gap-px">
              <span className="rounded-[2px] bg-[var(--primary-deep)]/70" />
              <span className="rounded-[2px] bg-[var(--primary-deep)]/70" />
              <span className="rounded-[2px] bg-[var(--primary-deep)]/70" />
              <span className="rounded-[2px] bg-[var(--primary-deep)]/70" />
              <span className="rounded-[2px] bg-[var(--primary-deep)]/70" />
              <span className="rounded-[2px] bg-[var(--primary-deep)]/70" />
            </span>
          </span>
          <span className="font-heading text-lg font-bold italic tracking-tight">
            {typeLabel}
          </span>
        </div>

        <p className="relative mt-6 font-mono text-lg tracking-widest text-white/90">
          {groupNumber(card.card_number)}
        </p>

        <div className="relative mt-6 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-white/40">Card holder</p>
            <p className="truncate text-sm font-semibold">{holder || "—"}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-white/40">Expires</p>
            <p className="font-mono text-sm">{formatExpiry(card.expiry_date)}</p>
          </div>
        </div>

        <div className="relative mt-6 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
          <span className="truncate text-white/50">{address || "Billing address"}</span>
          <span className="shrink-0 font-semibold text-[var(--accent)]">{currency}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <CopyButton
          label="Number"
          onClick={() => copy("number", card.card_number)}
          active={copied === "number"}
        />
        <CopyButton
          label="CVV"
          onClick={() => copy("cvv", card.cvv)}
          active={copied === "cvv"}
        />
        <CopyButton
          label="Expiry"
          onClick={() => copy("expiry", formatExpiry(card.expiry_date))}
          active={copied === "expiry"}
        />
      </div>

      {issuedAt && (
        <p className="text-[11px] text-muted-foreground">Issued {formatDateTime(issuedAt)}</p>
      )}
    </div>
  );
}

function CopyButton({
  label,
  onClick,
  active,
}: {
  label: string;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn("gap-1", active && "text-[var(--primary-deep)]")}
    >
      {active ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {label}
    </Button>
  );
}
