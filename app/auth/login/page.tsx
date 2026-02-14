'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase-browser'
import GlowCard from '@/components/GlowCard'
import BlurText from '@/components/BlurText'

const Aurora = dynamic(() => import('@/components/Aurora'), { ssr: false })

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
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
            text="Welcome back"
            className="text-2xl font-bold mb-2"
            delay={80}
          />
          <p className="text-gray-400 text-sm mb-6">Log in to see today&apos;s content idea.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="Your password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#5227FF] to-[#6B3FFF] hover:shadow-[0_0_30px_rgba(82,39,255,0.4)] text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don&apos;t have an account? <Link href="/auth/signup" className="text-[#7cff67] hover:text-[#9dff94]">Sign up free</Link>
          </p>
        </GlowCard>
      </div>
    </div>
  )
}
