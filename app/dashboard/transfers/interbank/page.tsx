"use client";

import { AccountStatCards } from "@/components/dashboard/account-stat-cards";
import { PageHeader } from "@/components/dashboard/page-header";
import { TransferForm } from "@/components/dashboard/transfer-form";

export default function InterbankTransferPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Interbank Transfer"
        description="Transfer between accounts within the bank."
        crumbs={[{ label: "Transfers", href: "/dashboard/transfers" }, { label: "Interbank" }]}
      />
      <AccountStatCards />
      <div className="max-w-2xl">
        <TransferForm typeKey="interbank" />
      </div>
    </div>
  );
}
