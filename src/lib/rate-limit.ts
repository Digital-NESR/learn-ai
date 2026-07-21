/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * Scaffolding note: this Map lives in the server instance's memory, so limits
 * are per-instance and reset on cold start. Good enough to keep the n8n chat
 * from being hammered in the interim. For hard, cross-instance limits in
 * production, back this with a shared store (e.g. Upstash Redis) - the
 * `rateLimit()` signature can stay the same.
 */

interface Bucket {
  count: number;
  reset: number; // epoch ms when the window resets
}

const buckets = new Map<string, Bucket>();

export interface RateResult {
  ok: boolean;
  remaining: number;
  reset: number;
  limit: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateResult {
  const now = Date.now();

  // Opportunistic cleanup so the map can't grow unbounded.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (now >= b.reset) buckets.delete(k);
  }

  const bucket = buckets.get(key);
  if (!bucket || now >= bucket.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1, reset: now + windowMs, limit };
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, reset: bucket.reset, limit };
  }

  bucket.count += 1;
  return { ok: true, remaining: limit - bucket.count, reset: bucket.reset, limit };
}
