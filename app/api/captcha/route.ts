import { NextResponse } from "next/server";

import { isCaptchaConfigured, verifyCaptchaToken } from "@/lib/captcha";
import { rateLimit } from "@/lib/rate-limit";

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

// Verifies a Cloudflare Turnstile token. Single use: a token that passes here
// cannot be replayed.
export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`captcha:${ip}`, 15, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  if (!isCaptchaConfigured()) {
    return NextResponse.json(
      { error: "Captcha is not configured." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const token = typeof body?.token === "string" ? body.token : "";
  const ok = await verifyCaptchaToken(token, ip);
  if (!ok) {
    return NextResponse.json({ error: "Captcha check failed." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
