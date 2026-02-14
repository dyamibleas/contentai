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
  'Real Estate', 'Crypto & Web3', 'Mental Health', 'Relationships & Dating',
]

const PLATFORMS = [
  'TikTok', 'Instagram Reels', 'Instagram Carousel', 'Instagram Stories',
  'YouTube Shorts', 'YouTube Long-form', 'X / Twitter', 'LinkedIn',
  'Pinterest', 'Podcast', 'Blog / Newsletter', 'Facebook',
]

const TONES = [
  'Casual & Fun', 'Professional & Polished', 'Educational & Informative',
  'Motivational & Inspiring', 'Humorous & Witty', 'Raw & Authentic',
  'Luxury & Aspirational', 'Friendly & Conversational', 'Bold & Controversial',
  'Storytelling & Narrative', 'Data-Driven & Analytical', 'Empathetic & Supportive',
]

const GOALS = [
  'Grow my followers', 'Drive sales / conversions', 'Build community engagement',
  'Land brand deals', 'Establish thought leadership', 'Grow email list',
  'Promote my product/service', 'Build a personal brand', 'Monetize with courses/coaching',
  'Go viral regularly', 'Network with other creators', 'Launch a business',
]

const CONTENT_FORMATS = [
  'Talking head videos', 'Voiceover with B-roll', 'Screen recordings / tutorials',
  'Photo carousels', 'Text-based posts', 'Skits & comedy', 'Day-in-the-life vlogs',
  'Interviews & collabs', 'Live streams', 'Infographics', 'Before & after',
  'Listicles / Top 10s', 'Hot takes & opinions', 'Product reviews',
]

