"use client";

import { AccountStatCards } from "@/components/dashboard/account-stat-cards";
import { PageHeader } from "@/components/dashboard/page-header";
import { TransferForm } from "@/components/dashboard/transfer-form";

export default function WireTransferPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Wire Transfer"
        description="Send money internationally by SWIFT."
        crumbs={[{ label: "Transfers", href: "/dashboard/transfers" }, { label: "Wire" }]}
      />
      <AccountStatCards />
      <div className="max-w-2xl">
        <TransferForm typeKey="wire" />
      </div>
    </div>
  );
}
