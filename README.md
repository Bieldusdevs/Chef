# 🧑‍🍳 ChefAI — AI-Powered Recipe Generator

> Tell us what's in your kitchen and let AI create the perfect recipe.

Premium, Awwwards-quality recipe platform powered by **Gemini AI** with a full production backend.

---

## 🏗️ Architecture

```
chefai/
├── prisma/
│   └── schema.prisma          # Database schema (7 models)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── recipes/
│   │   │   │   ├── generate/     # POST — Generate recipe with Gemini
│   │   │   │   ├── improve/      # POST — Improve existing recipe
│   │   │   │   ├── adapt/        # POST — Adapt recipe by diet
│   │   │   │   ├── suggest-substitutions/  # POST
│   │   │   │   ├── convert-units/          # POST
│   │   │   │   ├── explain-technique/      # POST
│   │   │   │   ├── leftovers/    # POST — Leftover makeover
│   │   │   │   └── [id]/         # GET / DELETE
│   │   │   ├── favorites/        # GET / POST
│   │   │   ├── history/          # GET / DELETE
│   │   │   ├── meal-plans/
│   │   │   │   ├── generate/     # POST — AI meal plan
│   │   │   │   ├── [id]/         # GET / DELETE
│   │   │   │   └── route.ts      # GET list
│   │   │   ├── shopping-lists/   # CRUD
│   │   │   ├── image-recognize/  # POST — Gemini Vision
│   │   │   ├── subscription/     # GET / POST (Stripe checkout)
│   │   │   ├── user/stats/       # GET — Dashboard analytics
│   │   │   └── webhooks/
│   │   │       ├── clerk/        # User sync
│   │   │       └── stripe/       # Subscription sync
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/               # Navbar, Hero, Features, etc.
│   │   ├── recipe/               # RecipeResult, GeneratingOverlay
│   │   └── ui/                   # ScrollProgress
│   ├── hooks/
│   │   ├── use-generate-recipe.ts
│   │   ├── use-favorites.ts
│   │   └── use-timer.ts
│   ├── lib/
│   │   ├── gemini.ts             # All Gemini AI functions
│   │   ├── prisma.ts             # DB client
│   │   ├── redis.ts              # Rate limiting & caching
│   │   ├── stripe.ts             # Payments
│   │   ├── resend.ts             # Emails
│   │   ├── auth.ts               # Clerk helpers
│   │   └── validators/
│   │       └── recipe.ts         # Zod schemas
│   ├── store/
│   │   └── recipe-store.ts       # Zustand global state
│   ├── types/
│   │   └── index.ts              # TypeScript types
│   └── middleware.ts             # Route protection
└── .env                          # Environment variables
```

---

## 🤖 Gemini AI Integration

All AI features use **Gemini 2.5 Flash** with structured JSON output:

| Function | Description |
|----------|-------------|
| `generateRecipe()` | Generate complete recipe from ingredients |
| `improveRecipe()` | Improve recipe based on feedback |
| `adaptRecipeByDiet()` | Adapt recipe to specific diet |
| `suggestSubstitutions()` | Suggest ingredient swaps |
| `convertUnits()` | Metric ↔ Imperial conversion |
| `explainTechnique()` | Explain cooking techniques |
| `suggestLeftoverRecipes()` | Transform leftovers into meals |
| `generateMealPlan()` | AI weekly meal plan + shopping list |
| `recognizeIngredientsFromImage()` | Gemini Vision: identify ingredients in photos |

All responses use **structured output** (`responseMimeType: "application/json"` + `responseSchema`) for type-safe, parseable results.

---

## 📡 API Endpoints (22 routes)

### Recipes
| Method | Endpoint | Auth | Premium | Description |
|--------|----------|------|---------|-------------|
| POST | `/api/recipes/generate` | ✅ | Free (5/day), Premium (100/day) | Generate recipe |
| POST | `/api/recipes/improve` | ✅ | ✅ | Improve recipe |
| POST | `/api/recipes/adapt` | ✅ | ✅ | Adapt recipe by diet |
| POST | `/api/recipes/suggest-substitutions` | ✅ | — | Suggest substitutions |
| POST | `/api/recipes/convert-units` | ✅ | — | Convert measurement units |
| POST | `/api/recipes/explain-technique` | ✅ | — | Explain cooking technique (cached 24h) |
| POST | `/api/recipes/leftovers` | ✅ | — | Leftover makeover recipe |
| GET | `/api/recipes/[id]` | — | — | Get recipe by ID |
| DELETE | `/api/recipes/[id]` | ✅ | — | Delete own recipe |

