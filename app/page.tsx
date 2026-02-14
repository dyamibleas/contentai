'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Sparkles, Mail, TrendingUp, Target, Brain, Calendar, Zap, ArrowRight, Check } from 'lucide-react'
import BlurText from '@/components/BlurText'
import GlowCard from '@/components/GlowCard'

const Aurora = dynamic(() => import('@/components/Aurora'), { ssr: false })

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
    <div className="min-h-screen bg-[#050510] text-white overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full px-6 py-4 flex justify-between items-center z-50 bg-[#050510]/80 backdrop-blur-2xl border-b border-white/[0.06]">
        <div className="text-xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-[#5227FF] via-[#7cff67] to-[#5227FF] bg-clip-text text-transparent">
            ContentAI
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="hidden md:block text-sm text-gray-500 hover:text-white transition-colors duration-300">Features</a>
          <a href="#pricing" className="hidden md:block text-sm text-gray-500 hover:text-white transition-colors duration-300">Pricing</a>
          <Link href="/auth/login" className="text-sm text-gray-500 hover:text-white transition-colors duration-300">Log in</Link>
          <Link href="/auth/signup" className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5227FF] to-[#7cff67] rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-[#0a0a1a] px-5 py-2.5 rounded-lg text-sm font-semibold text-white">
              Get Started
            </div>
          </Link>
        </div>
      </nav>

      {/* Hero with Aurora Background */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-5 pt-24 pb-16">
        {/* Aurora Background */}
        <div className="absolute inset-0 z-0">
          <Aurora
            colorStops={['#5227FF', '#7cff67', '#5227FF']}
            amplitude={1.0}
            blend={0.5}
            speed={0.8}
          />
        </div>

        {/* Radial overlay for depth */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#050510]/40 via-transparent to-[#050510]" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 z-[1] opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] text-[#7cff67] px-5 py-2 rounded-full text-sm font-semibold mb-8 backdrop-blur-sm animate-pulse">
            <Sparkles size={16} /> Now accepting early access signups
          </div>

          <BlurText
            text="Never run out of content ideas again."
            className="text-4xl md:text-6xl lg:text-7xl font-black max-w-4xl leading-[1.1] mb-6 tracking-tight"
            delay={80}
            animateBy="words"
            direction="bottom"
          />

          <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto leading-relaxed mb-12 animate-fade-in">
            ContentAI delivers a personalized, AI-generated content idea to your inbox every morning. Tailored to your niche, audience, and style.
          </p>

          {!submitted ? (
            <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mx-auto animate-fade-in-up">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for early access"
                  className="w-full px-5 py-4 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-600 focus:border-[#5227FF]/50 focus:outline-none focus:ring-1 focus:ring-[#5227FF]/30 transition-all backdrop-blur-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="relative group overflow-hidden bg-gradient-to-r from-[#5227FF] to-[#6B3FFF] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:shadow-[0_0_30px_rgba(82,39,255,0.4)]"
              >
                <span className="relative z-10">{loading ? 'Joining...' : 'Join Waitlist'}</span>
                <ArrowRight size={18} className="relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#6B3FFF] to-[#7cff67] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            </form>
          ) : (
            <div className="bg-[#7cff67]/10 border border-[#7cff67]/30 text-[#7cff67] px-6 py-4 rounded-xl font-semibold backdrop-blur-sm">
              You&apos;re on the list! We&apos;ll be in touch soon.
            </div>
          )}

          <p className="mt-10 text-sm text-gray-600">Join 200+ creators on the waitlist — 7-day free trial, no credit card required</p>
        </div>
      </section>

      {/* Demo Card */}
      <section className="px-5 pb-32 max-w-2xl mx-auto relative">
        <BlurText
          text="Here's what your daily email looks like"
          className="text-2xl md:text-3xl font-bold text-center mb-3"
          delay={60}
          animateBy="words"
        />
        <p className="text-gray-500 text-center mb-10">Every morning, a ready-to-execute content idea lands in your inbox.</p>

        <GlowCard className="p-8">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="bg-[#5227FF]/15 text-[#9061ff] px-4 py-1.5 rounded-lg text-xs font-semibold border border-[#5227FF]/20">Instagram Reel · 60 sec</span>
            <span className="bg-[#7cff67]/10 text-[#7cff67] px-4 py-1.5 rounded-lg text-xs font-semibold border border-[#7cff67]/20">Quick & Easy</span>
          </div>
          <h3 className="text-xl font-bold mb-4">&ldquo;3 Exercises You&apos;re Doing Wrong at the Gym&rdquo;</h3>
          <div className="bg-[#7cff67]/5 border-l-[3px] border-[#7cff67] rounded-r-lg px-5 py-4 mb-5">
            <p className="text-[11px] uppercase tracking-widest text-[#7cff67] font-bold mb-1">Opening Hook</p>
            <p className="text-green-200/80 italic">&ldquo;Stop doing these 3 exercises wrong — you&apos;re wasting your time and risking injury.&rdquo;</p>
          </div>
          <p className="text-[11px] uppercase tracking-widest text-[#9061ff] font-bold mb-3">Talking Points</p>
          <div className="space-y-2 mb-5">
            {['Open with a bold claim to stop the scroll', 'Show wrong form side-by-side with correct', 'Use text overlays for each exercise name', 'End with a strong CTA'].map((p, i) => (
              <p key={i} className="text-gray-400 text-sm"><span className="text-[#7cff67] mr-2">→</span>{p}</p>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {['#gymtok', '#fitnesstips', '#workout', '#formcheck', '#gymlife'].map(h => (
              <span key={h} className="bg-white/[0.03] text-gray-500 px-3 py-1.5 rounded-full text-xs border border-white/[0.06]">{h}</span>
            ))}
          </div>
        </GlowCard>
      </section>

      {/* Features */}
      <section id="features" className="px-5 py-32 max-w-5xl mx-auto relative">
        {/* Subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#5227FF]/5 rounded-full blur-[150px] pointer-events-none" />

        <BlurText
          text="Built for creators who mean business"
          className="text-3xl md:text-4xl font-extrabold text-center mb-4"
          delay={60}
          animateBy="words"
        />
        <p className="text-gray-500 text-center mb-20 max-w-lg mx-auto">Everything you need to stay consistent, relevant, and creative — without the burnout.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {[
            { icon: Target, title: 'Deeply Personalized', desc: 'Ideas tailored to your niche, audience, tone, and style. Not generic suggestions.', color: '#5227FF' },
            { icon: Mail, title: 'Passive Delivery', desc: 'No app to open. No prompts to write. Your idea arrives in your inbox every morning.', color: '#7cff67' },
            { icon: TrendingUp, title: 'Trend-Aware', desc: 'Ideas incorporate trending topics, viral formats, and seasonal events.', color: '#FF6B35' },
            { icon: Zap, title: 'Platform-Specific', desc: 'Each idea is formatted for your platform — TikTok, IG, YouTube, X, LinkedIn.', color: '#5227FF' },
            { icon: Brain, title: 'Gets Smarter', desc: 'Mark ideas as used or skipped. ContentAI learns and improves every day.', color: '#7cff67' },
            { icon: Calendar, title: 'Content Calendar', desc: 'View ideas in a calendar. Plan ahead, save favorites, and export.', color: '#FF6B35' },
          ].map((f, i) => (
            <GlowCard key={i} className="p-7 group hover:translate-y-[-2px] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}>
                <f.icon style={{ color: f.color }} size={22} />
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </GlowCard>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-5 py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent" />
        <div className="max-w-4xl mx-auto relative z-10">
          <BlurText
            text="How it works"
            className="text-3xl md:text-4xl font-extrabold text-center mb-4"
            delay={80}
            animateBy="words"
          />
          <p className="text-gray-500 text-center mb-20">Three steps. Five minutes. Daily content ideas forever.</p>

          <div className="flex flex-col md:flex-row gap-10">
            {[
              { num: '01', title: 'Tell us about you', desc: 'Fill out your creator profile — niche, platforms, audience, tone, and goals.' },
              { num: '02', title: 'We do the thinking', desc: 'Our AI crafts a personalized content idea every day based on your profile and trends.' },
              { num: '03', title: 'You create', desc: "Check your email, grab today's idea. Hooks, talking points, hashtags — all there." },
            ].map((s, i) => (
              <div key={i} className="flex-1 text-center group">
                <div className="relative inline-block mb-6">
                  <div className="text-5xl font-black text-white/[0.04] group-hover:text-[#5227FF]/10 transition-colors duration-500">{s.num}</div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#5227FF] to-[#7cff67] rounded-xl flex items-center justify-center text-sm font-extrabold shadow-[0_0_20px_rgba(82,39,255,0.3)]">
                      {i + 1}
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-5 py-32 max-w-5xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#5227FF]/5 rounded-full blur-[120px] pointer-events-none" />

        <BlurText
          text="Simple, transparent pricing"
          className="text-3xl md:text-4xl font-extrabold text-center mb-4"
          delay={60}
          animateBy="words"
        />
        <p className="text-gray-500 text-center mb-20">Start free for 7 days. Cancel anytime.</p>

        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          {[
            { name: 'Starter', price: '12.99', desc: 'For creators just getting started', features: ['1 content idea per day', '1 platform', 'Email delivery', 'Basic personalization', 'Idea history'], featured: false },
            { name: 'Pro', price: '24.99', desc: 'For serious creators who post daily', features: ['1 daily + 3 bonus weekly ideas', 'All platforms', 'Trend integration', 'Regenerate ideas', 'Analytics dashboard', 'Content calendar'], featured: true },
            { name: 'Business', price: '49.99', desc: 'For teams and agencies', features: ['Everything in Pro', 'Up to 3 team members', 'Export to Notion/Sheets', 'API access', 'Priority support'], featured: false },
          ].map((plan, i) => (
            <div key={i} className={`relative rounded-2xl p-8 transition-all duration-300 hover:translate-y-[-4px] ${plan.featured
              ? 'bg-white/[0.04] border border-[#5227FF]/40 shadow-[0_0_60px_rgba(82,39,255,0.1)]'
              : 'bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12]'
              }`}>
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#5227FF] to-[#7cff67] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
              <div className="text-4xl font-black mb-1">
                ${plan.price}<span className="text-base text-gray-600 font-normal">/mo</span>
              </div>
              <p className="text-gray-600 text-sm mb-6">{plan.desc}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="text-gray-400 text-sm flex items-start gap-2">
                    <Check size={16} className={`mt-0.5 flex-shrink-0 ${plan.featured ? 'text-[#7cff67]' : 'text-[#5227FF]'}`} />{f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className={`block text-center py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${plan.featured
                  ? 'bg-gradient-to-r from-[#5227FF] to-[#6B3FFF] text-white hover:shadow-[0_0_30px_rgba(82,39,255,0.4)]'
                  : 'bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.06]'
                  }`}
              >
                Start Free Trial
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-32 text-center relative">
        <div className="absolute inset-0 z-0 opacity-50">
          <Aurora
            colorStops={['#5227FF', '#7cff67', '#5227FF']}
            amplitude={0.6}
            blend={0.7}
            speed={0.5}
          />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#050510] via-transparent to-[#050510]" />

        <div className="relative z-10">
          <BlurText
            text="Ready to never stare at a blank screen again?"
            className="text-3xl md:text-5xl font-extrabold mb-6 max-w-3xl mx-auto"
            delay={60}
            animateBy="words"
          />
          <p className="text-gray-500 mb-10 max-w-md mx-auto">Join the waitlist and be first to get daily content ideas when we launch.</p>
          <Link
            href="/auth/signup"
            className="relative inline-flex items-center gap-2 group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#5227FF] to-[#7cff67] rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-[#0a0a1a] text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-2">
              Get Started Free <ArrowRight size={20} />
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-8 border-t border-white/[0.04] text-center relative z-10">
        <div className="text-lg font-extrabold mb-2">
          <span className="bg-gradient-to-r from-[#5227FF] via-[#7cff67] to-[#5227FF] bg-clip-text text-transparent">
            ContentAI
          </span>
        </div>
        <p className="text-gray-600 text-sm">&copy; 2026 ContentAI. All rights reserved.</p>
      </footer>
    </div>
  )
}
