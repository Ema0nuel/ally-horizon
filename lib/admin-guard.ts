import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/admin-session";

// Server-side admin check for API routes. Returns a 401 response when the
// caller has no valid admin session, otherwise null.
export async function requireAdmin(req: Request): Promise<NextResponse | null> {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${ADMIN_SESSION_COOKIE}=([^;]+)`)
  );
  const ok = await verifyAdminSessionToken(match?.[1]);
  if (ok) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
