# ContentAI — Setup & Deployment Guide

## What You've Got

A complete production-ready Next.js app with:
- Landing page with email waitlist capture
- User authentication (Supabase)
- Creator profile onboarding
- AI-powered content idea generation (Grok/xAI)
- Dashboard with idea history & status tracking
- Stripe subscription payments (3 tiers)
- Daily email delivery system (Resend)
- Cron job for automated daily idea generation

---

## Step 1: Create Your Accounts (All Free to Start)

### 1a. Supabase (Database + Auth)
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (name it "contentai")
3. Go to **Settings > API** and copy:
   - `Project URL` → this is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → this is your `SUPABASE_SERVICE_ROLE_KEY`
4. Go to **SQL Editor** and paste the entire contents of `lib/database.sql` and run it

### 1b. xAI / Grok API
1. Go to [console.x.ai](https://console.x.ai) and create an account
2. Generate an API key → this is your `XAI_API_KEY`

### 1c. Stripe (Payments)
1. Go to [stripe.com](https://stripe.com) and create an account
2. In the dashboard, go to **Products** and create 3 products:
   - **Starter**: $12.99/month recurring
   - **Pro**: $24.99/month recurring
   - **Business**: $49.99/month recurring
3. Copy each product's **Price ID** (starts with `price_`)
4. Go to **Developers > API Keys** and copy your **Secret key**
5. Go to **Developers > Webhooks** and create a webhook:
   - Endpoint URL: `https://yourdomain.com/api/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - Copy the **Webhook signing secret**

### 1d. Resend (Email)
1. Go to [resend.com](https://resend.com) and create a free account
2. Add your domain and verify it (or use their test domain to start)
3. Create an API key → this is your `RESEND_API_KEY`

### 1e. Vercel (Hosting)
1. Go to [vercel.com](https://vercel.com) and create a free account
2. Connect your GitHub account

---

## Step 2: Set Up the Code

```bash
# 1. Create a new GitHub repo and push this code
git init
git add .
git commit -m "Initial commit - ContentAI"
git remote add origin https://github.com/YOUR_USERNAME/contentai.git
git push -u origin main

# 2. Install dependencies locally (optional, for local dev)
npm install

# 3. Copy .env.example to .env.local and fill in all values
cp .env.example .env.local

# 4. Run locally to test
npm run dev
```

---

## Step 3: Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. In the **Environment Variables** section, add ALL variables from `.env.example`
4. Click **Deploy**

### Set up the Cron Job
The `vercel.json` file includes a cron configuration that runs daily at 12:00 UTC (7:00 AM EST). This triggers the `/api/cron` endpoint which generates and emails ideas to all subscribers.

**Important:** Vercel Cron Jobs require a Pro plan ($20/month). Alternatively, use a free external cron service:
- [cron-job.org](https://cron-job.org) (free)
- [EasyCron](https://easycron.com) (free tier)

Set it to hit: `GET https://yourdomain.com/api/cron` with header `Authorization: Bearer YOUR_CRON_SECRET`

---

## Step 4: Buy a Domain

1. Buy a domain from [Namecheap](https://namecheap.com), [Cloudflare](https://cloudflare.com), or [Google Domains](https://domains.google)
2. In Vercel, go to your project → **Settings > Domains** → Add your domain
3. Update your DNS records as Vercel instructs
4. Update `NEXT_PUBLIC_APP_URL` in your Vercel environment variables
5. Update your Stripe webhook URL to use the new domain
6. Update your Resend sending domain

---

## Cost Breakdown at Launch

| Service | Cost |
|---------|------|
| Supabase | $0 (free tier: 500MB, 50K requests) |
| Vercel | $0 (free tier) or $20/mo for cron |
| xAI/Grok | ~$0.01-0.05 per idea generated |
| Stripe | 2.9% + $0.30 per transaction |
| Resend | $0 (free: 3,000 emails/month) |
| Domain | ~$10-15/year |
| **Total** | **~$0-25/month at launch** |

You break even at roughly 1-2 paying subscribers.

---

## File Structure

```
contentai/
├── app/
│   ├── api/
│   │   ├── generate/route.ts    ← AI idea generation endpoint
│   │   ├── webhook/route.ts     ← Stripe webhook handler
│   │   ├── cron/route.ts        ← Daily email cron job
│   │   └── waitlist/route.ts    ← Waitlist signup
│   ├── auth/
│   │   ├── login/page.tsx       ← Login page
│   │   ├── signup/page.tsx      ← Signup page
│   │   └── callback/route.ts    ← Auth callback handler
│   ├── dashboard/page.tsx       ← Main dashboard
│   ├── profile/page.tsx         ← Creator profile setup
│   ├── layout.tsx               ← Root layout
│   ├── page.tsx                 ← Landing page
│   └── globals.css              ← Global styles
├── lib/
│   ├── grok.ts                  ← Grok/xAI integration
│   ├── stripe.ts                ← Stripe config & helpers
│   ├── email.ts                 ← Email templates & sending
│   ├── supabase-server.ts       ← Server-side Supabase client
│   ├── supabase-browser.ts      ← Client-side Supabase client
│   └── database.sql             ← Database schema (run in Supabase)
├── .env.example                 ← Environment variables template
├── vercel.json                  ← Vercel cron configuration
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── SETUP_GUIDE.md               ← This file
```

---

## Next Steps After Launch

1. **Collect beta testers** — Share on Reddit, Twitter, Product Hunt
2. **Monitor & iterate** — Watch which ideas get marked "used" vs "skipped"
3. **Add features** — Content calendar, analytics, team plans
4. **SEO content** — Write blog posts targeting "content ideas for [platform]"
5. **Affiliate program** — Let creators earn 20% for referrals
