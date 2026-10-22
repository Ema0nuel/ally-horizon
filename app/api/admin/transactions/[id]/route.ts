import { requireAdmin } from "@/lib/admin-guard";
import { NextResponse } from "next/server";

import { getAdminClient } from "@/lib/supabase/admin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(req);
  if (guard) return guard;
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing transaction id" }, { status: 400 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { user_id, account_id, type, amount, status, description, balance_before, balance_after, created_at } =
    body as {
      user_id?: string;
      account_id?: string;
      type?: string;
      amount?: number;
      status?: string;
      description?: string;
      balance_before?: number | null;
      balance_after?: number | null;
      created_at?: string;
    };

  const updates: Record<string, unknown> = {};
  if (user_id !== undefined) updates.user_id = user_id;
  if (account_id !== undefined) updates.account_id = account_id;
  if (type !== undefined) updates.type = type;
  if (amount !== undefined) updates.amount = amount;
  if (status !== undefined) updates.status = status;
  if (description !== undefined) updates.description = description;
  if (balance_before !== undefined) updates.balance_before = balance_before;
  if (balance_after !== undefined) updates.balance_after = balance_after;
  if (created_at !== undefined) updates.created_at = created_at;

  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const supabase = getAdminClient();
  const { error } = await supabase.from("transactions").update(updates).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
