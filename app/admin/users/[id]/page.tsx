"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, ShieldCheck, ShieldX, Trash2 } from "lucide-react";

import { getBrowserClient } from "@/lib/supabase/browser";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/admin/user-avatar";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  firstname: string | null;
  lastname: string | null;
  username: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  dob: string | null;
  occupation: string | null;
  gender: string | null;
  marital_status: string | null;
  nationality: string | null;
  country_code: string | null;
  ssn: string | null;
  title: string | null;
  avatar_url: string | null;
  created_at: string;
};

type Account = {
  id: string;
  account_type: string | null;
  account_number: string | null;
  balance: number | null;
  interest_rate: number | null;
  is_active: boolean | null;
  mortgage: number | null;
  loan: number | null;
};

type Crypto = {
  btc_balance: number | null;
  eth_balance: number | null;
  usdt_balance: number | null;
  usdc_balance: number | null;
  bnb_balance: number | null;
  sol_balance: number | null;
};

type Tx = {
  id: string;
  type: string | null;
  amount: number | null;
  status: string | null;
  description: string | null;
  created_at: string;
};

type IdmeSubmission = {
  id: string;
  id_type: string | null;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  id_number: string | null;
  expiry_date: string | null;
  issuing_country: string | null;
  primary_id_front_url: string | null;
  primary_id_back_url: string | null;
  selfie_url: string | null;
  submission_status: string | null;
  rejection_reason: string | null;
  submitted_at: string | null;
};

