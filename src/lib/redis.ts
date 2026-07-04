import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// ═══════════════════════════════════════════
// REDIS CLIENT — Lazy Initialization
// ═══════════════════════════════════════════

let _redis: Redis | null = null;

function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return _redis;
}

export const redis = new Proxy({} as Redis, {
  get(_target, prop: string | symbol) {
    const client = getRedis();
    const value = client[prop as keyof Redis];
    if (typeof value === "function") {
      return (value as Function).bind(client);
    }
    return value;
  },
});

// ═══════════════════════════════════════════
// RATE LIMITERS — Created lazily
// ═══════════════════════════════════════════

let _freeRateLimit: Ratelimit | null = null;
let _premiumRateLimit: Ratelimit | null = null;
let _apiRateLimit: Ratelimit | null = null;

// Free tier: 5 recipes per day
export const freeRateLimit = new Proxy({} as Ratelimit, {
  get(_target, prop: string | symbol) {
    if (!_freeRateLimit) {
      _freeRateLimit = new Ratelimit({
        redis: getRedis(),
        limiter: Ratelimit.slidingWindow(5, "1 d"),
        prefix: "ratelimit:free",
        analytics: true,
      });
    }
    const value = _freeRateLimit[prop as keyof Ratelimit];
    if (typeof value === "function") {
      return (value as Function).bind(_freeRateLimit);
    }
    return value;
  },
});

// Premium tier: 100 recipes per day
export const premiumRateLimit = new Proxy({} as Ratelimit, {
  get(_target, prop: string | symbol) {
    if (!_premiumRateLimit) {
      _premiumRateLimit = new Ratelimit({
        redis: getRedis(),
        limiter: Ratelimit.slidingWindow(100, "1 d"),
        prefix: "ratelimit:premium",
        analytics: true,
      });
    }
    const value = _premiumRateLimit[prop as keyof Ratelimit];
    if (typeof value === "function") {
      return (value as Function).bind(_premiumRateLimit);
    }
    return value;
  },
});

// General API rate limit: 30 requests per minute
export const apiRateLimit = new Proxy({} as Ratelimit, {
  get(_target, prop: string | symbol) {
    if (!_apiRateLimit) {
      _apiRateLimit = new Ratelimit({
        redis: getRedis(),
        limiter: Ratelimit.slidingWindow(30, "1 m"),
        prefix: "ratelimit:api",
        analytics: true,
      });
    }
    const value = _apiRateLimit[prop as keyof Ratelimit];
    if (typeof value === "function") {
      return (value as Function).bind(_apiRateLimit);
    }
    return value;
  },
});

// ═══════════════════════════════════════════
// CACHE HELPERS
// ═══════════════════════════════════════════

export async function getCached<T>(key: string): Promise<T | null> {
  const data = await getRedis().get<T>(key);
  return data;
}

export async function setCache(
  key: string,
  value: unknown,
  ttlSeconds: number = 3600
) {
  await getRedis().set(key, JSON.stringify(value), { ex: ttlSeconds });
}

export async function invalidateCache(pattern: string) {
  const client = getRedis();
  const keys = await client.keys(pattern);
  if (keys.length > 0) {
    await client.del(...keys);
  }
}
