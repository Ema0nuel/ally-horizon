"use client";

import type * as React from "react";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { bankConfig, type TransferField } from "@/lib/bank-config";
import { formatCurrency } from "@/lib/format";
import { createNotification } from "@/lib/notifications";
import { sendActionOtpEmail, storeOtp, verifyOtp } from "@/lib/otp";
import { getBrowserClient } from "@/lib/supabase/browser";
import { useAuthStore } from "@/stores/auth-store";
import { useMoney } from "@/hooks/use-preferences";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, Textarea } from "@/components/dashboard/field";
import { OtpDialog } from "@/components/dashboard/otp-dialog";
import type { Account, Profile } from "./types";

export function TransferForm({ typeKey }: { typeKey: "local" | "wire" | "interbank" }) {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile) as Profile | null;
  const account = useAuthStore((s) => s.account) as Account | null;
  const { format } = useMoney();

  const config = bankConfig.transferForms[typeKey];

  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [done, setDone] = useState(false);

  function setValue(name: string, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id || !account?.id) return;
    setError("");

    const amount = Number.parseFloat(values.amount || "");
    if (Number.isNaN(amount) || amount <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (account.balance != null && amount > account.balance) {
      setError("Insufficient balance.");
      return;
    }
    for (const field of config.fields) {
      if (field.required && !String(values[field.name] ?? "").trim()) {
        setError(`${field.label} is required.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const otp = await storeOtp(user.id, config.otpType);

      const details = config.fields
        .map((f) => `<b>${f.label}:</b> ${values[f.name] || "—"}`)
        .join("<br/>");

      await sendActionOtpEmail({
        to: profile?.email ?? user.email ?? "",
        name: profile?.full_name ?? undefined,
        otp,
        actionLabel: config.label,
        details,
      });

      setOtpOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onVerify(code: string) {
    if (!user?.id || !account?.id) return;
    setOtpLoading(true);
    setOtpError("");

    const valid = await verifyOtp(user.id, config.otpType, code);
    if (!valid) {
      setOtpError("Invalid or expired code.");
      setOtpLoading(false);
      return;
    }

    const amount = Number.parseFloat(values.amount || "0");
    const balance = account.balance ?? 0;
    const balanceAfter = Math.max(balance - amount, 0);

    const supabase = getBrowserClient();

    const { error: updateError } = await supabase
      .from("accounts")
      .update({ balance: balanceAfter })
      .eq("id", account.id);

    if (updateError) {
      setOtpError(updateError.message);
      setOtpLoading(false);
      return;
    }

    const { error: txError } = await supabase.from("transactions").insert({
      account_id: account.id,
      user_id: user.id,
      type: "transfer",
      method: "bank",
      description: values.desc
        ? `${config.label} — ${values.desc}`
        : config.label,
      amount,
      balance_before: balance,
      balance_after: balanceAfter,
      status: "pending",
    });

    if (txError) {
      setOtpError(txError.message);
      setOtpLoading(false);
      return;
    }

    const currentAccount = useAuthStore.getState().account ?? {};
    useAuthStore.getState().setAccount({ ...currentAccount, balance: balanceAfter });

    await createNotification({
      userId: user.id,
      title: `${config.label} initiated`,
      message: `Your ${config.label.toLowerCase()} of ${formatCurrency(amount)} is pending approval.`,
      type: "info",
    });

    setOtpLoading(false);
    setOtpOpen(false);
    setDone(true);
    setValues({});
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-14 text-center">
        <CheckCircle2 className="size-10 text-[var(--primary-deep)]" />
        <h2 className="font-heading text-xl font-bold text-foreground">
          Transfer submitted
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Your {config.label.toLowerCase()} has been recorded and is being processed.
          You will be notified once it completes.
        </p>
        <Button variant="outline" onClick={() => setDone(false)}>
          Make another transfer
        </Button>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {config.fields.map((field) => (
            <TransferInput
              key={field.name}
              field={field}
              value={values[field.name] ?? ""}
              onChange={(v) => setValue(field.name, v)}
              className={
                field.type === "textarea" || field.name === "desc" ? "sm:col-span-2" : undefined
              }
            />
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Available balance:{" "}
          <span className="font-semibold text-foreground">{format(account?.balance)}</span>
        </p>

        {error && <p className="text-xs text-[var(--primary-deep)]">{error}</p>}

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Sending code…" : "Transfer"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setValues({})}
            disabled={submitting}
          >
            Clear
          </Button>
        </div>
      </form>

      <OtpDialog
        open={otpOpen}
        title="Verify transfer"
        description={`Enter the code sent to ${profile?.email ?? "your email"} to confirm this ${config.label.toLowerCase()}.`}
        loading={otpLoading}
        error={otpError}
        onVerify={onVerify}
        onClose={() => setOtpOpen(false)}
      />
    </>
  );
}

function TransferInput({
  field,
  value,
  onChange,
  className,
}: {
  field: TransferField;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const common = {
    id: field.name,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
  };

  return (
    <Field
      label={field.label}
      htmlFor={field.name}
      required={field.required}
      className={className}
    >
      {field.type === "textarea" ? (
        <Textarea {...common} rows={3} placeholder={field.placeholder} />
      ) : (
        <Input
          {...common}
          type={field.type === "number" ? "number" : field.type}
          min={field.min}
          step={field.step}
          placeholder={field.placeholder}
        />
      )}
    </Field>
  );
}
