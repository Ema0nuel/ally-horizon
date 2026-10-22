import { requireAdmin } from "@/lib/admin-guard";
import { NextResponse } from "next/server";

import { getAdminClient } from "@/lib/supabase/admin";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(req);
  if (guard) return guard;
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing user id" }, { status: 400 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { fund, message } = body as { fund?: number; message?: string };

  const supabase = getAdminClient();

  try {
    if (message) {
      await supabase.from("notifications").insert({
        user_id: id,
        title: "Admin Message",
        message,
        type: "info",
      });
    }

    if (fund && fund > 0) {
      const { data: account } = await supabase
        .from("accounts")
        .select("id, balance")
        .eq("user_id", id)
        .maybeSingle();

      if (account) {
        const before = Number(account.balance) || 0;
        const after = before + fund;

        await supabase.from("accounts").update({ balance: after }).eq("id", account.id);
        await supabase.from("transactions").insert({
          user_id: id,
          account_id: account.id,
          type: "deposit",
          description: "Admin funding",
          amount: fund,
          balance_before: before,
          balance_after: after,
          status: "completed",
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fund account" },
      { status: 500 }
    );
  }
}
