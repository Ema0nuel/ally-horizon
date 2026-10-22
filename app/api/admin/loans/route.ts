import { requireAdmin } from "@/lib/admin-guard";
import { NextResponse } from "next/server";

import { getAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const guard = await requireAdmin(req);
  if (guard) return guard;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { user_id, account_id, amount, interest_rate, status, due_date, repaid_amount } = body as {
    user_id?: string;
    account_id?: string | null;
    amount?: number;
    interest_rate?: number;
    status?: string;
    due_date?: string | null;
    repaid_amount?: number;
  };

  if (!user_id) return NextResponse.json({ error: "user_id is required" }, { status: 400 });

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("loan")
    .insert({
      user_id,
      account_id: account_id ?? null,
      amount: amount ?? 0,
      interest_rate: interest_rate ?? 0,
      status: status ?? "pending",
      due_date: due_date ?? null,
      repaid_amount: repaid_amount ?? 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, id: data?.id });
}
