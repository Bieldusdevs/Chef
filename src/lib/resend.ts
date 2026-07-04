import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL || "ChefAI <noreply@chefai.com>";

// ═══════════════════════════════════════════
// WELCOME EMAIL
// ═══════════════════════════════════════════

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Welcome to ChefAI! 🧑‍🍳",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 16px;">
          Welcome to Chef<span style="color: #4ade80;">AI</span>
        </h1>
        <p style="color: #666; font-size: 16px; line-height: 1.7; margin-bottom: 24px;">
          Hey ${name || "there"}! 👋<br><br>
          You're all set to start generating amazing recipes with AI. Just tell us what ingredients you have, and we'll create something delicious.
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
           style="display: inline-block; background: #4ade80; color: #000; padding: 12px 32px; border-radius: 100px; font-weight: 700; text-decoration: none; font-size: 15px;">
          Start Cooking →
        </a>
        <p style="color: #999; font-size: 13px; margin-top: 32px; line-height: 1.6;">
          You're receiving this because you signed up for ChefAI.<br>
          © ${new Date().getFullYear()} ChefAI. All rights reserved.
        </p>
      </div>
    `,
  });
}

// ═══════════════════════════════════════════
// RECIPE SHARED EMAIL
// ═══════════════════════════════════════════

export async function sendRecipeShareEmail(
  toEmail: string,
  senderName: string,
  recipeName: string,
  recipeUrl: string
) {
  await resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: `${senderName} shared a recipe with you: ${recipeName} 🍽️`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px;">
          ${recipeName}
        </h1>
        <p style="color: #666; font-size: 15px; margin-bottom: 24px;">
          ${senderName} thinks you'll love this recipe created with ChefAI.
        </p>
        <a href="${recipeUrl}"
           style="display: inline-block; background: #4ade80; color: #000; padding: 12px 32px; border-radius: 100px; font-weight: 700; text-decoration: none; font-size: 15px;">
          View Recipe →
        </a>
      </div>
    `,
  });
}

// ═══════════════════════════════════════════
// WEEKLY MEAL PLAN EMAIL
// ═══════════════════════════════════════════

export async function sendMealPlanEmail(
  email: string,
  name: string,
  planName: string
) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Your meal plan is ready: ${planName} 📅`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 800;">Your Meal Plan is Ready! 📅</h1>
        <p style="color: #666; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
          Hey ${name}, your meal plan "${planName}" has been generated. Head to your dashboard to see the full plan with shopping list.
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/meal-planner"
           style="display: inline-block; background: #4ade80; color: #000; padding: 12px 32px; border-radius: 100px; font-weight: 700; text-decoration: none;">
          View Meal Plan →
        </a>
      </div>
    `,
  });
}
