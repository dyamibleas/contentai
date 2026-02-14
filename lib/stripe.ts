import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 12.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER!,
    features: [
      '1 content idea per day',
      '1 platform',
      'Email delivery',
      'Basic personalization',
      'Idea history',
    ],
  },
  pro: {
    name: 'Pro',
    price: 24.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO!,
    features: [
      '1 daily + 3 bonus weekly ideas',
      'All platforms',
      'Trend integration',
      'Regenerate ideas',
      'Analytics dashboard',
      'Content calendar',
    ],
  },
  business: {
    name: 'Business',
    price: 49.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS!,
    features: [
      'Everything in Pro',
      'Up to 3 team members',
      'Export to Notion/Sheets',
      'API access',
      'Priority support',
      'Slack/Discord delivery',
    ],
  },
}

export async function createCheckoutSession(priceId: string, customerId: string, email: string) {
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    metadata: { userId: customerId },
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
    subscription_data: {
      trial_period_days: 7,
      metadata: { userId: customerId },
    },
  })

  return session
}
