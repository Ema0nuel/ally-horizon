"use client";

import { useEffect, useState } from "react";
import { Plus, Search, X } from "lucide-react";

import { getBrowserClient } from "@/lib/supabase/browser";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/admin/user-avatar";
import { AdminModal } from "@/components/admin/admin-modal";

type Loan = {
  id: string;
  user_id: string;
  account_id: string | null;
  amount: number | null;
  interest_rate: number | null;
  status: string | null;
  due_date: string | null;
  repaid_amount: number | null;
  created_at: string | null;
};

type LoanRow = Loan & { user_name: string; user_email: string; user_avatar: string | null };

type UserOpt = { id: string; full_name: string | null; email: string | null; avatar_url: string | null };
type AccountOpt = { id: string; user_id: string; account_number: string | null; account_type: string | null };

function tone(status: string | null): "default" | "secondary" | "destructive" | "outline" {
  switch (status?.toLowerCase()) {
    case "approved":
    case "disbursed":
      return "default";
    case "rejected":
      return "destructive";
    case "pending":
      return "outline";
    case "closed":
      return "secondary";
    default:
      return "secondary";
  }
}

export default function AdminLoansPage() {
  const [rows, setRows] = useState<LoanRow[]>([]);
  const [users, setUsers] = useState<UserOpt[]>([]);
  const [accounts, setAccounts] = useState<AccountOpt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<LoanRow | null>(null);
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    const supabase = getBrowserClient();
    async function load() {
      try {
        const [{ data: loans }, { data: profiles }, { data: accountRows }] = await Promise.all([
          supabase.from("loan").select("*").order("created_at", { ascending: false }).limit(200),
          supabase.from("profiles").select("id, full_name, email, avatar_url"),
          supabase.from("accounts").select("id, user_id, account_number, account_type"),
        ]);
        if (!active) return;
        const loanList = (loans as Loan[]) ?? [];
        const profileList = (profiles as UserOpt[]) ?? [];
        const accountList = (accountRows as AccountOpt[]) ?? [];
        setUsers(profileList);
        setAccounts(accountList);
        setRows(
          loanList.map((l) => {
            const u = profileList.find((p) => p.id === l.user_id);
            return {
              ...l,
              user_name: u?.full_name || u?.email || "Unknown",
              user_email: u?.email || "",
              user_avatar: u?.avatar_url || null,
            };
          })
        );
      } catch (e) {
        console.error("Failed to load loans:", e);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const filtered = rows.filter((r) => {
    const q = search.trim().toLowerCase();
    const matchQ = !q || r.user_name.toLowerCase().includes(q) || r.user_email.toLowerCase().includes(q) || String(r.amount).includes(q);
    const matchS = !statusFilter || r.status === statusFilter;
    return matchQ && matchS;
  });

  function blankForm() {
    return {
      user_id: "",
      account_id: "",
      amount: "",
      interest_rate: "",
      status: "pending",
      due_date: "",
      repaid_amount: "",
    };
  }

  function openCreate() {
    setSelected(null);
    setEditing(false);
    setCreating(true);
    setForm(blankForm());
  }

  function openEdit(loan: LoanRow) {
    setSelected(loan);
    setEditing(true);
    setCreating(false);
    setForm({
      user_id: loan.user_id || "",
      account_id: loan.account_id || "",
      amount: loan.amount != null ? String(loan.amount) : "",
      interest_rate: loan.interest_rate != null ? String(loan.interest_rate) : "",
      status: loan.status || "pending",
      due_date: loan.due_date || "",
      repaid_amount: loan.repaid_amount != null ? String(loan.repaid_amount) : "",
    });
  }

  async function save() {
    setBusy("save");
    try {
      const payload = {
        user_id: form.user_id,
        account_id: form.account_id || null,
        amount: form.amount !== "" ? Number(form.amount) : 0,
        interest_rate: form.interest_rate !== "" ? Number(form.interest_rate) : 0,
        status: form.status,
        due_date: form.due_date || null,
        repaid_amount: form.repaid_amount !== "" ? Number(form.repaid_amount) : 0,
      };

      if (creating) {
        const res = await fetch("/api/admin/loans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create");
      } else if (selected) {
        const res = await fetch(`/api/admin/loans/${selected.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update");
      }

      const supabase = getBrowserClient();
      const { data: loans } = await supabase.from("loan").select("*").order("created_at", { ascending: false }).limit(200);
      const loanList = (loans as Loan[]) ?? [];
      setRows(
        loanList.map((l) => {
          const u = users.find((p) => p.id === l.user_id);
          return {
            ...l,
            user_name: u?.full_name || u?.email || "Unknown",
            user_email: u?.email || "",
            user_avatar: u?.avatar_url || null,
          };
        })
      );
      setCreating(false);
      setEditing(false);
      setSelected(null);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(null);
    }
  }

  async function quickStatus(loan: LoanRow, status: string) {
    setBusy(status);
    try {
      const res = await fetch(`/api/admin/loans/${loan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      setRows((prev) => prev.map((r) => (r.id === loan.id ? { ...r, status } : r)));
      setSelected((prev) => (prev && prev.id === loan.id ? { ...prev, status } : prev));
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(null);
    }
  }

  async function disburse(loan: LoanRow) {
    setBusy("disburse");
    try {
      const res = await fetch(`/api/admin/loans/${loan.id}/disburse`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setRows((prev) => prev.map((r) => (r.id === loan.id ? { ...r, status: "disbursed" } : r)));
      setSelected((prev) => (prev && prev.id === loan.id ? { ...prev, status: "disbursed" } : prev));
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(null);
    }
  }

  const accountOptions = form.user_id ? accounts.filter((a) => a.user_id === form.user_id) : accounts;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">Admin Panel / Loans</p>
          <h1 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
            Loan Management
          </h1>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="size-4" /> Create loan
        </Button>
      </header>

      <Card>
        <CardContent className="pt-0">
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by user, amount..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" type="search" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 rounded-[0.75rem] border border-[var(--border)] bg-transparent px-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-[var(--primary)]/50"
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="disbursed">Disbursed</option>
              <option value="rejected">Rejected</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {loading ? (
            <p className="p-6 text-sm text-muted-foreground">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No loans found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-left">
                    <th className="px-4 py-3 font-semibold text-muted-foreground">User</th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Amount</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Interest</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Status</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Due date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((l) => (
                    <tr key={l.id} className="cursor-pointer transition-colors hover:bg-muted/50" onClick={() => { setSelected(l); setEditing(false); }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar name={l.user_name} email={l.user_email} src={l.user_avatar} className="size-8 shrink-0" />
                          <span className="min-w-0">
                            <span className="block truncate font-semibold text-foreground">{l.user_name}</span>
                            <span className="block truncate font-mono text-xs text-muted-foreground">{l.user_email}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold">{formatCurrency(l.amount)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{l.interest_rate != null ? `${l.interest_rate}%` : "—"}</td>
                      <td className="px-4 py-3"><Badge variant={tone(l.status)}>{l.status ?? "pending"}</Badge></td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{l.due_date || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AdminModal
        open={!!(selected || creating)}
        onClose={() => { setSelected(null); setCreating(false); setEditing(false); }}
        label="Loan details"
      >
        <div className="flex items-start justify-between">
          <h2 className="font-heading text-xl font-medium text-foreground">
            {creating ? "Create Loan" : editing ? "Edit Loan" : "Loan Details"}
          </h2>
          <Button variant="ghost" size="icon-sm" onClick={() => { setSelected(null); setCreating(false); setEditing(false); }} aria-label="Close">
            <X className="size-4" />
          </Button>
        </div>

        {creating || editing ? (
              <div className="mt-4 space-y-3">
                <Field label="User">
                  <select className="h-8 w-full rounded-[0.75rem] border border-[var(--border)] bg-transparent px-2 text-sm outline-none" value={form.user_id} onChange={(e) => setForm((f) => ({ ...f, user_id: e.target.value, account_id: "" }))}>
                    <option value="">Select user</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Account">
                  <select className="h-8 w-full rounded-[0.75rem] border border-[var(--border)] bg-transparent px-2 text-sm outline-none" value={form.account_id} onChange={(e) => setForm((f) => ({ ...f, account_id: e.target.value }))}>
                    <option value="">Select account</option>
                    {accountOptions.map((a) => (
                      <option key={a.id} value={a.id}>{a.account_number} ({a.account_type})</option>
                    ))}
                  </select>
                </Field>
                <Field label="Amount"><Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} /></Field>
                <Field label="Interest rate (%)"><Input type="number" step="0.01" value={form.interest_rate} onChange={(e) => setForm((f) => ({ ...f, interest_rate: e.target.value }))} /></Field>
                <Field label="Status">
                  <select className="h-8 w-full rounded-[0.75rem] border border-[var(--border)] bg-transparent px-2 text-sm outline-none" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                    {["pending", "approved", "disbursed", "rejected", "closed"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Due date"><Input type="date" value={form.due_date} onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))} /></Field>
                <Field label="Repaid amount"><Input type="number" step="0.01" value={form.repaid_amount} onChange={(e) => setForm((f) => ({ ...f, repaid_amount: e.target.value }))} /></Field>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => { setCreating(false); setEditing(false); setSelected(null); }}>Cancel</Button>
                  <Button size="sm" loading={busy === "save"} onClick={save}>{creating ? "Create" : "Save changes"}</Button>
                </div>
              </div>
            ) : selected ? (
              <>
                <dl className="mt-4 divide-y divide-border text-sm">
                  <Row label="User" value={`${selected.user_name} (${selected.user_email || "—"})`} />
                  <Row label="Amount" value={formatCurrency(selected.amount)} mono />
                  <Row label="Interest rate" value={selected.interest_rate != null ? `${selected.interest_rate}%` : "—"} />
                  <Row label="Repaid" value={formatCurrency(selected.repaid_amount)} mono />
                  <Row label="Due date" value={selected.due_date || "—"} />
                  <Row label="Requested" value={formatDateTime(selected.created_at)} />
                </dl>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(selected)}>Edit</Button>
                  {selected.status === "pending" && (
                    <>
                      <Button size="sm" loading={busy === "approved"} onClick={() => quickStatus(selected, "approved")}>Approve</Button>
                      <Button size="sm" variant="destructive" loading={busy === "rejected"} onClick={() => quickStatus(selected, "rejected")}>Reject</Button>
                    </>
                  )}
                  {selected.status === "approved" && (
                    <Button size="sm" loading={busy === "disburse"} onClick={() => disburse(selected)}>Disburse</Button>
                  )}
                </div>
              </>
            ) : null}
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
      <dd className={cn("text-right text-sm text-foreground", mono && "font-mono text-xs")}>{value}</dd>
    </div>
  );
}
