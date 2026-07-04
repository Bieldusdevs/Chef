import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
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

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  // Public routes and recipe generation (with auth in route handler)
  // don't need middleware protection
  if (isPublicRoute(req)) {
    return;
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
