import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[STRIPE_WEBHOOK] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    // ── Checkout completed ──
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId },
      });

      if (user && subscriptionId) {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const subData = sub as unknown as Record<string, unknown>;

        const periodStart = subData.current_period_start as number | undefined;
        const periodEnd = subData.current_period_end as number | undefined;

        await prisma.subscription.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: sub.items.data[0]?.price.id,
            status: sub.status === "trialing" ? "TRIALING" : "ACTIVE",
            currentPeriodStart: periodStart ? new Date(periodStart * 1000) : null,
            currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
          },
          update: {
            stripeSubscriptionId: subscriptionId,
            stripePriceId: sub.items.data[0]?.price.id,
            status: sub.status === "trialing" ? "TRIALING" : "ACTIVE",
            currentPeriodStart: periodStart ? new Date(periodStart * 1000) : null,
            currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
          },
        });
      }
      break;
    }

    // ── Subscription updated ──
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const subData = sub as unknown as Record<string, unknown>;

      const periodStart = subData.current_period_start as number | undefined;
      const periodEnd = subData.current_period_end as number | undefined;

      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId },
      });

      if (user) {
        const statusMap: Record<string, "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIALING" | "INACTIVE"> = {
          active: "ACTIVE",
          trialing: "TRIALING",
          past_due: "PAST_DUE",
          canceled: "CANCELED",
          unpaid: "INACTIVE",
          incomplete: "INACTIVE",
          incomplete_expired: "INACTIVE",
          paused: "INACTIVE",
        };

        await prisma.subscription.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            stripeSubscriptionId: sub.id,
            stripePriceId: sub.items.data[0]?.price.id,
            status: statusMap[sub.status] || "INACTIVE",
            currentPeriodStart: periodStart ? new Date(periodStart * 1000) : null,
            currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
          update: {
            status: statusMap[sub.status] || "INACTIVE",
            currentPeriodStart: periodStart ? new Date(periodStart * 1000) : null,
            currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
        });
      }
      break;
    }

    // ── Subscription deleted ──
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;

      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId },
      });

      if (user) {
        await prisma.subscription.update({
          where: { userId: user.id },
          data: { status: "CANCELED" },
        });
      }
      break;
    }

    // ── Invoice payment failed ──
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId },
      });

      if (user) {
        await prisma.subscription.update({
          where: { userId: user.id },
          data: { status: "PAST_DUE" },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
