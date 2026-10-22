// Signed admin session tokens. Verified server side in proxy and admin API routes.
// Format: v1|<expiresMs>|<hmacHex>

export const ADMIN_SESSION_COOKIE = "ally_admin_session";

const TTL_MS = 12 * 60 * 60 * 1000;

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

async function hmac(payload: string): Promise<string> {
  const secret = getSecret();
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createAdminSessionToken(): Promise<string> {
  const expires = Date.now() + TTL_MS;
  const payload = `v1|${expires}`;
  return `${payload}|${await hmac(payload)}`;
}

// Set-Cookie percent-encodes the "|" separators, so the raw header arrives as
// "v1%7C...". Decode before splitting. Verification stays server side only.
function normalizeToken(token: string): string {
  if (!token.includes("%")) return token;
  try {
    return decodeURIComponent(token);
  } catch {
    return token;
  }
}

export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token || !getSecret()) return false;
  const parts = normalizeToken(token).split("|");
  if (parts.length !== 3) return false;
  const [version, expiresRaw, sig] = parts;
  if (version !== "v1") return false;
  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;
  const expected = await hmac(`${version}|${expiresRaw}`);
  return constantTimeEqual(sig, expected);
}

export const ADMIN_SESSION_MAX_AGE_SEC = TTL_MS / 1000;
