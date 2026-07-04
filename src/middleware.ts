import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

// ═══════════════════════════════════════════
// PROTECTED ROUTE PATTERNS
// ═══════════════════════════════════════════

const PROTECTED_PATTERNS = [
  /^\/dashboard/,
  /^\/favorites/,
  /^\/history/,
  /^\/meal-planner/,
  /^\/settings/,
  /^\/api\/favorites/,
  /^\/api\/history/,
  /^\/api\/meal-plans/,
  /^\/api\/shopping-lists/,
  /^\/api\/subscription/,
  /^\/api\/user/,
];

function isProtected(pathname: string): boolean {
  return PROTECTED_PATTERNS.some((p) => p.test(pathname));
}

// ═══════════════════════════════════════════
// CHECK IF CLERK IS PROPERLY CONFIGURED
// Check once at module load (edge runtime)
// ═══════════════════════════════════════════

const CLERK_CONFIGURED = (() => {
  const pub = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
  const sec = process.env.CLERK_SECRET_KEY ?? "";

  if (!pub || !sec) return false;
  if (pub.includes("xxxxx") || sec.includes("xxxxx")) return false;
  if (!pub.startsWith("pk_") || !sec.startsWith("sk_")) return false;
  if (pub.length < 20 || sec.length < 20) return false;

  return true;
})();

// ═══════════════════════════════════════════
// CONDITIONALLY IMPORT & CREATE CLERK HANDLER
// Only when keys are valid
// ═══════════════════════════════════════════

let clerkHandler:
  | ((req: NextRequest, evt: NextFetchEvent) => Promise<NextResponse> | NextResponse)
  | null = null;

if (CLERK_CONFIGURED) {
  try {
    // Safe to import — keys are valid
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const clerk = require("@clerk/nextjs/server");
    const routeMatcher = clerk.createRouteMatcher([
      "/dashboard(.*)",
      "/favorites(.*)",
      "/history(.*)",
      "/meal-planner(.*)",
      "/settings(.*)",
      "/api/favorites(.*)",
      "/api/history(.*)",
      "/api/meal-plans(.*)",
      "/api/shopping-lists(.*)",
      "/api/subscription(.*)",
      "/api/user(.*)",
    ]);

    clerkHandler = clerk.clerkMiddleware(
      async (
        auth: { protect: () => Promise<void> },
        request: NextRequest
      ) => {
        if (routeMatcher(request)) {
          await auth.protect();
        }
      }
    );
  } catch (e) {
    console.error("[MIDDLEWARE] Failed to initialize Clerk:", e);
    clerkHandler = null;
  }
}

// ═══════════════════════════════════════════
// MIDDLEWARE EXPORT
// ═══════════════════════════════════════════

export default async function middleware(
  req: NextRequest,
  evt: NextFetchEvent
) {
  // ── Clerk available → use full auth ──
  if (clerkHandler) {
    try {
      return await clerkHandler(req, evt);
    } catch (error) {
      console.error("[MIDDLEWARE] Clerk runtime error:", error);
      // Fall through to basic handler
    }
  }

  // ── No Clerk → basic protection ──
  if (isProtected(req.nextUrl.pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
