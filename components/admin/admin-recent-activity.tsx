"use client";

import { DollarSign, UserPlus, CreditCard, History } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const mockActivity = [
  { id: 1, type: "user_registered", user: "Sarah Johnson", email: "sarah.j@email.com", time: new Date(Date.now() - 1000 * 60 * 5).toISOString(), status: "completed" },
  { id: 2, type: "account_created", user: "Michael Chen", email: "m.chen@email.com", accountType: "USD Checking", time: new Date(Date.now() - 1000 * 60 * 15).toISOString(), status: "completed" },
  { id: 3, type: "transaction", user: "Emily Davis", email: "e.davis@email.com", amount: 2500, txType: "credit", time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), status: "completed" },
  { id: 4, type: "transaction", user: "James Wilson", email: "j.wilson@email.com", amount: 1200, txType: "debit", time: new Date(Date.now() - 1000 * 60 * 45).toISOString(), status: "pending" },
  { id: 5, type: "user_registered", user: "Lisa Anderson", email: "l.anderson@email.com", time: new Date(Date.now() - 1000 * 60 * 60).toISOString(), status: "completed" },
  { id: 6, type: "account_created", user: "Robert Taylor", email: "r.taylor@email.com", accountType: "EUR Savings", time: new Date(Date.now() - 1000 * 60 * 90).toISOString(), status: "completed" },
];

function getActivityIcon(type: string) {
  switch (type) {
    case "user_registered":
      return <UserPlus className="size-4" />;
    case "account_created":
      return <CreditCard className="size-4" />;
    case "transaction":
      return <History className="size-4" />;
    default:
      return <DollarSign className="size-4" />;
  }
}

function getActivityColor(type: string) {
  switch (type) {
    case "user_registered":
      return "bg-[var(--muted)] text-[var(--primary)]";
    case "account_created":
      return "bg-[var(--lilac)] text-[var(--primary-deep)]";
    case "transaction":
      return "bg-[var(--accent)] text-[var(--accent-foreground)]";
    default:
      return "bg-[var(--lilac)] text-[var(--primary-deep)]";
  }
}

function getActivityLabel(type: string) {
  switch (type) {
    case "user_registered":
      return "New User";
    case "account_created":
      return "New Account";
    case "transaction":
      return "Transaction";
    default:
      return "Activity";
  }
}

export function AdminRecentActivity() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <a href="/admin/activity" className="text-sm font-semibold text-primary hover:underline">
          View all
        </a>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="divide-y divide-border">
          {mockActivity.map((activity) => (
            <li key={activity.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
              <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", getActivityColor(activity.type))}>
                {getActivityIcon(activity.type)}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {getActivityLabel(activity.type)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.user} • {activity.email}
                  {activity.accountType && ` • ${activity.accountType}`}
                  {activity.amount && ` • ${activity.txType === "credit" ? "+" : "−"}${formatCurrency(activity.amount)}`}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-xs text-muted-foreground">{formatDateTime(activity.time)}</p>
                <Badge
                  variant={activity.status === "completed" ? "default" : "outline"}
                  className="mt-1 text-[10px]"
                >
                  {activity.status}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}