import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// ═══════════════════════════════════════════
// PRISMA CLIENT — Lazy Singleton
// Avoids connecting during Next.js build phase
// ═══════════════════════════════════════════

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Make sure it's configured in your environment variables."
    );
  }

  const adapter = new PrismaPg(connectionString);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

// Lazy getter — only creates the client when first accessed at runtime
export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

// Proxy that lazily initializes on first property access
// This prevents the client from being created during module import (build time)
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    const client = getPrisma();
    const value = client[prop as keyof PrismaClient];
    if (typeof value === "function") {
      return (value as Function).bind(client);
    }
    return value;
  },
});
