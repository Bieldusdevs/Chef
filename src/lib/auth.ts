import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

// ═══════════════════════════════════════════
// GET OR CREATE USER IN DB
// ═══════════════════════════════════════════

export async function getDbUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { subscription: true },
  });

  return user;
}

export async function requireDbUser() {
  const user = await getDbUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function syncClerkUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email =
    clerkUser.emailAddresses[0]?.emailAddress || `${clerkUser.id}@chefai.app`;

  const user = await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email,
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
      avatarUrl: clerkUser.imageUrl,
    },
    create: {
      clerkId: clerkUser.id,
      email,
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
      avatarUrl: clerkUser.imageUrl,
    },
    include: { subscription: true },
  });

  return user;
}

// ═══════════════════════════════════════════
// SUBSCRIPTION CHECKS
// ═══════════════════════════════════════════

export function isPremium(
  user: Awaited<ReturnType<typeof getDbUser>>
): boolean {
  if (!user?.subscription) return false;
  return (
    user.subscription.status === "ACTIVE" ||
    user.subscription.status === "TRIALING"
  );
}
