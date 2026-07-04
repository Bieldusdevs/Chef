import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

// ═══════════════════════════════════════════
// CHECKOUT SESSION
// ═══════════════════════════════════════════

export async function createCheckoutSession(
  customerId: string,
  priceId: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    subscription_data: {
      trial_period_days: 14,
    },
  });

  return session;
}

// ═══════════════════════════════════════════
// CUSTOMER PORTAL
// ═══════════════════════════════════════════

export async function createPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return session;
}

// ═══════════════════════════════════════════
// CREATE CUSTOMER
// ═══════════════════════════════════════════

export async function createCustomer(email: string, name?: string) {
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: { source: "chefai" },
  });

  return customer;
}