const POSTING_FREQUENCIES = [
  { label: 'Daily', value: 'daily' },
  { label: 'Every other day', value: 'every_other_day' },
  { label: '3-4 times/week', value: '3-4_per_week' },
  { label: '1-2 times/week', value: '1-2_per_week' },
  { label: 'A few times/month', value: 'few_per_month' },
  { label: 'Just starting out', value: 'just_starting' },
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

// Step tracker
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
            i < currentStep
              ? 'bg-[#5227FF] text-white shadow-lg shadow-[#5227FF]/30'
              : i === currentStep
              ? 'bg-[#5227FF]/20 text-[#9061ff] border-2 border-[#5227FF] shadow-lg shadow-[#5227FF]/20'
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
            <div className={`w-6 h-0.5 transition-all duration-500 ${
              i < currentStep ? 'bg-[#5227FF]' : 'bg-white/10'
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

  if (length > 400) { level = 4; label = 'Incredible! Your AI will know you deeply'; color = 'bg-[#7cff67]' }
  else if (length > 250) { level = 3; label = 'Great detail — keep going!'; color = 'bg-[#5227FF]' }
  else if (length > 120) { level = 2; label = 'Good start'; color = 'bg-yellow-500' }
  else if (length > 30) { level = 1; label = 'Keep going...'; color = 'bg-orange-500' }

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-500">Description quality</span>
        <span className={`text-xs font-semibold ${
          level >= 3 ? 'text-[#7cff67]' : level >= 2 ? 'text-[#9061ff]' : 'text-gray-400'
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

// Multi-select toggle helper
function toggleArray(arr: string[], item: string): string[] {
  return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]
}

export default function ProfilePage() {
  const [step, setStep] = useState(0)
  // Multi-select arrays
  const [niches, setNiches] = useState<string[]>([])
  const [customNiche, setCustomNiche] = useState('')
  const [platforms, setPlatforms] = useState<string[]>([])
  const [customPlatform, setCustomPlatform] = useState('')
  const [tones, setTones] = useState<string[]>([])
  const [customTone, setCustomTone] = useState('')
  const [goals, setGoals] = useState<string[]>([])
  const [customGoal, setCustomGoal] = useState('')
  const [contentFormats, setContentFormats] = useState<string[]>([])
  const [customFormat, setCustomFormat] = useState('')
  // Text fields
  const [audience, setAudience] = useState('')
  const [recentTopics, setRecentTopics] = useState('')
  const [preferredTime, setPreferredTime] = useState('08:00')
  const [detailedDescription, setDetailedDescription] = useState('')
  const [postingFrequency, setPostingFrequency] = useState('')
  const [brandValues, setBrandValues] = useState('')
  const [competitors, setCompetitors] = useState('')
  // UI state
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showOtherNiche, setShowOtherNiche] = useState(false)
  const [showOtherTone, setShowOtherTone] = useState(false)
  const [showOtherGoal, setShowOtherGoal] = useState(false)
  const [showOtherFormat, setShowOtherFormat] = useState(false)
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
      // Handle niches - could be old string or new array
      if (data.niches && Array.isArray(data.niches)) {
        const known: string[] = []
        const custom: string[] = []
        data.niches.forEach((n: string) => {
          if (NICHES.includes(n)) known.push(n)
          else custom.push(n)
        })
        setNiches(known)
        if (custom.length > 0) { setCustomNiche(custom.join(', ')); setShowOtherNiche(true) }
      } else if (data.niche) {
        // Backwards compat: old single niche field
        if (NICHES.includes(data.niche)) setNiches([data.niche])
        else { setCustomNiche(data.niche); setShowOtherNiche(true) }
      }

      // Platforms
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

      // Tones - could be old string or new array
      if (data.tones && Array.isArray(data.tones)) {
        const known: string[] = []
        const custom: string[] = []
        data.tones.forEach((t: string) => {
          if (TONES.includes(t)) known.push(t)
          else custom.push(t)
        })
        setTones(known)
        if (custom.length > 0) { setCustomTone(custom.join(', ')); setShowOtherTone(true) }
      } else if (data.tone) {
        if (TONES.includes(data.tone)) setTones([data.tone])
        else { setCustomTone(data.tone); setShowOtherTone(true) }
      }

      // Goals - could be old string or new array
      if (data.goals && Array.isArray(data.goals)) {
        const known: string[] = []
        const custom: string[] = []
        data.goals.forEach((g: string) => {
          if (GOALS.includes(g)) known.push(g)
          else custom.push(g)
        })
        setGoals(known)
        if (custom.length > 0) { setCustomGoal(custom.join(', ')); setShowOtherGoal(true) }
      } else if (data.goal) {
        if (GOALS.includes(data.goal)) setGoals([data.goal])
        else { setCustomGoal(data.goal); setShowOtherGoal(true) }
      }

      // Content formats
      if (data.content_formats && Array.isArray(data.content_formats)) {
        const known: string[] = []
        const custom: string[] = []
        data.content_formats.forEach((f: string) => {
          if (CONTENT_FORMATS.includes(f)) known.push(f)
          else custom.push(f)
        })
        setContentFormats(known)
        if (custom.length > 0) { setCustomFormat(custom.join(', ')); setShowOtherFormat(true) }
      }

      setAudience(data.audience || '')
      setRecentTopics(data.recent_topics || '')
      setPreferredTime(data.preferred_time || '08:00')
      setDetailedDescription(data.detailed_description || '')
      setPostingFrequency(data.posting_frequency || '')
      setBrandValues(data.brand_values || '')
      setCompetitors(data.competitors || '')
    }
    setLoading(false)
  }

  function getEffectiveNiches() {
    const all = [...niches]
    if (customNiche.trim()) {
      customNiche.split(',').map(n => n.trim()).filter(Boolean).forEach(n => {
        if (!all.includes(n)) all.push(n)
      })
    }
    return all
  }

  function getEffectiveTones() {
    const all = [...tones]
    if (customTone.trim()) {
      customTone.split(',').map(t => t.trim()).filter(Boolean).forEach(t => {
        if (!all.includes(t)) all.push(t)
      })
    }
    return all
  }

  function getEffectiveGoals() {
    const all = [...goals]
    if (customGoal.trim()) {
      customGoal.split(',').map(g => g.trim()).filter(Boolean).forEach(g => {
        if (!all.includes(g)) all.push(g)
      })
    }
    return all
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

  function getEffectiveFormats() {
    const all = [...contentFormats]
    if (customFormat.trim()) {
      customFormat.split(',').map(f => f.trim()).filter(Boolean).forEach(f => {
        if (!all.includes(f)) all.push(f)
      })
    }
    return all
  }

  function canProceed() {
    switch (step) {
      case 0: return getEffectiveNiches().length > 0
      case 1: return getEffectivePlatforms().length > 0
      case 2: return true
      case 3: return true
      case 4: return true
      case 5: return true
      default: return true
    }
  }

  async function handleSave() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const effectiveNiches = getEffectiveNiches()

    await supabase
      .from('profiles')
      .update({
        niche: effectiveNiches[0] || '',
        niches: effectiveNiches,
        platforms: getEffectivePlatforms(),
        tone: getEffectiveTones()[0] || '',
        tones: getEffectiveTones(),
        goal: getEffectiveGoals()[0] || '',
        goals: getEffectiveGoals(),
        content_formats: getEffectiveFormats(),
        audience,
        recent_topics: recentTopics,
        preferred_time: preferredTime,
        detailed_description: detailedDescription,
        posting_frequency: postingFrequency,
        brand_values: brandValues,
        competitors,
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
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#5227FF]/20 border-t-[#5227FF] rounded-full animate-spin" />
      </div>
    )
  }

  const inputClasses = "w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 focus:border-[#5227FF] focus:ring-1 focus:ring-[#5227FF]/30 focus:outline-none transition-all duration-300"
  const labelClasses = "block text-sm font-semibold text-gray-300 mb-2"
  const selectedBtn = 'border-[#5227FF] bg-[#5227FF]/15 text-[#9061ff] shadow-lg shadow-[#5227FF]/10'
  const unselectedBtn = 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20 hover:bg-white/[0.04]'
  const otherSelectedBtn = 'border-[#7cff67] bg-[#7cff67]/10 text-[#7cff67] shadow-lg shadow-[#7cff67]/10'

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
            The more detail you give us, the more personalized and powerful your daily ideas will be.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center">
          <StepIndicator currentStep={step} totalSteps={7} />
        </div>

        {/* Success message */}
        {saved && (
          <GlowCard className="mb-6">
            <div className="px-5 py-4 text-center">
              <div className="text-[#7cff67] font-semibold flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Profile saved! Redirecting to dashboard...
              </div>
            </div>
          </GlowCard>
        )}

        {/* Step 0: Niches (MULTI-SELECT) */}
        {step === 0 && (
          <GlowCard className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">🎯</span>
              <h2 className="text-xl font-bold">What are your niches?</h2>
            </div>
            <p className="text-gray-400 text-sm mb-2 ml-10">Select all that apply — most creators cover multiple areas.</p>
            {niches.length > 0 && (
              <p className="text-[#7cff67] text-xs font-semibold mb-4 ml-10">{niches.length} selected</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mb-4">
              {NICHES.map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNiches(toggleArray(niches, n))}
                  className={`px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 border text-left ${
                    niches.includes(n) ? selectedBtn : unselectedBtn
                  }`}
                >
                  {niches.includes(n) && <span className="mr-1">✓</span>}
                  {n}
                </button>
              ))}
              {/* Other option */}
              <button
                type="button"
                onClick={() => setShowOtherNiche(!showOtherNiche)}
                className={`px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 border text-left ${
                  showOtherNiche ? otherSelectedBtn : unselectedBtn
                }`}
              >
                {showOtherNiche && <span className="mr-1">✓</span>}
                Other...
              </button>
            </div>

            {showOtherNiche && (
              <div className="mt-3 animate-fadeIn">
                <input
                  type="text"
                  value={customNiche}
                  onChange={(e) => setCustomNiche(e.target.value)}
                  className={inputClasses}
                  placeholder="Add your own niches (comma separated, e.g., Sustainable Fashion, Crypto Trading)"
                  autoFocus
                />
              </div>
            )}
          </GlowCard>
        )}

        {/* Step 1: Platforms (MULTI-SELECT) */}
        {step === 1 && (
          <GlowCard className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">📱</span>
              <h2 className="text-xl font-bold">Where do you post?</h2>
            </div>
            <p className="text-gray-400 text-sm mb-2 ml-10">Select every platform you create content for.</p>
            {platforms.length > 0 && (
              <p className="text-[#7cff67] text-xs font-semibold mb-4 ml-10">{platforms.length} selected</p>
            )}

            <div className="flex flex-wrap gap-2.5 mb-4">
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatforms(toggleArray(platforms, p))}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border ${
                    platforms.includes(p) ? selectedBtn : unselectedBtn
                  }`}
                >
                  {platforms.includes(p) && <span className="mr-1">✓</span>}
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

        {/* Step 2: Content Formats (MULTI-SELECT) */}
        {step === 2 && (
          <GlowCard className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">🎬</span>
              <h2 className="text-xl font-bold">What formats do you create?</h2>
            </div>
            <p className="text-gray-400 text-sm mb-2 ml-10">Select all content formats you use or want to try.</p>
            {contentFormats.length > 0 && (
              <p className="text-[#7cff67] text-xs font-semibold mb-4 ml-10">{contentFormats.length} selected</p>
            )}

            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {CONTENT_FORMATS.map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setContentFormats(toggleArray(contentFormats, f))}
                  className={`px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 border text-left ${
                    contentFormats.includes(f) ? selectedBtn : unselectedBtn
                  }`}
                >
                  {contentFormats.includes(f) && <span className="mr-1">✓</span>}
                  {f}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowOtherFormat(!showOtherFormat)}
                className={`px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 border text-left ${
                  showOtherFormat ? otherSelectedBtn : unselectedBtn
                }`}
              >
                {showOtherFormat && <span className="mr-1">✓</span>}
                Other...
              </button>
            </div>

            {showOtherFormat && (
              <div className="mt-3 animate-fadeIn">
                <input
                  type="text"
                  value={customFormat}
                  onChange={(e) => setCustomFormat(e.target.value)}
                  className={inputClasses}
                  placeholder="Add your own formats (comma separated)"
                  autoFocus
                />
              </div>
            )}

            {/* Posting frequency */}
            <div className="mt-6">
              <label className={labelClasses}>How often do you post?</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                {POSTING_FREQUENCIES.map(f => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setPostingFrequency(f.value)}
                    className={`px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 border text-center ${
                      postingFrequency === f.value ? selectedBtn : unselectedBtn
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </GlowCard>
        )}

        {/* Step 3: Tone & Goals (BOTH MULTI-SELECT) */}
        {step === 3 && (
          <GlowCard className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">🎨</span>
              <h2 className="text-xl font-bold">Your Style & Goals</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6 ml-10">Select all that describe your voice and what you want to achieve.</p>

            {/* Tones (MULTI) */}
            <div className="mb-6">
              <label className={labelClasses}>
                Your tone / voice
                {tones.length > 0 && <span className="text-[#7cff67] ml-2">({tones.length} selected)</span>}
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {TONES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTones(toggleArray(tones, t))}
                    className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
                      tones.includes(t) ? selectedBtn : unselectedBtn
                    }`}
                  >
                    {tones.includes(t) && <span className="mr-1">✓</span>}
                    {t}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowOtherTone(!showOtherTone)}
                  className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
                    showOtherTone ? otherSelectedBtn : unselectedBtn
                  }`}
                >
                  {showOtherTone && <span className="mr-1">✓</span>}
                  Other...
                </button>
              </div>
              {showOtherTone && (
                <input
                  type="text"
                  value={customTone}
                  onChange={(e) => setCustomTone(e.target.value)}
                  className={inputClasses + ' mt-2'}
                  placeholder="Describe your unique tone (comma separated for multiple)"
                  autoFocus
                />
              )}
            </div>

            {/* Goals (MULTI) */}
            <div className="mb-6">
              <label className={labelClasses}>
                Your goals
                {goals.length > 0 && <span className="text-[#7cff67] ml-2">({goals.length} selected)</span>}
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {GOALS.map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGoals(toggleArray(goals, g))}
                    className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
                      goals.includes(g) ? selectedBtn : unselectedBtn
                    }`}
                  >
                    {goals.includes(g) && <span className="mr-1">✓</span>}
                    {g}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowOtherGoal(!showOtherGoal)}
                  className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
                    showOtherGoal ? otherSelectedBtn : unselectedBtn
                  }`}
                >
                  {showOtherGoal && <span className="mr-1">✓</span>}
                  Other...
                </button>
              </div>
              {showOtherGoal && (
                <input
                  type="text"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  className={inputClasses + ' mt-2'}
                  placeholder="Describe your goals (comma separated for multiple)"
                  autoFocus
                />
              )}
            </div>
          </GlowCard>
        )}

        {/* Step 4: Audience & Competitors */}
        {step === 4 && (
          <GlowCard className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">👥</span>
              <h2 className="text-xl font-bold">Your Audience & Market</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6 ml-10">Help us understand who you&apos;re creating for and who inspires you.</p>

            <div className="mb-6">
              <label className={labelClasses}>Describe your target audience in detail</label>
              <textarea
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className={inputClasses + ' min-h-[110px] resize-y'}
                placeholder="Be specific! e.g., Women aged 25-35 who are new moms interested in quick home workouts. They have limited time, usually watch content during nap time or late at night. They're motivated but overwhelmed..."
              />
            </div>

            <div className="mb-6">
              <label className={labelClasses}>Creators or brands you admire / compete with</label>
              <textarea
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
                className={inputClasses + ' min-h-[80px] resize-y'}
                placeholder="e.g., @kayla_itsines, @blogilates, Peloton — I like how they make fitness feel fun and achievable. I want to be more raw and real compared to their polished style."
              />
            </div>

            <div>
              <label className={labelClasses}>Your brand values & what you stand for</label>
              <textarea
                value={brandValues}
                onChange={(e) => setBrandValues(e.target.value)}
                className={inputClasses + ' min-h-[80px] resize-y'}
                placeholder="e.g., Authenticity over perfection. Making fitness accessible. Body positivity. No gatekeeping — sharing everything I learn. Community over competition."
              />
            </div>
          </GlowCard>
        )}

        {/* Step 5: About You (detailed description) */}
        {step === 5 && (
          <GlowCard className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">✨</span>
              <h2 className="text-xl font-bold">Tell Us Everything About You</h2>
            </div>
            <p className="text-gray-400 text-sm mb-4 ml-10">This is the secret sauce — the more detail you provide, the more personalized and creative your daily ideas will be.</p>

            {/* Guidance box */}
            <div className="bg-[#5227FF]/5 border border-[#5227FF]/20 rounded-xl p-4 mb-5">
              <p className="text-sm text-[#9061ff] font-semibold mb-2">What to include for the best results:</p>
              <ul className="text-sm text-gray-400 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-[#7cff67] mt-0.5">→</span>
                  Your origin story — what got you into content creation and why
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7cff67] mt-0.5">→</span>
                  What makes you unique — your secret sauce, your angle, your &quot;thing&quot;
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7cff67] mt-0.5">→</span>
                  Your personality — are you energetic? Calm? Sarcastic? Nerdy? Motivational?
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7cff67] mt-0.5">→</span>
                  Topics you&apos;re passionate about and want to talk about more
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7cff67] mt-0.5">→</span>
                  Recurring themes, series, or content pillars you use
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7cff67] mt-0.5">→</span>
                  What your followers love most about your content
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7cff67] mt-0.5">→</span>
                  Any catchphrases, inside jokes, or signature elements
                </li>
              </ul>
            </div>

            <textarea
              value={detailedDescription}
              onChange={(e) => setDetailedDescription(e.target.value)}
              className={inputClasses + ' min-h-[200px] resize-y'}
              placeholder="I'm a fitness coach who specializes in helping busy moms get back in shape after pregnancy. I focus on 15-minute workouts that don't require equipment. My style is encouraging and no-nonsense — I share my own journey as a mom of two. I love creating 'workout with me' content and myth-busting posts about fitness. My followers love my 'real talk' segments where I share the struggles of balancing fitness and motherhood. I always sign off with 'You've got this, mama!' I'm passionate about making fitness accessible and fun, not intimidating. I never promote crash diets or unrealistic body standards..."
            />
            <QualityMeter text={detailedDescription} />

            {/* Recent Topics */}
            <div className="mt-6">
              <label className={labelClasses}>Topics you&apos;ve covered recently (helps us avoid repeats)</label>
              <textarea
                value={recentTopics}
                onChange={(e) => setRecentTopics(e.target.value)}
                className={inputClasses + ' min-h-[80px] resize-y'}
                placeholder="e.g., morning routine, protein shakes, workout splits, postpartum recovery tips, meal prep for busy moms..."
              />
            </div>
          </GlowCard>
        )}

        {/* Step 6: Delivery Time */}
        {step === 6 && (
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
                    preferredTime === t.value ? selectedBtn : unselectedBtn
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

          {step < 6 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="px-8 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#5227FF] to-[#6B3FFF] text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-[#5227FF]/20 hover:shadow-[0_0_30px_rgba(82,39,255,0.4)]"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || getEffectiveNiches().length === 0 || getEffectivePlatforms().length === 0}
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
