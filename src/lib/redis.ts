import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// ═══════════════════════════════════════════
// REDIS CLIENT
// ═══════════════════════════════════════════

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// ═══════════════════════════════════════════
// RATE LIMITERS
// ═══════════════════════════════════════════

// Free tier: 5 recipes per day
export const freeRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 d"),
  prefix: "ratelimit:free",
  analytics: true,
});

// Premium tier: 100 recipes per day
export const premiumRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 d"),
  prefix: "ratelimit:premium",
  analytics: true,
});

// General API rate limit: 30 requests per minute
export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  prefix: "ratelimit:api",
  analytics: true,
});

// ═══════════════════════════════════════════
// CACHE HELPERS
// ═══════════════════════════════════════════

export async function getCached<T>(key: string): Promise<T | null> {
  const data = await redis.get<T>(key);
  return data;
}

export async function setCache(
  key: string,
  value: unknown,
  ttlSeconds: number = 3600
) {
  await redis.set(key, JSON.stringify(value), { ex: ttlSeconds });
}

export async function invalidateCache(pattern: string) {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
