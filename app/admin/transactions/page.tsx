"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import { getBrowserClient } from "@/lib/supabase/browser";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/admin/user-avatar";
import { AdminModal } from "@/components/admin/admin-modal";

type Tx = {
  id: string;
  user_id: string;
  account_id: string;
  type: string | null;
  method: string | null;
  description: string | null;
  amount: number | null;
  balance_before: number | null;
  balance_after: number | null;
  status: string | null;
  crypto_symbol: string | null;
  crypto_amount: number | null;
  created_at: string;
};

type TxRow = Tx & {
  user_name: string;
  user_email: string;
  user_avatar: string | null;
  account_number: string | null;
  account_type: string | null;
};

type UserOpt = { id: string; full_name: string | null; email: string | null };
type AccountOpt = { id: string; user_id: string; account_number: string | null; account_type: string | null };

const creditTypes = ["deposit", "credit", "incoming", "interest", "refund", "topup", "card_deposit"];

function statusTone(status: string | null): "default" | "secondary" | "destructive" | "outline" {
  switch (status?.toLowerCase()) {
    case "completed":
    case "approved":
      return "default";
    case "failed":
    case "declined":
    case "rejected":
      return "destructive";
    case "pending":
      return "outline";
    default:
      return "secondary";
  }
}

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminTransactionsPage() {
  const [rows, setRows] = useState<TxRow[]>([]);
  const [users, setUsers] = useState<UserOpt[]>([]);
  const [accounts, setAccounts] = useState<AccountOpt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<TxRow | null>(null);
  const [editing, setEditing] = useState(false);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [codes, setCodes] = useState<{ vat: string; imf: string; cot: string } | null>(null);

  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    const supabase = getBrowserClient();
    async function load() {
      try {
        const [{ data: txs }, { data: profiles }, { data: accountRows }] = await Promise.all([
          supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(300),
          supabase.from("profiles").select("id, full_name, email, avatar_url"),
          supabase.from("accounts").select("id, user_id, account_number, account_type"),
        ]);

        if (!active) return;

        const txList = (txs as Tx[]) ?? [];
        const profileList = (profiles as { id: string; full_name: string | null; email: string | null; avatar_url: string | null }[]) ?? [];
        const accountList = (accountRows as AccountOpt[]) ?? [];

        setUsers(profileList.map((p) => ({ id: p.id, full_name: p.full_name, email: p.email })));
        setAccounts(accountList);

        const merged: TxRow[] = txList.map((t) => {
          const user = profileList.find((p) => p.id === t.user_id);
          const account = accountList.find((a) => a.id === t.account_id);
          return {
            ...t,
            user_name: user?.full_name || user?.email || "Unknown",
            user_email: user?.email || "",
            user_avatar: user?.avatar_url || null,
            account_number: account?.account_number || null,
            account_type: account?.account_type || null,
          };
        });

        setRows(merged);
      } catch (e) {
        console.error("Failed to load transactions:", e);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const types = [...new Set(rows.map((r) => r.type || ""))].filter(Boolean).sort();

  const filtered = rows.filter((r) => {
    const q = search.trim().toLowerCase();
    const matchQ =
      !q ||
      r.user_name.toLowerCase().includes(q) ||
      r.user_email.toLowerCase().includes(q) ||
      r.account_number?.includes(q) ||
      r.type?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q);
    const matchType = !typeFilter || r.type === typeFilter;
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchQ && matchType && matchStatus;
  });

  function openEdit(tx: TxRow) {
    setSelected(tx);
    setEditing(true);
    setForm({
      user_id: tx.user_id || "",
      account_id: tx.account_id || "",
      type: tx.type || "",
      amount: tx.amount != null ? String(tx.amount) : "",
      status: tx.status || "",
      description: tx.description || "",
      balance_before: tx.balance_before != null ? String(tx.balance_before) : "",
      balance_after: tx.balance_after != null ? String(tx.balance_after) : "",
      created_at: toLocalInput(tx.created_at),
    });
  }

  async function saveEdit() {
    if (!selected) return;
    setBusyAction("save");
    try {
      const body = {
        user_id: form.user_id || undefined,
        account_id: form.account_id || undefined,
        type: form.type || undefined,
        amount: form.amount !== "" ? Number(form.amount) : undefined,
        status: form.status || undefined,
        description: form.description !== "" ? form.description : undefined,
        balance_before: form.balance_before !== "" ? Number(form.balance_before) : undefined,
        balance_after: form.balance_after !== "" ? Number(form.balance_after) : undefined,
        created_at: form.created_at ? new Date(form.created_at).toISOString() : undefined,
      };
      const res = await fetch(`/api/admin/transactions/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = { ...selected, ...body };
      setRows((prev) => prev.map((r) => (r.id === selected.id ? (updated as TxRow) : r)));
      setEditing(false);
      setSelected(null);
    } catch (e) {
      console.error(e);
    } finally {
      setBusyAction(null);
    }
  }

  async function updateStatus(tx: TxRow, status: string) {
    setBusyAction(status);
    try {
      const res = await fetch(`/api/admin/transactions/${tx.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setRows((prev) => prev.map((r) => (r.id === tx.id ? { ...r, status } : r)));
      setSelected((prev) => (prev && prev.id === tx.id ? { ...prev, status } : prev));
    } catch (e) {
      console.error(e);
    } finally {
      setBusyAction(null);
    }
  }

  const accountOptions = form.user_id
    ? accounts.filter((a) => a.user_id === form.user_id)
    : accounts;

  function generateCodes() {
    const random = () => Math.random().toString(36).slice(2, 10).toUpperCase();
    setCodes({ vat: random(), imf: random(), cot: random() });
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">Admin Panel / Transactions</p>
          <h1 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
            Transactions
          </h1>
        </div>
        <Button size="sm" onClick={generateCodes}>
          Generate Codes
        </Button>
      </header>

      <Card>
        <CardContent className="pt-0">
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by user, account, type, description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                type="search"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-8 rounded-[0.75rem] border border-[var(--border)] bg-transparent px-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-[var(--primary)]/50"
              >
                <option value="">All types</option>
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 rounded-[0.75rem] border border-[var(--border)] bg-transparent px-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-[var(--primary)]/50"
              >
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="reversed">Reversed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="p-6 text-sm text-muted-foreground">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No transactions found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-left">
                    <th className="px-4 py-3 font-semibold text-muted-foreground">User</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Account</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Type</th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Amount</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Status</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((t) => {
                    const credit = creditTypes.includes((t.type ?? "").toLowerCase());
                    return (
                      <tr
                        key={t.id}
                        className="cursor-pointer transition-colors hover:bg-muted/50"
                        onClick={() => setSelected(t)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <UserAvatar name={t.user_name} email={t.user_email} src={t.user_avatar} className="size-8 shrink-0" />
                            <span className="min-w-0">
                              <span className="block truncate font-semibold text-foreground">{t.user_name}</span>
                              <span className="block truncate font-mono text-xs text-muted-foreground">{t.user_email}</span>
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="block font-mono text-xs">{t.account_number || "—"}</span>
                          <span className="block text-xs text-muted-foreground">{t.account_type || ""}</span>
                        </td>
                        <td className="px-4 py-3 capitalize text-muted-foreground">{t.type || "—"}</td>
                        <td className="px-4 py-3 text-right font-mono font-semibold">
                          <span className={cn(credit ? "text-[var(--primary-deep)]" : "text-foreground")}>
                            {credit ? "+" : "−"}
                            {formatCurrency(t.amount)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={statusTone(t.status)}>{t.status ?? "Pending"}</Badge>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {formatDateTime(t.created_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AdminModal
        open={!!selected}
        onClose={() => { setSelected(null); setEditing(false); }}
        label="Transaction details"
      >
        <div className="flex items-start justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">
            {editing ? "Edit Transaction" : "Transaction Details"}
          </h2>
          <Button variant="ghost" size="icon-sm" onClick={() => { setSelected(null); setEditing(false); }} aria-label="Close">
            <X className="size-4" />
          </Button>
        </div>

        {editing ? (
              <div className="mt-4 space-y-3">
                <Field label="User">
                  <select
                    className="h-8 w-full rounded-[0.75rem] border border-[var(--border)] bg-transparent px-2 text-sm outline-none"
                    value={form.user_id}
                    onChange={(e) => setForm((f) => ({ ...f, user_id: e.target.value, account_id: "" }))}
                  >
                    <option value="">Select user</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Account">
                  <select
                    className="h-8 w-full rounded-[0.75rem] border border-[var(--border)] bg-transparent px-2 text-sm outline-none"
                    value={form.account_id}
                    onChange={(e) => setForm((f) => ({ ...f, account_id: e.target.value }))}
                  >
                    <option value="">Select account</option>
                    {accountOptions.map((a) => (
                      <option key={a.id} value={a.id}>{a.account_number} ({a.account_type})</option>
                    ))}
                  </select>
                </Field>
                <Field label="Type">
                  <select
                    className="h-8 w-full rounded-[0.75rem] border border-[var(--border)] bg-transparent px-2 text-sm outline-none"
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  >
                    <option value="">Select type</option>
                    {["deposit", "withdrawal", "transfer", "card_deposit", "crypto", "manual", "reversed"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Amount">
                  <Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
                </Field>
                <Field label="Status">
                  <select
                    className="h-8 w-full rounded-[0.75rem] border border-[var(--border)] bg-transparent px-2 text-sm outline-none"
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  >
                    <option value="">Select status</option>
                    {["pending", "completed", "failed", "reversed"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Description">
                  <Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                </Field>
                <Field label="Balance before">
                  <Input type="number" step="0.01" value={form.balance_before} onChange={(e) => setForm((f) => ({ ...f, balance_before: e.target.value }))} />
                </Field>
                <Field label="Balance after">
                  <Input type="number" step="0.01" value={form.balance_after} onChange={(e) => setForm((f) => ({ ...f, balance_after: e.target.value }))} />
                </Field>
                <Field label="Date & time">
                  <Input type="datetime-local" value={form.created_at} onChange={(e) => setForm((f) => ({ ...f, created_at: e.target.value }))} />
                </Field>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                  <Button size="sm" loading={busyAction === "save"} onClick={saveEdit}>Save changes</Button>
                </div>
              </div>
            ) : selected ? (
              <>
                <dl className="mt-4 divide-y divide-border text-sm">
                  <Row label="User" value={`${selected.user_name} (${selected.user_email || "—"})`} />
                  <Row label="Account" value={`${selected.account_number || "—"} (${selected.account_type || "—"})`} />
                  <Row label="Type" value={selected.type ?? "—"} />
                  <Row label="Amount" value={formatCurrency(selected.amount)} mono />
                  {selected.crypto_symbol && (
                    <Row label="Crypto" value={`${selected.crypto_amount ?? ""} ${selected.crypto_symbol}`} mono />
                  )}
                  <Row label="Status" value={selected.status ?? "—"} />
                  <Row label="Description" value={selected.description || "—"} />
                  <Row label="Balance before" value={formatCurrency(selected.balance_before)} mono />
                  <Row label="Balance after" value={formatCurrency(selected.balance_after)} mono />
                  <Row label="Date" value={formatDateTime(selected.created_at)} />
                </dl>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(selected)}>
                    Edit
                  </Button>
                  {selected.status !== "completed" && (
                    <Button size="sm" loading={busyAction === "completed"} onClick={() => updateStatus(selected, "completed")}>
                      Approve
                    </Button>
                  )}
                  {selected.status !== "failed" && (
                    <Button size="sm" variant="outline" loading={busyAction === "failed"} onClick={() => updateStatus(selected, "failed")}>
                      Mark failed
                    </Button>
                  )}
                  {selected.status === "completed" && (
                    <Button size="sm" variant="destructive" loading={busyAction === "reversed"} onClick={() => updateStatus(selected, "reversed")}>
                      Reverse
                    </Button>
                  )}
                </div>
              </>
            ) : null}
      </AdminModal>

      <AdminModal
        open={!!codes}
        onClose={() => setCodes(null)}
        label="Generated Codes"
        maxWidth="max-w-md"
      >
        <div className="flex items-start justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">Generated Codes</h2>
          <Button variant="ghost" size="icon-sm" onClick={() => setCodes(null)} aria-label="Close">
            <X className="size-4" />
          </Button>
        </div>
        {codes && (
          <dl className="mt-4 divide-y divide-border text-sm">
            <Row label="COT" value={codes.cot} mono />
            <Row label="IMF" value={codes.imf} mono />
            <Row label="VAT" value={codes.vat} mono />
          </dl>
        )}
      </AdminModal>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className={cn("text-right text-sm text-foreground", mono && "break-all font-mono text-xs")}>{value}</dd>
    </div>
  );
}