const ACCOUNT_TYPES = ["USD SAVING", "USD CURRENT", "MONEY MARKET", "IRA", "INVESTMENT ACCOUNT"];

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [idme, setIdme] = useState<IdmeSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [form, setForm] = useState<Record<string, string>>({});
  const [cryptoForm, setCryptoForm] = useState<Record<string, string>>({});

  async function reload() {
    const supabase = getBrowserClient();
    const [{ data: p }, { data: a }, { data: c }, { data: t }, { data: v }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", id).single(),
      supabase.from("accounts").select("*").eq("user_id", id).maybeSingle(),
      supabase.from("crypto_balances").select("*").eq("user_id", id).maybeSingle(),
      supabase.from("transactions").select("id, type, amount, status, description, created_at").eq("user_id", id).order("created_at", { ascending: false }).limit(20),
      supabase.from("idme_submissions").select("*").eq("user_id", id).order("submitted_at", { ascending: false }),
    ]);
    const prof = (p as Profile) ?? null;
    const acct = (a as Account) ?? null;
    const crypt = (c as Crypto) ?? null;
    setProfile(prof);
    setTxs((t as Tx[]) ?? []);
    setIdme((v as IdmeSubmission[]) ?? []);

    setForm({
      full_name: prof?.full_name ?? "",
      title: prof?.title ?? "",
      firstname: prof?.firstname ?? "",
      lastname: prof?.lastname ?? "",
      phone: prof?.phone ?? "",
      email: prof?.email ?? "",
      country_code: prof?.country_code ?? "",
      nationality: prof?.nationality ?? "",
      address: prof?.address ?? "",
      city: prof?.city ?? "",
      state: prof?.state ?? "",
      zip: prof?.zip ?? "",
      dob: prof?.dob ?? "",
      occupation: prof?.occupation ?? "",
      gender: prof?.gender ?? "",
      marital_status: prof?.marital_status ?? "",
      ssn: prof?.ssn ?? "",
      account_type: acct?.account_type ?? "",
      account_number: acct?.account_number ?? "",
      balance: acct?.balance != null ? String(acct.balance) : "",
      interest_rate: acct?.interest_rate != null ? String(acct.interest_rate) : "",
      mortgage: acct?.mortgage != null ? String(acct.mortgage) : "",
      loan: acct?.loan != null ? String(acct.loan) : "",
      is_active: acct?.is_active === false ? "false" : "true",
    });

    setCryptoForm({
      btc_balance: crypt?.btc_balance != null ? String(crypt.btc_balance) : "",
      eth_balance: crypt?.eth_balance != null ? String(crypt.eth_balance) : "",
      usdt_balance: crypt?.usdt_balance != null ? String(crypt.usdt_balance) : "",
      usdc_balance: crypt?.usdc_balance != null ? String(crypt.usdc_balance) : "",
      bnb_balance: crypt?.bnb_balance != null ? String(crypt.bnb_balance) : "",
      sol_balance: crypt?.sol_balance != null ? String(crypt.sol_balance) : "",
    });
  }

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await reload();
      } catch (e) {
        console.error("Failed to load user:", e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function setField(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function saveDetails() {
    setBusy("save");
    setFeedback(null);
    try {
      const body = {
        profile: {
          full_name: form.full_name,
          title: form.title,
          firstname: form.firstname,
          lastname: form.lastname,
          phone: form.phone,
          email: form.email,
          country_code: form.country_code,
          nationality: form.nationality,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          dob: form.dob,
          occupation: form.occupation,
          gender: form.gender,
          marital_status: form.marital_status,
          ssn: form.ssn,
        },
        account: {
          account_type: form.account_type,
          account_number: form.account_number,
          balance: form.balance !== "" ? Number(form.balance) : 0,
          interest_rate: form.interest_rate !== "" ? Number(form.interest_rate) : null,
          mortgage: form.mortgage !== "" ? Number(form.mortgage) : null,
          loan: form.loan !== "" ? Number(form.loan) : null,
          is_active: form.is_active === "true",
        },
        crypto: {
          btc_balance: cryptoForm.btc_balance !== "" ? Number(cryptoForm.btc_balance) : 0,
          eth_balance: cryptoForm.eth_balance !== "" ? Number(cryptoForm.eth_balance) : 0,
          usdt_balance: cryptoForm.usdt_balance !== "" ? Number(cryptoForm.usdt_balance) : 0,
          usdc_balance: cryptoForm.usdc_balance !== "" ? Number(cryptoForm.usdc_balance) : 0,
          bnb_balance: cryptoForm.bnb_balance !== "" ? Number(cryptoForm.bnb_balance) : 0,
          sol_balance: cryptoForm.sol_balance !== "" ? Number(cryptoForm.sol_balance) : 0,
        },
      };
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setFeedback("Details updated");
      await reload();
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setBusy(null);
    }
  }

  async function deleteUser() {
    if (!confirm(`Delete ${profile?.full_name || "this user"}? This cannot be undone.`)) return;
    setBusy("delete");
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      router.push("/admin/users");
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Failed");
      setBusy(null);
    }
  }

  if (loading) {
    return <p className="p-6 text-sm text-muted-foreground">Loading…</p>;
  }

  if (!profile) {
    return (
      <div className="space-y-4">
        <Link href="/admin/users" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="size-4" /> Back to users
        </Link>
        <p className="text-sm text-muted-foreground">User not found.</p>
      </div>
    );
  }

  const active = form.is_active !== "false";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/users" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="size-4" /> Back to users
        </Link>
        <Button variant="destructive" size="sm" onClick={deleteUser} loading={busy === "delete"}>
          <Trash2 className="size-4" /> Delete user
        </Button>
      </div>

      {feedback && (
        <p className="rounded-lg border border-border bg-muted p-3 text-sm font-semibold text-foreground">{feedback}</p>
      )}

      <Card>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <UserAvatar name={profile.full_name} email={profile.email} src={profile.avatar_url} className="size-16 text-xl" />
            <div className="min-w-0 flex-1">
              <h1 className="font-heading text-2xl font-medium text-foreground">
                {profile.full_name || "Unnamed User"}
              </h1>
              <p className="font-mono text-sm text-muted-foreground">{profile.email || "—"}</p>
              <p className="text-sm text-muted-foreground">{profile.phone || "—"}</p>
            </div>
            <div className="flex items-center gap-2">
              {active ? (
                <Badge variant="default"><ShieldCheck className="size-3" /> Active</Badge>
              ) : (
                <Badge variant="destructive"><ShieldX className="size-3" /> Suspended</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Identity Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {idme.length === 0 ? (
            <p className="text-sm text-muted-foreground">No verification submitted.</p>
          ) : (
            idme.map((s) => (
              <div key={s.id} className="space-y-4 rounded-lg border border-border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={
                      s.submission_status === "approved"
                        ? "default"
                        : s.submission_status === "rejected"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {(s.submission_status ?? "pending").replace(/_/g, " ")}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {s.submitted_at ? `Submitted ${formatDateTime(s.submitted_at)}` : ""}
                  </span>
                </div>

                {s.rejection_reason && (
                  <p className="rounded-lg bg-destructive/10 p-2 text-sm font-semibold text-destructive">
                    {s.rejection_reason}
                  </p>
                )}

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="ID type"><p className="text-sm text-foreground">{s.id_type || "—"}</p></Field>
                  <Field label="ID number"><p className="font-mono text-sm text-foreground">{s.id_number || "—"}</p></Field>
                  <Field label="Name">
                    <p className="text-sm text-foreground">{[s.first_name, s.last_name].filter(Boolean).join(" ") || "—"}</p>
                  </Field>
                  <Field label="Date of birth"><p className="text-sm text-foreground">{s.date_of_birth || "—"}</p></Field>
                  <Field label="Expiry date"><p className="text-sm text-foreground">{s.expiry_date || "—"}</p></Field>
                  <Field label="Issuing country"><p className="text-sm text-foreground">{s.issuing_country || "—"}</p></Field>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "ID front", src: s.primary_id_front_url },
                    { label: "ID back", src: s.primary_id_back_url },
                    { label: "Selfie", src: s.selfie_url },
                  ].map((doc) => (
                    <div key={doc.label}>
                      <p className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {doc.label}
                      </p>
                      {doc.src ? (
                        <a href={doc.src} target="_blank" rel="noreferrer">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={doc.src}
                            alt={doc.label}
                            className="w-full rounded-lg border border-border object-cover"
                          />
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">Not uploaded</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Edit Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Full name"><Input value={form.full_name} onChange={(e) => setField("full_name", e.target.value)} /></Field>
            <Field label="Title"><Input value={form.title} onChange={(e) => setField("title", e.target.value)} /></Field>
            <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} /></Field>
            <Field label="First name"><Input value={form.firstname} onChange={(e) => setField("firstname", e.target.value)} /></Field>
            <Field label="Last name"><Input value={form.lastname} onChange={(e) => setField("lastname", e.target.value)} /></Field>
            <Field label="Phone"><Input value={form.phone} onChange={(e) => setField("phone", e.target.value)} /></Field>
            <Field label="Gender">
              <select className="h-8 w-full rounded-[0.75rem] border border-[var(--border)] bg-transparent px-2 text-sm outline-none" value={form.gender} onChange={(e) => setField("gender", e.target.value)}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field label="Marital status"><Input value={form.marital_status} onChange={(e) => setField("marital_status", e.target.value)} /></Field>
            <Field label="Date of birth"><Input type="date" value={form.dob} onChange={(e) => setField("dob", e.target.value)} /></Field>
            <Field label="Occupation"><Input value={form.occupation} onChange={(e) => setField("occupation", e.target.value)} /></Field>
            <Field label="Nationality"><Input value={form.nationality} onChange={(e) => setField("nationality", e.target.value)} /></Field>
            <Field label="Country code"><Input value={form.country_code} onChange={(e) => setField("country_code", e.target.value)} /></Field>
            <Field label="SSN"><Input value={form.ssn} onChange={(e) => setField("ssn", e.target.value)} /></Field>
            <Field label="Address"><Input value={form.address} onChange={(e) => setField("address", e.target.value)} /></Field>
            <Field label="City"><Input value={form.city} onChange={(e) => setField("city", e.target.value)} /></Field>
            <Field label="State"><Input value={form.state} onChange={(e) => setField("state", e.target.value)} /></Field>
            <Field label="Zip"><Input value={form.zip} onChange={(e) => setField("zip", e.target.value)} /></Field>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Account & Balances</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Account type">
                <select className="h-8 w-full rounded-[0.75rem] border border-[var(--border)] bg-transparent px-2 text-sm outline-none" value={form.account_type} onChange={(e) => setField("account_type", e.target.value)}>
                  <option value="">Select</option>
                  {ACCOUNT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Account number"><Input value={form.account_number} onChange={(e) => setField("account_number", e.target.value)} /></Field>
              <Field label="Balance"><Input type="number" step="0.01" value={form.balance} onChange={(e) => setField("balance", e.target.value)} /></Field>
              <Field label="Interest rate (%)"><Input type="number" step="0.01" value={form.interest_rate} onChange={(e) => setField("interest_rate", e.target.value)} /></Field>
              <Field label="Mortgage"><Input type="number" step="0.01" value={form.mortgage} onChange={(e) => setField("mortgage", e.target.value)} /></Field>
              <Field label="Loan"><Input type="number" step="0.01" value={form.loan} onChange={(e) => setField("loan", e.target.value)} /></Field>
              <Field label="Status">
                <select className="h-8 w-full rounded-[0.75rem] border border-[var(--border)] bg-transparent px-2 text-sm outline-none" value={form.is_active} onChange={(e) => setField("is_active", e.target.value)}>
                  <option value="true">Active</option>
                  <option value="false">Suspended</option>
                </select>
              </Field>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Crypto Balances</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="BTC"><Input type="number" step="0.00000001" value={cryptoForm.btc_balance} onChange={(e) => setCryptoForm((f) => ({ ...f, btc_balance: e.target.value }))} /></Field>
              <Field label="ETH"><Input type="number" step="0.00000001" value={cryptoForm.eth_balance} onChange={(e) => setCryptoForm((f) => ({ ...f, eth_balance: e.target.value }))} /></Field>
              <Field label="USDT"><Input type="number" step="0.000001" value={cryptoForm.usdt_balance} onChange={(e) => setCryptoForm((f) => ({ ...f, usdt_balance: e.target.value }))} /></Field>
              <Field label="USDC"><Input type="number" step="0.000001" value={cryptoForm.usdc_balance} onChange={(e) => setCryptoForm((f) => ({ ...f, usdc_balance: e.target.value }))} /></Field>
              <Field label="BNB"><Input type="number" step="0.00000001" value={cryptoForm.bnb_balance} onChange={(e) => setCryptoForm((f) => ({ ...f, bnb_balance: e.target.value }))} /></Field>
              <Field label="SOL"><Input type="number" step="0.00000001" value={cryptoForm.sol_balance} onChange={(e) => setCryptoForm((f) => ({ ...f, sol_balance: e.target.value }))} /></Field>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={saveDetails} loading={busy === "save"}>
              <Save className="size-4" /> Save details
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {txs.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No transactions.</p>
          ) : (
            <ul className="divide-y divide-border">
              {txs.map((t) => (
                <li key={t.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-foreground">
                      {t.description || t.type || "Transaction"}
                    </span>
                    <span className="block text-xs text-muted-foreground">{formatDateTime(t.created_at)}</span>
                  </span>
                  <span className="font-mono text-sm font-semibold">{formatCurrency(t.amount)}</span>
                  <Badge variant={t.status === "completed" ? "default" : t.status === "failed" ? "destructive" : "outline"}>
                    {t.status ?? "Pending"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
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
