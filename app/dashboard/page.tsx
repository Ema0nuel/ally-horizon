"use client";

import { useEffect, useState } from "react";

import { getBrowserClient } from "@/lib/supabase/browser";
import { useAuthStore } from "@/stores/auth-store";
import { BalanceCard } from "@/components/dashboard/balance-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import type { Account, Profile, Transaction } from "@/components/dashboard/types";

function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const profile = useAuthStore((s) => s.profile) as Profile | null;
  const account = useAuthStore((s) => s.account) as Account | null;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accountId = account?.id;
    if (!accountId) return;

    let active = true;

    async function load() {
      const supabase = getBrowserClient();
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("account_id", accountId)
        .order("created_at", { ascending: false })
        .limit(8);

      if (active) {
        setTransactions((data as Transaction[]) ?? []);
        setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [account?.id]);

  const greeting = greetingForHour(new Date().getHours());
  const firstName =
    profile?.firstname ?? profile?.full_name?.split(" ")[0] ?? "";

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold text-muted-foreground">{greeting}</p>
        <h1 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
          {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
        </h1>
      </header>

      <BalanceCard account={account} profile={profile} />
      <QuickActions />
      <RecentTransactions transactions={transactions} loading={loading} />
    </div>
  );
}
