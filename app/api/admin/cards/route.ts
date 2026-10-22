import { requireAdmin } from "@/lib/admin-guard";
import { NextResponse } from "next/server";

import { getAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const guard = await requireAdmin(req);
  if (guard) return guard;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { user_id, account_id, card_number, card_type, expiry_date, cvv, status } = body as {
    user_id?: string;
    account_id?: string | null;
    card_number?: string;
    card_type?: string;
    expiry_date?: string | null;
    cvv?: string;
    status?: string;
  };

  if (!user_id) return NextResponse.json({ error: "user_id is required" }, { status: 400 });

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("cards")
    .insert({
      user_id,
      account_id: account_id ?? null,
      card_number: card_number ?? null,
      card_type: card_type ?? null,
      expiry_date: expiry_date ?? null,
      cvv: cvv ?? null,
      status: status ?? "pending",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, id: data?.id });
}
