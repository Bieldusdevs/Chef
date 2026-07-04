import Stripe from "stripe";

// ═══════════════════════════════════════════
// STRIPE CLIENT — Lazy Initialization
// ═══════════════════════════════════════════

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    });
  }
  return _stripe;
}

// Export a lazy proxy so we don't crash at build time
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop: string | symbol) {
    const client = getStripe();
    const value = client[prop as keyof Stripe];
    if (typeof value === "function") {
      return (value as Function).bind(client);
    }
    return value;
  },
});

// ═══════════════════════════════════════════
// CHECKOUT SESSION
// ═══════════════════════════════════════════

export async function createCheckoutSession(
  customerId: string,
  priceId: string
) {
  const session = await getStripe().checkout.sessions.create({
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
  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return session;
}

// ═══════════════════════════════════════════
// CREATE CUSTOMER
// ═══════════════════════════════════════════

export async function createCustomer(email: string, name?: string) {
  const customer = await getStripe().customers.create({
    email,
    name: name || undefined,
    metadata: { source: "chefai" },
  });

  return customer;
}
