// In-memory sliding window rate limiter.
// State is per server instance. Good enough to blunt bots and brute force.

const buckets = new Map<string, number[]>();

const MAX_KEYS = 5000;

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();

  if (buckets.size > MAX_KEYS) {
    for (const [k, times] of buckets) {
      if (times.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }

  const times = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (times.length >= limit) {
    buckets.set(key, times);
    const retryAfterMs = windowMs - (now - times[0]);
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
  }

  times.push(now);
  buckets.set(key, times);
  return { ok: true, retryAfterSec: 0 };
}
