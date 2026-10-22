"use client";

import { AccountStatCards } from "@/components/dashboard/account-stat-cards";
import { PageHeader } from "@/components/dashboard/page-header";
import { TransferForm } from "@/components/dashboard/transfer-form";

export default function LocalTransferPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Local Transfer"
        description="Send money to an account at another local bank."
        crumbs={[{ label: "Transfers", href: "/dashboard/transfers" }, { label: "Local" }]}
      />
      <AccountStatCards />
      <div className="max-w-2xl">
        <TransferForm typeKey="local" />
      </div>
    </div>
  );
}
