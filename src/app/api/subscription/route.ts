import { NextRequest, NextResponse } from "next/server";
import { requireDbUser } from "@/lib/auth";
import { createCheckoutSession, createPortalSession } from "@/lib/stripe";

// ── GET subscription status ──
export async function GET() {
  try {
    const dbUser = await requireDbUser();

    return NextResponse.json({
      subscription: (dbUser as typeof dbUser & { subscription: unknown }).subscription || null,
      isPremium:
        (dbUser as typeof dbUser & { subscription?: { status: string } }).subscription?.status === "ACTIVE" ||
        (dbUser as typeof dbUser & { subscription?: { status: string } }).subscription?.status === "TRIALING",
    });
  } catch (error) {
    console.error("[GET_SUBSCRIPTION]", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

// ── CREATE checkout session ──
export async function POST(req: NextRequest) {
  try {
    const dbUser = await requireDbUser();

    if (!dbUser.stripeCustomerId) {
      return NextResponse.json(
        { error: "No Stripe customer. Please contact support." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const action = body.action as string;

    if (action === "portal") {
      // Billing portal for managing subscription
      const session = await createPortalSession(dbUser.stripeCustomerId);
      return NextResponse.json({ url: session.url });
    }

    // Create checkout session
    const priceId = process.env.STRIPE_PREMIUM_PRICE_ID!;
    const session = await createCheckoutSession(
      dbUser.stripeCustomerId,
      priceId
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[CREATE_CHECKOUT]", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
