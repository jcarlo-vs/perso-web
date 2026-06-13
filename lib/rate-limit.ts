/**
 * Shared best-effort rate limiting for public endpoints (chat + contact form).
 *
 * Note: the store is in-memory and per serverless instance - it resets on cold
 * starts and isn't shared across instances. It's a courtesy throttle against a
 * single impatient client, not a hard guarantee. The real backstops are Vercel's
 * edge bot protection and the spend cap set in the Anthropic Console.
 */

/**
 * Resolve the client IP from a header getter. Prefers Vercel's `x-real-ip`
 * (set by the edge to the true client IP, not client-spoofable). Falls back to
 * the LAST `x-forwarded-for` entry - the hop closest to our infrastructure -
 * rather than the first, which a client can forge.
 */
export function clientIpFrom(get: (name: string) => string | null): string {
  const realIp = get("x-real-ip");
  if (realIp?.trim()) return realIp.trim();

  const xff = get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return "unknown";
}

/** Create a sliding-window rate limiter. Each key gets `limit` hits per `windowMs`. */
export function makeRateLimiter(limit: number, windowMs: number) {
  const store = new Map<string, number[]>();

  return function isRateLimited(key: string): boolean {
    const now = Date.now();
    const recent = (store.get(key) ?? []).filter((t) => now - t < windowMs);

    if (recent.length >= limit) {
      store.set(key, recent);
      return true;
    }

    recent.push(now);
    store.set(key, recent);

    // Prevent unbounded growth: drop fully-expired keys when the map gets large
    if (store.size > 1000) {
      for (const [k, times] of store) {
        if (times.every((t) => now - t >= windowMs)) store.delete(k);
      }
    }
    return false;
  };
}
