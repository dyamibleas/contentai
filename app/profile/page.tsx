'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase-browser'
import GlowCard from '@/components/GlowCard'
import BlurText from '@/components/BlurText'

const Aurora = dynamic(() => import('@/components/Aurora'), { ssr: false })

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

const TIME_SLOTS = [
  { label: '6:00 AM', value: '06:00' },
  { label: '7:00 AM', value: '07:00' },
  { label: '8:00 AM', value: '08:00' },
  { label: '9:00 AM', value: '09:00' },
  { label: '10:00 AM', value: '10:00' },
  { label: '11:00 AM', value: '11:00' },
  { label: '12:00 PM', value: '12:00' },
  { label: '1:00 PM', value: '13:00' },
  { label: '2:00 PM', value: '14:00' },
  { label: '3:00 PM', value: '15:00' },
  { label: '4:00 PM', value: '16:00' },
  { label: '5:00 PM', value: '17:00' },
  { label: '6:00 PM', value: '18:00' },
  { label: '7:00 PM', value: '19:00' },
  { label: '8:00 PM', value: '20:00' },
  { label: '9:00 PM', value: '21:00' },
  { label: '10:00 PM', value: '22:00' },
]

// Step tracker component
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
            i < currentStep
              ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
              : i === currentStep
              ? 'bg-brand-500/20 text-brand-400 border-2 border-brand-500 shadow-lg shadow-brand-500/20'
              : 'bg-white/5 text-gray-600 border border-white/10'
          }`}>
            {i < currentStep ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          {i < totalSteps - 1 && (
            <div className={`w-8 h-0.5 transition-all duration-500 ${
              i < currentStep ? 'bg-brand-500' : 'bg-white/10'
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}

