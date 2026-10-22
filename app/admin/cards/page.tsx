"use client";

import { useEffect, useState } from "react";
import { Plus, Search, X } from "lucide-react";

import { getBrowserClient } from "@/lib/supabase/browser";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/admin/user-avatar";
import { AdminModal } from "@/components/admin/admin-modal";

type CardRow = {
  id: string;
  user_id: string;
  account_id: string | null;
  card_number: string | null;
  card_type: string | null;
  expiry_date: string | null;
  cvv: string | null;
  status: string | null;
  issued_at: string | null;
  user_name: string;
  user_email: string;
  user_avatar: string | null;
};

type UserOpt = { id: string; full_name: string | null; email: string | null; avatar_url: string | null };
type AccountOpt = { id: string; user_id: string; account_number: string | null; account_type: string | null };

const CARD_TYPES = ["visa", "mastercard", "amex", "discover"];

function tone(status: string | null): "default" | "secondary" | "destructive" | "outline" {
  switch (status?.toLowerCase()) {
    case "approved":
    case "active":
      return "default";
    case "declined":
      return "destructive";
    case "pending":
      return "outline";
    default:
      return "secondary";
  }
}

export default function AdminCardsPage() {
  const [rows, setRows] = useState<CardRow[]>([]);
  const [users, setUsers] = useState<UserOpt[]>([]);
  const [accounts, setAccounts] = useState<AccountOpt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CardRow | null>(null);
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    const supabase = getBrowserClient();
    async function load() {
      try {
        const [{ data: cards }, { data: profiles }, { data: accountRows }] = await Promise.all([
          supabase.from("cards").select("*").order("issued_at", { ascending: false }).limit(200),
          supabase.from("profiles").select("id, full_name, email, avatar_url"),
          supabase.from("accounts").select("id, user_id, account_number, account_type"),
        ]);
        if (!active) return;
        const cardList = (cards as Omit<CardRow, "user_name" | "user_email" | "user_avatar">[]) ?? [];
        const profileList = (profiles as UserOpt[]) ?? [];
        const accountList = (accountRows as AccountOpt[]) ?? [];
        setUsers(profileList);
        setAccounts(accountList);
        setRows(
          cardList.map((c) => {
            const u = profileList.find((p) => p.id === c.user_id);
            return {
              ...c,
              user_name: u?.full_name || u?.email || "Unknown",
              user_email: u?.email || "",
              user_avatar: u?.avatar_url || null,
            };
          })
        );
      } catch (e) {
        console.error("Failed to load cards:", e);
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
    return (
      !q ||
      r.user_name.toLowerCase().includes(q) ||
      r.user_email.toLowerCase().includes(q) ||
      r.card_number?.replace(/\s/g, "").includes(q) ||
      r.card_type?.toLowerCase().includes(q)
    );
  });

  function blankForm() {
    return { user_id: "", account_id: "", card_number: "", card_type: "", expiry_date: "", cvv: "", status: "pending" };
  }

  function openCreate() {
    setSelected(null);
    setEditing(false);
    setCreating(true);
    setForm(blankForm());
  }

  function openEdit(card: CardRow) {
    setSelected(card);
    setEditing(true);
    setCreating(false);
    setForm({
      user_id: card.user_id || "",
      account_id: card.account_id || "",
      card_number: card.card_number || "",
      card_type: card.card_type || "",
      expiry_date: card.expiry_date || "",
      cvv: card.cvv || "",
      status: card.status || "pending",
    });
  }

  async function save() {
    setBusy("save");
    try {
      const payload = {
        user_id: form.user_id,
        account_id: form.account_id || null,
        card_number: form.card_number || null,
        card_type: form.card_type || null,
        expiry_date: form.expiry_date || null,
        cvv: form.cvv || null,
        status: form.status || "pending",
      };

      if (creating) {
        const res = await fetch("/api/admin/cards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create");
      } else if (selected) {
        const res = await fetch(`/api/admin/cards/${selected.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update");
      }

      const supabase = getBrowserClient();
      const { data: cards } = await supabase.from("cards").select("*").order("issued_at", { ascending: false }).limit(200);
      const cardList = (cards as Omit<CardRow, "user_name" | "user_email" | "user_avatar">[]) ?? [];
      setRows(
        cardList.map((c) => {
          const u = users.find((p) => p.id === c.user_id);
          return {
            ...c,
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

  async function quickStatus(card: CardRow, status: string) {
    setBusy(status);
    try {
      const res = await fetch(`/api/admin/cards/${card.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      setRows((prev) => prev.map((r) => (r.id === card.id ? { ...r, status } : r)));
      setSelected((prev) => (prev && prev.id === card.id ? { ...prev, status } : prev));
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
          <p className="text-sm font-semibold text-muted-foreground">Admin Panel / Cards</p>
          <h1 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
            Card Management
          </h1>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="size-4" /> Create card
        </Button>
      </header>

      <Card>
        <CardContent className="pt-0">
          <div className="border-b border-border p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by user, card number, type..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" type="search" />
            </div>
          </div>

          {loading ? (
            <p className="p-6 text-sm text-muted-foreground">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No cards found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-left">
                    <th className="px-4 py-3 font-semibold text-muted-foreground">User</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Card Number</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Type</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Expiry</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((c) => (
                    <tr key={c.id} className="cursor-pointer transition-colors hover:bg-muted/50" onClick={() => { setSelected(c); setEditing(false); }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar name={c.user_name} email={c.user_email} src={c.user_avatar} className="size-8 shrink-0" />
                          <span className="min-w-0">
                            <span className="block truncate font-semibold text-foreground">{c.user_name}</span>
                            <span className="block truncate font-mono text-xs text-muted-foreground">{c.user_email}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{c.card_number || "—"}</td>
                      <td className="px-4 py-3 capitalize text-muted-foreground">{c.card_type || "—"}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.expiry_date || "—"}</td>
                      <td className="px-4 py-3"><Badge variant={tone(c.status)}>{c.status ?? "pending"}</Badge></td>
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
        label="Card details"
      >
        <div className="flex items-start justify-between">
          <h2 className="font-heading text-xl font-medium text-foreground">
            {creating ? "Create Card" : editing ? "Edit Card" : "Card Details"}
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
                <Field label="Card number"><Input value={form.card_number} onChange={(e) => setForm((f) => ({ ...f, card_number: e.target.value }))} /></Field>
                <Field label="Card type">
                  <select className="h-8 w-full rounded-[0.75rem] border border-[var(--border)] bg-transparent px-2 text-sm outline-none" value={form.card_type} onChange={(e) => setForm((f) => ({ ...f, card_type: e.target.value }))}>
                    <option value="">Select type</option>
                    {CARD_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Expiry date"><Input type="date" value={form.expiry_date} onChange={(e) => setForm((f) => ({ ...f, expiry_date: e.target.value }))} /></Field>
                <Field label="CVV"><Input value={form.cvv} onChange={(e) => setForm((f) => ({ ...f, cvv: e.target.value }))} /></Field>
                <Field label="Status">
                  <select className="h-8 w-full rounded-[0.75rem] border border-[var(--border)] bg-transparent px-2 text-sm outline-none" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                    {["pending", "approved", "declined", "active"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => { setCreating(false); setEditing(false); setSelected(null); }}>Cancel</Button>
                  <Button size="sm" loading={busy === "save"} onClick={save}>{creating ? "Create" : "Save changes"}</Button>
                </div>
              </div>
            ) : selected ? (
              <>
                <dl className="mt-4 divide-y divide-border text-sm">
                  <Row label="User" value={`${selected.user_name} (${selected.user_email || "—"})`} />
                  <Row label="Card number" value={selected.card_number || "—"} mono />
                  <Row label="Type" value={selected.card_type || "—"} />
                  <Row label="Expiry" value={selected.expiry_date || "—"} />
                  <Row label="CVV" value={selected.cvv || "—"} mono />
                  <Row label="Issued" value={formatDateTime(selected.issued_at)} />
                </dl>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(selected)}>Edit</Button>
                  {selected.status === "pending" && (
                    <>
                      <Button size="sm" loading={busy === "approved"} onClick={() => quickStatus(selected, "approved")}>Approve</Button>
                      <Button size="sm" variant="destructive" loading={busy === "declined"} onClick={() => quickStatus(selected, "declined")}>Decline</Button>
                    </>
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
