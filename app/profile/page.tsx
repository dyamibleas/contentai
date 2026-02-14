'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

const NICHES = [
  'Fitness & Health', 'Beauty & Skincare', 'Tech & Gadgets', 'Gaming',
  'Food & Cooking', 'Travel', 'Finance & Investing', 'Fashion',
  'Education & Learning', 'Comedy & Entertainment', 'Business & Entrepreneurship',
  'Lifestyle', 'Music', 'Art & Design', 'Parenting', 'Pets & Animals',
  'Sports', 'Science', 'DIY & Crafts', 'Motivation & Self-Help',
]

const PLATFORMS = [
  'TikTok', 'Instagram Reels', 'Instagram Carousel', 'YouTube Shorts',
  'YouTube Long-form', 'X / Twitter', 'LinkedIn', 'Pinterest', 'Podcast',
]

const TONES = [
  'Casual & Fun', 'Professional & Polished', 'Educational & Informative',
  'Motivational & Inspiring', 'Humorous & Witty', 'Raw & Authentic',
  'Luxury & Aspirational', 'Friendly & Conversational',
]

const GOALS = [
  'Grow my followers', 'Drive sales / conversions', 'Build community engagement',
  'Land brand deals', 'Establish thought leadership', 'Grow email list',
  'Promote my product/service',
]

export default function ProfilePage() {
  const [niche, setNiche] = useState('')
  const [platforms, setPlatforms] = useState<string[]>([])
  const [tone, setTone] = useState('')
  const [goal, setGoal] = useState('')
  const [audience, setAudience] = useState('')
  const [recentTopics, setRecentTopics] = useState('')
  const [preferredTime, setPreferredTime] = useState('08:00')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) {
      setNiche(data.niche || '')
      setPlatforms(data.platforms || [])
      setTone(data.tone || '')
      setGoal(data.goal || '')
      setAudience(data.audience || '')
      setRecentTopics(data.recent_topics || '')
      setPreferredTime(data.preferred_time || '08:00')
    }
    setLoading(false)
  }

  function togglePlatform(p: string) {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!niche || platforms.length === 0) return
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('profiles')
      .update({
        niche,
        platforms,
        tone,
        goal,
        audience,
        recent_topics: recentTopics,
        preferred_time: preferredTime,
      })
      .eq('id', user.id)

    setSaving(false)
    setSaved(true)
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark">
      <nav className="border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-extrabold bg-gradient-to-r from-brand-500 to-accent bg-clip-text text-transparent">
          ContentAI
        </Link>
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">Back to Dashboard</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-10">
        <h1 className="text-2xl font-bold mb-2">Your Creator Profile</h1>
        <p className="text-gray-400 mb-8">Tell us about yourself so we can generate the perfect content ideas for you.</p>

        {saved && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-5 py-4 rounded-xl font-semibold mb-6 text-center">
            Profile saved! Redirecting to dashboard...
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Niche */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">What&apos;s your niche? *</label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-dark-100 border border-white/10 text-white focus:border-brand-500 focus:outline-none transition"
              required
            >
              <option value="">Select your niche...</option>
              {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {/* Platforms */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">Which platforms do you post on? *</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition border ${
                    platforms.includes(p)
                      ? 'border-brand-500 bg-brand-500/15 text-brand-400'
                      : 'border-white/10 bg-dark-100 text-gray-400 hover:border-white/20'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Tone & Goal */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Your tone / voice</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-100 border border-white/10 text-white focus:border-brand-500 focus:outline-none transition"
              >
                <option value="">Select tone...</option>
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Your main goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-100 border border-white/10 text-white focus:border-brand-500 focus:outline-none transition"
              >
                <option value="">Select goal...</option>
                {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Audience */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Describe your target audience</label>
            <textarea
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-dark-100 border border-white/10 text-white focus:border-brand-500 focus:outline-none transition min-h-[80px] resize-y"
              placeholder="e.g., Women aged 25-35 interested in home workouts, busy professionals..."
            />
          </div>

          {/* Recent Topics */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Topics you&apos;ve covered recently</label>
            <textarea
              value={recentTopics}
              onChange={(e) => setRecentTopics(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-dark-100 border border-white/10 text-white focus:border-brand-500 focus:outline-none transition min-h-[80px] resize-y"
              placeholder="e.g., morning routine, protein shakes, workout splits... (helps avoid repeats)"
            />
          </div>

          {/* Preferred Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Preferred delivery time</label>
            <input
              type="time"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-dark-100 border border-white/10 text-white focus:border-brand-500 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={saving || !niche || platforms.length === 0}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white py-4 rounded-xl font-bold text-lg transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile & Go to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}