// Description quality meter
function QualityMeter({ text }: { text: string }) {
  const length = text.trim().length
  let level = 0
  let label = 'Add more detail'
  let color = 'bg-gray-600'

  if (length > 300) { level = 4; label = 'Excellent! AI will love this'; color = 'bg-green-500' }
  else if (length > 200) { level = 3; label = 'Great detail'; color = 'bg-brand-500' }
  else if (length > 100) { level = 2; label = 'Good start'; color = 'bg-yellow-500' }
  else if (length > 30) { level = 1; label = 'Keep going...'; color = 'bg-orange-500' }

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-500">Description quality</span>
        <span className={`text-xs font-semibold ${
          level >= 3 ? 'text-green-400' : level >= 2 ? 'text-brand-400' : 'text-gray-400'
        }`}>{label}</span>
      </div>
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
            i < level ? color : 'bg-white/5'
          }`} />
        ))}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const [step, setStep] = useState(0)
  const [niche, setNiche] = useState('')
  const [customNiche, setCustomNiche] = useState('')
  const [platforms, setPlatforms] = useState<string[]>([])
  const [customPlatform, setCustomPlatform] = useState('')
  const [tone, setTone] = useState('')
  const [customTone, setCustomTone] = useState('')
  const [goal, setGoal] = useState('')
  const [customGoal, setCustomGoal] = useState('')
  const [audience, setAudience] = useState('')
  const [recentTopics, setRecentTopics] = useState('')
  const [preferredTime, setPreferredTime] = useState('08:00')
  const [detailedDescription, setDetailedDescription] = useState('')
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
      // Check if the stored value is custom (not in the predefined list)
      if (data.niche && !NICHES.includes(data.niche)) {
        setNiche('Other')
        setCustomNiche(data.niche)
      } else {
        setNiche(data.niche || '')
      }

      // Handle platforms - separate custom ones
      if (data.platforms) {
        const known: string[] = []
        const custom: string[] = []
        data.platforms.forEach((p: string) => {
          if (PLATFORMS.includes(p)) known.push(p)
          else custom.push(p)
        })
        setPlatforms(known)
        if (custom.length > 0) setCustomPlatform(custom.join(', '))
      }

      if (data.tone && !TONES.includes(data.tone)) {
        setTone('Other')
        setCustomTone(data.tone)
      } else {
        setTone(data.tone || '')
      }

      if (data.goal && !GOALS.includes(data.goal)) {
        setGoal('Other')
        setCustomGoal(data.goal)
      } else {
        setGoal(data.goal || '')
      }

      setAudience(data.audience || '')
      setRecentTopics(data.recent_topics || '')
      setPreferredTime(data.preferred_time || '08:00')
      setDetailedDescription(data.detailed_description || '')
    }
    setLoading(false)
  }

  function togglePlatform(p: string) {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  function getEffectiveNiche() {
    return niche === 'Other' ? customNiche : niche
  }

  function getEffectiveTone() {
    return tone === 'Other' ? customTone : tone
  }

  function getEffectiveGoal() {
    return goal === 'Other' ? customGoal : goal
  }

  function getEffectivePlatforms() {
    const all = [...platforms]
    if (customPlatform.trim()) {
      customPlatform.split(',').map(p => p.trim()).filter(Boolean).forEach(p => {
        if (!all.includes(p)) all.push(p)
      })
    }
    return all
  }

  function canProceed() {
    switch (step) {
      case 0: return getEffectiveNiche().length > 0
      case 1: return getEffectivePlatforms().length > 0
      case 2: return true // tone & goal are optional
      case 3: return true // description is optional but encouraged
      default: return true
    }
  }

  async function handleSave() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('profiles')
      .update({
        niche: getEffectiveNiche(),
        platforms: getEffectivePlatforms(),
        tone: getEffectiveTone(),
        goal: getEffectiveGoal(),
        audience,
        recent_topics: recentTopics,
        preferred_time: preferredTime,
        detailed_description: detailedDescription,
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

  const inputClasses = "w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 focus:outline-none transition-all duration-300"
  const labelClasses = "block text-sm font-semibold text-gray-300 mb-2"

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden">
      {/* Aurora background */}
      <div className="fixed inset-0 z-0">
        <Aurora
          colorStops={['#5227FF', '#7cff67', '#5227FF']}
          blend={0.5}
          amplitude={0.8}
          speed={0.5}
        />
      </div>
      <div className="fixed inset-0 z-[1] bg-gradient-to-b from-[#050510]/60 via-[#050510]/30 to-[#050510]/60" />

      {/* Nav */}
      <nav className="relative z-10 border-b border-white/[0.06] px-6 py-4 flex justify-between items-center backdrop-blur-xl bg-[#050510]/60">
        <Link href="/dashboard" className="text-xl font-extrabold">
          <span className="bg-gradient-to-r from-[#5227FF] via-[#7cff67] to-[#5227FF] bg-clip-text text-transparent">
            ContentAI
          </span>
        </Link>
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">
          Back to Dashboard
        </Link>
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto px-5 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <BlurText
            text="Build Your Creator Profile"
            className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3"
            delay={80}
          />
          <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
            The more we know about you, the better your daily content ideas will be.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center">
          <StepIndicator currentStep={step} totalSteps={5} />
        </div>

        {/* Success message */}
        {saved && (
          <GlowCard className="mb-6">
            <div className="px-5 py-4 text-center">
              <div className="text-green-400 font-semibold flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Profile saved! Redirecting to dashboard...
              </div>
            </div>
          </GlowCard>
        )}

        {/* Step 0: Niche */}
        {step === 0 && (
          <GlowCard className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">🎯</span>
              <h2 className="text-xl font-bold">What&apos;s your niche?</h2>
            </div>
            <p className="text-gray-400 text-sm mb-5 ml-10">Pick the category that best describes your content.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mb-4">
              {NICHES.map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => { setNiche(n); setCustomNiche('') }}
                  className={`px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 border text-left ${
                    niche === n
                      ? 'border-brand-500 bg-brand-500/15 text-brand-300 shadow-lg shadow-brand-500/10'
                      : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  {n}
                </button>
              ))}
              {/* Other option */}
              <button
                type="button"
                onClick={() => setNiche('Other')}
                className={`px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 border text-left ${
                  niche === 'Other'
                    ? 'border-accent bg-accent/15 text-accent shadow-lg shadow-accent/10'
                    : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                Other...
              </button>
            </div>

            {niche === 'Other' && (
              <div className="mt-3 animate-fadeIn">
                <input
                  type="text"
                  value={customNiche}
                  onChange={(e) => setCustomNiche(e.target.value)}
                  className={inputClasses}
                  placeholder="Describe your niche (e.g., Sustainable Fashion, Crypto Trading, etc.)"
                  autoFocus
                />
              </div>
            )}
          </GlowCard>
        )}

        {/* Step 1: Platforms */}
        {step === 1 && (
          <GlowCard className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">📱</span>
              <h2 className="text-xl font-bold">Where do you post?</h2>
            </div>
            <p className="text-gray-400 text-sm mb-5 ml-10">Select all platforms where you share content.</p>

            <div className="flex flex-wrap gap-2.5 mb-4">
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border ${
                    platforms.includes(p)
                      ? 'border-brand-500 bg-brand-500/15 text-brand-300 shadow-lg shadow-brand-500/10'
                      : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-400 mb-2 block">Use a platform not listed? Add it below:</label>
              <input
                type="text"
                value={customPlatform}
                onChange={(e) => setCustomPlatform(e.target.value)}
                className={inputClasses}
                placeholder="e.g., Threads, Bluesky, Substack (comma separated)"
              />
            </div>
          </GlowCard>
        )}

        {/* Step 2: Tone, Goal & Audience */}
        {step === 2 && (
          <GlowCard className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">🎨</span>
              <h2 className="text-xl font-bold">Your Style & Goals</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6 ml-10">Help us match your unique voice and objectives.</p>

            {/* Tone */}
            <div className="mb-6">
              <label className={labelClasses}>Your tone / voice</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {TONES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setTone(t); setCustomTone('') }}
                    className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
                      tone === t
                        ? 'border-brand-500 bg-brand-500/15 text-brand-300'
                        : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20'
                    }`}
                  >
                    {t}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setTone('Other')}
                  className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
                    tone === 'Other'
                      ? 'border-accent bg-accent/15 text-accent'
                      : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20'
                  }`}
                >
                  Other...
                </button>
              </div>
              {tone === 'Other' && (
                <input
                  type="text"
                  value={customTone}
                  onChange={(e) => setCustomTone(e.target.value)}
                  className={inputClasses + ' mt-2'}
                  placeholder="Describe your unique tone (e.g., Sarcastic but helpful, Chill & relatable)"
                  autoFocus
                />
              )}
            </div>

            {/* Goal */}
            <div className="mb-6">
              <label className={labelClasses}>Your main goal</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {GOALS.map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => { setGoal(g); setCustomGoal('') }}
                    className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
                      goal === g
                        ? 'border-brand-500 bg-brand-500/15 text-brand-300'
                        : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20'
                    }`}
                  >
                    {g}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setGoal('Other')}
                  className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
                    goal === 'Other'
                      ? 'border-accent bg-accent/15 text-accent'
                      : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20'
                  }`}
                >
                  Other...
                </button>
              </div>
              {goal === 'Other' && (
                <input
                  type="text"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  className={inputClasses + ' mt-2'}
                  placeholder="Describe your goal (e.g., Build a paid community, Launch a course)"
                  autoFocus
                />
              )}
            </div>

            {/* Audience */}
            <div>
              <label className={labelClasses}>Describe your target audience</label>
              <textarea
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className={inputClasses + ' min-h-[90px] resize-y'}
                placeholder="e.g., Women aged 25-35 interested in home workouts, busy professionals, college students learning to cook..."
              />
            </div>
          </GlowCard>
        )}

        {/* Step 3: About You (detailed description) */}
        {step === 3 && (
          <GlowCard className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">✨</span>
              <h2 className="text-xl font-bold">Tell Us About Yourself</h2>
            </div>
            <p className="text-gray-400 text-sm mb-4 ml-10">This is the secret sauce — the more detail you provide, the more personalized and creative your daily ideas will be.</p>

            {/* Guidance box */}
            <div className="bg-brand-500/5 border border-brand-500/20 rounded-xl p-4 mb-5">
              <p className="text-sm text-brand-300 font-semibold mb-2">What to include:</p>
              <ul className="text-sm text-gray-400 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-brand-400 mt-0.5">-</span>
                  Your story — what got you into content creation
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-400 mt-0.5">-</span>
                  What makes you different from others in your niche
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-400 mt-0.5">-</span>
                  Your personality traits and communication style
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-400 mt-0.5">-</span>
                  Topics you&apos;re passionate about or want to explore
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-400 mt-0.5">-</span>
                  Any recurring themes, series, or formats you use
                </li>
              </ul>
            </div>

            <textarea
              value={detailedDescription}
              onChange={(e) => setDetailedDescription(e.target.value)}
              className={inputClasses + ' min-h-[180px] resize-y'}
              placeholder="I'm a fitness coach who specializes in helping busy moms get back in shape after pregnancy. I focus on 15-minute workouts that don't require equipment. My style is encouraging and no-nonsense — I share my own journey as a mom of two. I love creating 'workout with me' content and myth-busting posts about fitness. I'm passionate about making fitness accessible and fun, not intimidating..."
            />
            <QualityMeter text={detailedDescription} />

            {/* Recent Topics */}
            <div className="mt-6">
              <label className={labelClasses}>Topics you&apos;ve covered recently</label>
              <textarea
                value={recentTopics}
                onChange={(e) => setRecentTopics(e.target.value)}
                className={inputClasses + ' min-h-[80px] resize-y'}
                placeholder="e.g., morning routine, protein shakes, workout splits... (helps avoid repeat ideas)"
              />
            </div>
          </GlowCard>
        )}

        {/* Step 4: Delivery Time */}
        {step === 4 && (
          <GlowCard className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">🕐</span>
              <h2 className="text-xl font-bold">When Should We Deliver?</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6 ml-10">Choose when you&apos;d like to receive your daily content ideas.</p>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
              {TIME_SLOTS.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setPreferredTime(t.value)}
                  className={`px-3 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 border text-center ${
                    preferredTime === t.value
                      ? 'border-brand-500 bg-brand-500/15 text-brand-300 shadow-lg shadow-brand-500/10'
                      : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Ideas will be ready in your dashboard by this time each day.
            </p>
          </GlowCard>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6 gap-4">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-6 py-3.5 rounded-xl text-sm font-semibold text-gray-400 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="px-8 py-3.5 rounded-xl text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !getEffectiveNiche() || getEffectivePlatforms().length === 0}
              className="px-8 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#5227FF] to-[#6B3FFF] text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-[#5227FF]/30 hover:shadow-[0_0_30px_rgba(82,39,255,0.4)]"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                'Save Profile & Go to Dashboard'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
