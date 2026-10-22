"use client";

import { useMemo, useState } from "react";
import { Copy, Loader2, X } from "lucide-react";

import { bankConfig } from "@/lib/bank-config";
import { formatCurrency } from "@/lib/format";
import { copyText } from "@/lib/clipboard";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/dashboard/select-field";

export function CryptoDepositModal({
  open,
  amount,
  description,
  submitting,
  onComplete,
  onCancel,
}: {
  open: boolean;
  amount: number;
  description: string;
  submitting: boolean;
  onComplete: (symbol: string, network: string, address: string) => void;
  onCancel: () => void;
}) {
  const [symbol, setSymbol] = useState(bankConfig.cryptoAssets[0]?.symbol ?? "");
  const [network, setNetwork] = useState("");
  const [copied, setCopied] = useState(false);

  const asset = useMemo(
    () => bankConfig.cryptoAssets.find((a) => a.symbol === symbol) ?? null,
    [symbol]
  );

  const networkOptions = useMemo(
    () => (asset?.networks ?? []).map((n) => ({ value: n.network, label: n.network })),
    [asset]
  );

  const selectedNetwork = asset?.networks.find((n) => n.network === network) ?? null;
  const address = selectedNetwork?.address ?? "";

  if (!open) return null;

  async function copyAddress() {
    if (!address) return;
    const ok = await copyText(address);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Crypto deposit"
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-heading text-lg font-medium text-foreground">
              Crypto deposit
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Send the funds to the address below, then confirm.
            </p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onCancel} aria-label="Cancel">
            <X className="size-4" />
          </Button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3 text-sm">
            <span className="text-muted-foreground">Deposit amount</span>
            <span className="font-mono font-semibold text-foreground">
              {formatCurrency(amount)}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="Asset"
              id="crypto-asset"
              value={symbol}
              onChange={(v) => {
                setSymbol(v);
                setNetwork("");
                setCopied(false);
              }}
              options={bankConfig.cryptoAssets.map((a) => ({
                value: a.symbol,
                label: `${a.name} (${a.symbol})`,
              }))}
              placeholder="Select asset"
            />
            <SelectField
              label="Network"
              id="crypto-network"
              value={network}
              onChange={(v) => {
                setNetwork(v);
                setCopied(false);
              }}
              options={networkOptions}
              placeholder="Select network"
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground">Deposit address</p>
            <div className="mt-1.5 flex items-center gap-2 rounded-[0.75rem] border border-[var(--border)] bg-[var(--muted)]/30 p-2.5">
              <code className="min-w-0 flex-1 break-all font-mono text-xs text-foreground">
                {address || "Select an asset and network to generate the address."}
              </code>
              {address && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={copyAddress}
                  aria-label="Copy address"
                >
                  <Copy className="size-4" />
                </Button>
              )}
            </div>
            {copied && <p className="mt-1 text-[11px] text-[var(--primary-deep)]">Address copied.</p>}
          </div>

          {description && (
            <p className="text-xs text-muted-foreground">
              Reference: <span className="text-foreground">{description}</span>
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={() => onComplete(symbol, network, address)}
            disabled={submitting || !address}
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            I have paid
          </Button>
        </div>
      </div>
    </div>
  );
}
