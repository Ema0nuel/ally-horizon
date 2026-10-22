import { requireAdmin } from "@/lib/admin-guard";
import { NextResponse } from "next/server";

import { getAdminClient } from "@/lib/supabase/admin";

const FIELDS = ["user_id", "account_id", "amount", "interest_rate", "status", "due_date", "repaid_amount"];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(req);
  if (guard) return guard;
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing loan id" }, { status: 400 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const updates: Record<string, unknown> = {};
  for (const field of FIELDS) {
    if (body[field] !== undefined) updates[field] = body[field];
  }
  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const supabase = getAdminClient();
  const { error } = await supabase.from("loan").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
