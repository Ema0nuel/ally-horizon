"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, CreditCard, DollarSign, TrendingUp, ArrowRight, ArrowUpRight, ArrowDownLeft } from "lucide-react";

import { getBrowserClient } from "@/lib/supabase/browser";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminDoughnutChart, AdminBarChart } from "@/components/admin/admin-chart";
import { UserAvatar } from "@/components/admin/user-avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Tx = {
  id: string;
  user_id: string;
  account_id: string;
  type: string | null;
  amount: number | null;
  status: string | null;
  description: string | null;
  created_at: string;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
};

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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    accounts: 0,
    transactions: 0,
    loans: 0,
    cards: 0,
    balance: 0,
  });
  const [recentUsers, setRecentUsers] = useState<ProfileRow[]>([]);
  const [recentTx, setRecentTx] = useState<Tx[]>([]);
  const [typeLabels, setTypeLabels] = useState<string[]>([]);
  const [typeValues, setTypeValues] = useState<number[]>([]);
  const [dayLabels, setDayLabels] = useState<string[]>([]);
  const [dayValues, setDayValues] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const supabase = getBrowserClient();

    async function load() {
      try {
        const [
          { count: users },
          { count: accounts },
          { count: transactions },
          { count: loans },
          { count: cards },
          { data: balances },
          { data: profiles },
          { data: txs },
        ] = await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("accounts").select("*", { count: "exact", head: true }),
          supabase.from("transactions").select("*", { count: "exact", head: true }),
          supabase.from("loan").select("*", { count: "exact", head: true }),
          supabase.from("cards").select("*", { count: "exact", head: true }),
          supabase.from("accounts").select("balance"),
          supabase.from("profiles").select("id, full_name, email, avatar_url, created_at").order("created_at", { ascending: false }).limit(5),
          supabase.from("transactions").select("id, user_id, account_id, type, amount, status, description, created_at").order("created_at", { ascending: false }).limit(200),
        ]);

        if (!active) return;

        const totalBalance =
          ((balances as { balance: number | null }[]) ?? []).reduce(
            (sum, a) => sum + (Number(a.balance) || 0),
            0
          );

        const txList = (txs as Tx[]) ?? [];
        const typeCounts = new Map<string, number>();
        const dayCounts = new Map<string, number>();
        for (const t of txList) {
          const type = t.type || "other";
          typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
          const day = (t.created_at || "").slice(0, 10);
          if (day) dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
        }

        const sortedTypes = [...typeCounts.entries()].sort((a, b) => b[1] - a[1]);
        const sortedDays = [...dayCounts.entries()].sort((a, b) => a[0].localeCompare(b[0]));

        setStats({
          users: users || 0,
          accounts: accounts || 0,
          transactions: transactions || 0,
          loans: loans || 0,
          cards: cards || 0,
          balance: totalBalance,
        });
        setRecentUsers((profiles as ProfileRow[]) ?? []);
        setRecentTx(txList.slice(0, 8));
        setTypeLabels(sortedTypes.map(([k]) => k));
        setTypeValues(sortedTypes.map(([, v]) => v));
        setDayLabels(sortedDays.map(([k]) => k));
        setDayValues(sortedDays.map(([, v]) => v));
      } catch (e) {
        console.error("Failed to load dashboard:", e);
        if (active) setError("Failed to load dashboard data");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const cards = [
    { label: "Total Users", value: stats.users.toLocaleString(), change: 0, icon: Users, href: "/admin/users", trend: "up" as const },
    { label: "Total Balance", value: formatCurrency(stats.balance), change: 0, icon: DollarSign, href: "/admin/users", trend: "up" as const },
    { label: "Accounts", value: stats.accounts.toLocaleString(), change: 0, icon: CreditCard, href: "/admin/users", trend: "up" as const },
    { label: "Transactions", value: stats.transactions.toLocaleString(), change: 0, icon: TrendingUp, href: "/admin/transactions", trend: "up" as const },
  ];

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-[0.75rem] border border-[var(--primary-deep)]/30 bg-[var(--primary-deep)]/10 p-4 text-sm font-semibold text-[var(--primary-deep)]" role="alert">
          {error}
        </div>
      )}

      <header>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Admin Panel</p>
            <h1 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
              Overview
            </h1>
          </div>
          <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            <ArrowRight className="size-4" />
            View User Dashboard
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, change, icon, href, trend }, i) => (
          <AdminStatCard
            key={label}
            label={label}
            value={value}
            change={change}
            icon={icon}
            href={href}
            trend={trend}
            delay={i * 50}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Transaction Types</CardTitle>
          </CardHeader>
          <CardContent>
            {typeLabels.length ? (
              <AdminDoughnutChart labels={typeLabels} values={typeValues} />
            ) : (
              <p className="py-16 text-center text-sm text-muted-foreground">No transaction data</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Transactions Per Day</CardTitle>
          </CardHeader>
          <CardContent>
            {dayLabels.length ? (
              <AdminBarChart labels={dayLabels} values={dayValues} />
            ) : (
              <p className="py-16 text-center text-sm text-muted-foreground">No transaction data</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Recent Users</CardTitle>
            <Link href="/admin/users" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              View all <ArrowRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? (
              <p className="p-6 text-sm text-muted-foreground">Loading…</p>
            ) : recentUsers.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">No users yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {recentUsers.map((u) => (
                  <li key={u.id}>
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                    >
                      <UserAvatar name={u.full_name} email={u.email} src={u.avatar_url} className="size-9 shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-foreground">
                          {u.full_name || "Unnamed User"}
                        </span>
                        <span className="block truncate font-mono text-xs text-muted-foreground">
                          {u.email || "—"}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">
                        {formatDateTime(u.created_at)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <Link href="/admin/transactions" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              View all <ArrowRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? (
              <p className="p-6 text-sm text-muted-foreground">Loading…</p>
            ) : recentTx.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">No transactions yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {recentTx.map((t) => {
                  const credit = creditTypes.includes((t.type ?? "").toLowerCase());
                  return (
                    <li key={t.id}>
                      <Link
                        href="/admin/transactions"
                        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                      >
                        <span
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-full",
                            credit ? "bg-[var(--accent)]/15 text-[var(--primary-deep)]" : "bg-[var(--lilac)] text-[var(--primary-deep)]"
                          )}
                        >
                          {credit ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-foreground">
                            {t.description || t.type || "Transaction"}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {formatDateTime(t.created_at)}
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span
                            className={cn(
                              "block font-mono text-sm font-semibold",
                              credit ? "text-[var(--primary-deep)]" : "text-foreground"
                            )}
                          >
                            {credit ? "+" : "−"}
                            {formatCurrency(t.amount)}
                          </span>
                          <Badge variant={statusTone(t.status)} className="mt-1 text-[10px]">
                            {t.status ?? "Pending"}
                          </Badge>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
