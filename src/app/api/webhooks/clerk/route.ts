import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/resend";
import { createCustomer } from "@/lib/stripe";

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
  };
}

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // Verify webhook signature
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  const body = await req.text();

  let event: ClerkWebhookEvent;
  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle events
  switch (event.type) {
    case "user.created": {
      const { id, email_addresses, first_name, last_name, image_url } =
        event.data;
      const email = email_addresses[0]?.email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      if (!email) break;

      // Create Stripe customer
      const stripeCustomer = await createCustomer(email, name);

      // Create DB user
      await prisma.user.create({
        data: {
          clerkId: id,
          email,
          name: name || null,
          avatarUrl: image_url,
          stripeCustomerId: stripeCustomer.id,
          subscription: {
            create: {
              status: "INACTIVE",
            },
          },
        },
      });

      // Send welcome email
      try {
        await sendWelcomeEmail(email, name || "Chef");
      } catch {
        console.warn("Failed to send welcome email");
      }

      break;
    }

    case "user.updated": {
      const { id, email_addresses, first_name, last_name, image_url } =
        event.data;
      const email = email_addresses[0]?.email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      await prisma.user.update({
        where: { clerkId: id },
        data: {
          email,
          name: name || null,
          avatarUrl: image_url,
        },
      });
      break;
    }

    case "user.deleted": {
      const { id } = event.data;
      await prisma.user.delete({
        where: { clerkId: id },
      }).catch(() => {});
      break;
    }
  }

  return NextResponse.json({ received: true });
}
