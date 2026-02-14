'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Mail, TrendingUp, Target, Brain, Calendar, Zap, ArrowRight, Check } from 'lucide-react'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) setSubmitted(true)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Nav */}
      <nav className="fixed top-0 w-full px-6 py-4 flex justify-between items-center z-50 bg-dark/90 backdrop-blur-xl border-b border-white/5">
        <div className="text-xl font-extrabold bg-gradient-to-r from-brand-500 to-accent bg-clip-text text-transparent">
          ContentAI
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="hidden md:block text-sm text-gray-400 hover:text-white transition">Features</a>
          <a href="#pricing" className="hidden md:block text-sm text-gray-400 hover:text-white transition">Pricing</a>
          <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition">Log in</Link>
          <Link href="/auth/signup" className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-5 pt-24 pb-16 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 px-5 py-2 rounded-full text-sm font-semibold mb-6">
          <Sparkles size={16} /> Now accepting early access signups
        </div>

        <h1 className="text-4xl md:text-6xl font-black max-w-3xl leading-tight mb-6">
          Never run out of{' '}
          <span className="bg-gradient-to-r from-brand-500 to-accent bg-clip-text text-transparent">
            content ideas
          </span>{' '}
          again.
        </h1>

        <p className="text-lg text-gray-400 max-w-xl leading-relaxed mb-10">
          ContentAI delivers a personalized, AI-generated content idea to your inbox every morning. Tailored to your niche, audience, and style. Zero effort required.
        </p>

        {!submitted ? (
          <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email for early access"
              className="flex-1 px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none transition"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? 'Joining...' : 'Join Waitlist'} <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-6 py-4 rounded-xl font-semibold">
            You&apos;re on the list! We&apos;ll be in touch soon.
          </div>
        )}

        <p className="mt-8 text-sm text-gray-500">Join 200+ creators on the waitlist — 7-day free trial, no credit card required</p>
      </section>

      {/* Demo Card */}
      <section className="px-5 pb-24 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-3">Here&apos;s what your daily email looks like</h2>
        <p className="text-gray-400 text-center mb-10">Every morning, a ready-to-execute content idea lands in your inbox.</p>

        <div className="bg-dark-100 border border-brand-500/20 rounded-2xl p-8">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="bg-brand-500/15 text-brand-400 px-4 py-1.5 rounded-lg text-xs font-semibold">Instagram Reel · 60 sec</span>
            <span className="bg-green-500/15 text-green-400 px-4 py-1.5 rounded-lg text-xs font-semibold">Quick & Easy</span>
          </div>
          <h3 className="text-xl font-bold mb-4">&ldquo;3 Exercises You&apos;re Doing Wrong at the Gym&rdquo;</h3>
          <div className="bg-accent/10 border-l-[3px] border-accent rounded-r-lg px-5 py-4 mb-5">
            <p className="text-[11px] uppercase tracking-widest text-accent font-bold mb-1">Opening Hook</p>
            <p className="text-orange-200 italic">&ldquo;Stop doing these 3 exercises wrong — you&apos;re wasting your time and risking injury.&rdquo;</p>
          </div>
          <p className="text-[11px] uppercase tracking-widest text-brand-400 font-bold mb-3">Talking Points</p>
          <div className="space-y-2 mb-5">
            {['Open with a bold claim to stop the scroll', 'Show wrong form side-by-side with correct', 'Use text overlays for each exercise name', 'End with a strong CTA'].map((p, i) => (
              <p key={i} className="text-gray-400 text-sm"><span className="text-brand-400 mr-2">→</span>{p}</p>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {['#gymtok', '#fitnesstips', '#workout', '#formcheck', '#gymlife'].map(h => (
              <span key={h} className="bg-white/5 text-gray-500 px-3 py-1.5 rounded-full text-xs">{h}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-5 py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-4">Built for creators who mean business</h2>
        <p className="text-gray-400 text-center mb-16 max-w-lg mx-auto">Everything you need to stay consistent, relevant, and creative — without the burnout.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Target, title: 'Deeply Personalized', desc: 'Ideas tailored to your niche, audience, tone, and style. Not generic suggestions.' },
            { icon: Mail, title: 'Passive Delivery', desc: 'No app to open. No prompts to write. Your idea arrives in your inbox every morning.' },
            { icon: TrendingUp, title: 'Trend-Aware', desc: 'Ideas incorporate trending topics, viral formats, and seasonal events.' },
            { icon: Zap, title: 'Platform-Specific', desc: 'Each idea is formatted for your platform — TikTok, IG, YouTube, X, LinkedIn.' },
            { icon: Brain, title: 'Gets Smarter', desc: 'Mark ideas as used or skipped. ContentAI learns and improves every day.' },
            { icon: Calendar, title: 'Content Calendar', desc: 'View ideas in a calendar. Plan ahead, save favorites, and export.' },
          ].map((f, i) => (
            <div key={i} className="bg-dark-100 border border-white/5 rounded-2xl p-7 hover:border-brand-500/30 transition group">
              <f.icon className="text-brand-400 mb-4 group-hover:scale-110 transition" size={28} />
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-5 py-24 bg-dark-100">
        <h2 className="text-3xl font-extrabold text-center mb-4">How it works</h2>
        <p className="text-gray-400 text-center mb-16">Three steps. Five minutes. Daily content ideas forever.</p>

        <div className="flex flex-col md:flex-row gap-10 max-w-3xl mx-auto">
          {[
            { num: '1', title: 'Tell us about you', desc: 'Fill out your creator profile — niche, platforms, audience, tone, and goals.' },
            { num: '2', title: 'We do the thinking', desc: 'Our AI crafts a personalized content idea every day based on your profile and trends.' },
            { num: '3', title: 'You create', desc: 'Check your email, grab today\'s idea. Hooks, talking points, hashtags — all there.' },
          ].map((s, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-accent rounded-2xl flex items-center justify-center text-xl font-extrabold mx-auto mb-5">{s.num}</div>
              <h3 className="font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-5 py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-4">Simple, transparent pricing</h2>
        <p className="text-gray-400 text-center mb-16">Start free for 7 days. Cancel anytime.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Starter', price: '12.99', desc: 'For creators just getting started', features: ['1 content idea per day', '1 platform', 'Email delivery', 'Basic personalization', 'Idea history'], featured: false },
            { name: 'Pro', price: '24.99', desc: 'For serious creators who post daily', features: ['1 daily + 3 bonus weekly ideas', 'All platforms', 'Trend integration', 'Regenerate ideas', 'Analytics dashboard', 'Content calendar'], featured: true },
            { name: 'Business', price: '49.99', desc: 'For teams and agencies', features: ['Everything in Pro', 'Up to 3 team members', 'Export to Notion/Sheets', 'API access', 'Priority support'], featured: false },
          ].map((plan, i) => (
            <div key={i} className={`relative bg-dark-100 rounded-2xl p-8 ${plan.featured ? 'border-2 border-brand-500 shadow-[0_0_40px_rgba(108,60,225,0.15)]' : 'border border-white/5'}`}>
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-accent text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
              <div className="text-4xl font-black mb-1">${plan.price}<span className="text-base text-gray-400 font-normal">/mo</span></div>
              <p className="text-gray-500 text-sm mb-6">{plan.desc}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="text-gray-400 text-sm flex items-start gap-2">
                    <Check size={16} className="text-brand-400 mt-0.5 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className={`block text-center py-3.5 rounded-xl font-bold text-sm transition ${plan.featured ? 'bg-brand-500 hover:bg-brand-600 text-white' : 'bg-white/5 hover:bg-white/10 text-white'}`}
              >
                Start Free Trial
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to never stare at a blank screen again?</h2>
        <p className="text-gray-400 mb-10 max-w-md mx-auto">Join the waitlist and be first to get daily content ideas when we launch.</p>
        <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition">
          Get Started Free <ArrowRight size={20} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-5 py-8 border-t border-white/5 text-center">
        <div className="text-lg font-extrabold bg-gradient-to-r from-brand-500 to-accent bg-clip-text text-transparent mb-2">ContentAI</div>
        <p className="text-gray-500 text-sm">&copy; 2026 ContentAI. All rights reserved.</p>
      </footer>
    </div>
  )
}