### Favorites
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/favorites` | ✅ | List favorites (paginated) |
| POST | `/api/favorites` | ✅ | Add to favorites |
| DELETE | `/api/favorites/[id]` | ✅ | Remove from favorites |

### History
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/history` | ✅ | List history (paginated) |
| DELETE | `/api/history` | ✅ | Clear all history |

### Meal Plans
| Method | Endpoint | Auth | Premium | Description |
|--------|----------|------|---------|-------------|
| POST | `/api/meal-plans/generate` | ✅ | ✅ | Generate AI meal plan |
| GET | `/api/meal-plans` | ✅ | — | List meal plans |
| GET | `/api/meal-plans/[id]` | ✅ | — | Get meal plan + shopping list |
| DELETE | `/api/meal-plans/[id]` | ✅ | — | Delete meal plan |

### Shopping Lists
| Method | Endpoint | Auth | Premium | Description |
|--------|----------|------|---------|-------------|
| GET | `/api/shopping-lists` | ✅ | — | List shopping lists |
| POST | `/api/shopping-lists` | ✅ | ✅ | Create shopping list |
| PATCH | `/api/shopping-lists/[id]` | ✅ | — | Update items |
| DELETE | `/api/shopping-lists/[id]` | ✅ | — | Delete list |

### Other
| Method | Endpoint | Auth | Premium | Description |
|--------|----------|------|---------|-------------|
| POST | `/api/image-recognize` | ✅ | ✅ | Recognize ingredients from photo |
| GET | `/api/subscription` | ✅ | — | Get subscription status |
| POST | `/api/subscription` | ✅ | — | Create Stripe checkout / portal |
| GET | `/api/user/stats` | ✅ | — | Dashboard statistics |
| POST | `/api/webhooks/clerk` | — | — | Clerk webhook (user sync) |
| POST | `/api/webhooks/stripe` | — | — | Stripe webhook (subscription sync) |

---

## 🗄️ Database Schema

**7 Models:**

- **User** — Synced from Clerk, linked to Stripe
- **Subscription** — Premium status, Stripe sync
- **Recipe** — Full recipe with nutrition, dietary flags, JSON ingredients/steps
- **Favorite** — User ↔ Recipe (unique constraint)
- **History** — Search/generation history
- **MealPlan** — AI-generated weekly plans
- **ShoppingList** — Auto-generated or manual

---

## ⚡ Rate Limiting (Upstash Redis)

| Tier | Limit |
|------|-------|
| Free | 5 recipes/day |
| Premium | 100 recipes/day |
| General API | 30 requests/minute |

Technique explanations are **cached for 24 hours** in Redis.

---

## 💳 Payments (Stripe)

- 14-day free trial on Premium
- Checkout session creation
- Billing portal for managing subscriptions
- Webhook sync for: checkout, subscription updates, cancellations, failed payments

---

## 📧 Emails (Resend)

- Welcome email on sign-up
- Recipe share email
- Meal plan ready notification

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env` and fill in your keys:

```
GEMINI_API_KEY=          # Google AI Studio
DATABASE_URL=            # Supabase PostgreSQL
CLERK keys               # clerk.com
STRIPE keys              # stripe.com
UPSTASH keys             # upstash.com
RESEND_API_KEY=          # resend.com
```

### 3. Push database schema

```bash
npx prisma db push
```

### 4. Run development server

```bash
npm run dev
```

### 5. Configure webhooks

- **Clerk**: Point webhook to `https://your-domain/api/webhooks/clerk`
  - Events: `user.created`, `user.updated`, `user.deleted`
- **Stripe**: Point webhook to `https://your-domain/api/webhooks/stripe`
  - Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_failed`

---

## 📋 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| AI | Google Gemini 2.5 Flash |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma 7 |
| Auth | Clerk |
| Payments | Stripe |
| Rate Limiting | Upstash Redis |
| Emails | Resend |
| State | Zustand |
| Validation | Zod |
| Styling | Tailwind CSS 4 |
| UI | Custom Awwwards-quality components |
| Animations | CSS animations + Framer Motion ready |

---

## 📄 License

Private / Proprietary
