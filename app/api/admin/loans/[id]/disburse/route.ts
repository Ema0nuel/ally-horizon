import { requireAdmin } from "@/lib/admin-guard";
import { NextResponse } from "next/server";

import { getAdminClient } from "@/lib/supabase/admin";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(_req);
  if (guard) return guard;
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing loan id" }, { status: 400 });

  const supabase = getAdminClient();

  const { data: loan } = await supabase.from("loan").select("*").eq("id", id).maybeSingle();
  if (!loan) return NextResponse.json({ error: "Loan not found" }, { status: 404 });
  if (loan.status === "disbursed") {
    return NextResponse.json({ error: "Loan already disbursed" }, { status: 400 });
  }

  const amount = Number(loan.amount) || 0;
  const accountId = loan.account_id as string | null;

  const { data: account } = accountId
    ? await supabase.from("accounts").select("*").eq("id", accountId).maybeSingle()
    : await supabase.from("accounts").select("*").eq("user_id", loan.user_id).maybeSingle();

  if (!account) return NextResponse.json({ error: "No account found for user" }, { status: 400 });

  const before = Number(account.balance) || 0;
  const after = before + amount;

  const { error: acctError } = await supabase
    .from("accounts")
    .update({ balance: after, loan: (Number(account.loan) || 0) + amount })
    .eq("id", account.id);
  if (acctError) return NextResponse.json({ error: acctError.message }, { status: 500 });

  const { error: txError } = await supabase.from("transactions").insert({
    user_id: loan.user_id,
    account_id: account.id,
    type: "deposit",
    description: "Loan disbursement",
    amount,
    balance_before: before,
    balance_after: after,
    status: "completed",
  });
  if (txError) return NextResponse.json({ error: txError.message }, { status: 500 });

  const { error: loanError } = await supabase.from("loan").update({ status: "disbursed" }).eq("id", id);
  if (loanError) return NextResponse.json({ error: loanError.message }, { status: 500 });

  return NextResponse.json({ success: true, balance: after });
}
