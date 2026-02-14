'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase-browser'
import GlowCard from '@/components/GlowCard'
import BlurText from '@/components/BlurText'

const Aurora = dynamic(() => import('@/components/Aurora'), { ssr: false })

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center px-5 relative overflow-hidden">
        <div className="fixed inset-0 z-0">
          <Aurora
            colorStops={['#5227FF', '#7cff67', '#5227FF']}
            amplitude={0.8}
            blend={0.5}
            speed={0.5}
          />
        </div>
        <div className="fixed inset-0 z-[1] bg-gradient-to-b from-[#050510]/60 via-transparent to-[#050510]/80" />

        <div className="max-w-md w-full text-center relative z-10">
          <GlowCard className="p-10">
            <div className="text-5xl mb-4">📧</div>
            <BlurText
              text="Check your email"
              className="text-2xl font-bold mb-3"
              delay={80}
            />
            <p className="text-gray-400">We&apos;ve sent a confirmation link to <strong className="text-[#7cff67]">{email}</strong>. Click it to activate your account.</p>
          </GlowCard>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-5 relative overflow-hidden">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0">
        <Aurora
          colorStops={['#5227FF', '#7cff67', '#5227FF']}
          amplitude={0.8}
          blend={0.5}
          speed={0.5}
        />
      </div>
      <div className="fixed inset-0 z-[1] bg-gradient-to-b from-[#050510]/60 via-transparent to-[#050510]/80" />

      <div className="max-w-md w-full relative z-10">
        <Link href="/" className="block text-center text-2xl font-extrabold mb-8">
          <span className="bg-gradient-to-r from-[#5227FF] via-[#7cff67] to-[#5227FF] bg-clip-text text-transparent">
            ContentAI
          </span>
        </Link>

        <GlowCard className="p-8">
          <BlurText
            text="Create your account"
            className="text-2xl font-bold mb-2"
            delay={80}
          />
          <p className="text-gray-400 text-sm mb-6">Start your 7-day free trial. No credit card required.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 focus:border-[#5227FF] focus:ring-1 focus:ring-[#5227FF]/30 focus:outline-none transition-all"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 focus:border-[#5227FF] focus:ring-1 focus:ring-[#5227FF]/30 focus:outline-none transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 focus:border-[#5227FF] focus:ring-1 focus:ring-[#5227FF]/30 focus:outline-none transition-all"
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#5227FF] to-[#6B3FFF] hover:shadow-[0_0_30px_rgba(82,39,255,0.4)] text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Start Free Trial'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account? <Link href="/auth/login" className="text-[#7cff67] hover:text-[#9dff94]">Log in</Link>
          </p>
        </GlowCard>
      </div>
    </div>
  )
}
