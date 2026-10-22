import { requireAdmin } from "@/lib/admin-guard";
import { NextResponse } from "next/server";

import { getAdminClient } from "@/lib/supabase/admin";

const PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

async function adminAuthFetch(path: string, init: RequestInit) {
  const res = await fetch(`${PROJECT_URL}/auth/v1/admin${path}`, {
    ...init,
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.msg || body?.error || `Auth admin request failed (${res.status})`);
  }
  return res;
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(_req);
  if (guard) return guard;
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing user id" }, { status: 400 });

  const supabase = getAdminClient();

  try {
    await supabase.from("login_otps").delete().eq("user_id", id);
    await supabase.from("crypto_balances").delete().eq("user_id", id);
    await supabase.from("transactions").delete().eq("user_id", id);
    await supabase.from("cards").delete().eq("user_id", id);
    await supabase.from("loan").delete().eq("user_id", id);
    await supabase.from("notifications").delete().eq("user_id", id);
    await supabase.from("accounts").delete().eq("user_id", id);
    await supabase.from("profiles").delete().eq("id", id);

    try {
      await adminAuthFetch(`/users/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Auth user delete failed:", err);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete user" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(req);
  if (guard) return guard;
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing user id" }, { status: 400 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const supabase = getAdminClient();

  try {
    const {
      profile,
      account,
      crypto,
      new_email,
      new_password,
    } = body as {
      profile?: Record<string, unknown>;
      account?: Record<string, unknown>;
      crypto?: Record<string, unknown>;
      new_email?: string;
      new_password?: string;
    };

    if (profile && Object.keys(profile).length) {
      const { error } = await supabase.from("profiles").update(profile).eq("id", id);
      if (error) throw error;
    }

    if (account && Object.keys(account).length) {
      const { error } = await supabase.from("accounts").update(account).eq("user_id", id);
      if (error) throw error;
    }

    if (crypto && Object.keys(crypto).length) {
      const { error } = await supabase.from("crypto_balances").update(crypto).eq("user_id", id);
      if (error) throw error;
    }

    if (new_email) {
      await adminAuthFetch(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify({ email: new_email }),
      });
      await supabase.from("profiles").update({ email: new_email }).eq("id", id);
    }

    if (new_password) {
      await adminAuthFetch(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify({ password: new_password }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update user" },
      { status: 500 }
    );
  }
}
