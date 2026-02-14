'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase-browser'
import { Sparkles, RefreshCw, Check, Bookmark, X, Clock, LogOut, User } from 'lucide-react'
import GlowCard from '@/components/GlowCard'
import BlurText from '@/components/BlurText'

const Aurora = dynamic(() => import('@/components/Aurora'), { ssr: false })

interface Idea {
  id: string
  title: string
  hook: string
  talking_points: string[]
  platform: string
  format: string
  hashtags: string[]
  cta: string
  difficulty: string
  trend_connection?: string
  status: string
  created_at: string
}

interface Profile {
  niche: string
  platforms: string[]
  tone: string
  goal: string
  full_name: string
  subscription_plan: string
}

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [todayIdea, setTodayIdea] = useState<Idea | null>(null)
  const [pastIdeas, setPastIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    // Load profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileData) setProfile(profileData)

    // Check if profile is set up
    if (!profileData?.niche) {
      router.push('/profile')
      return
    }

    // Load ideas
    const { data: ideas } = await supabase
      .from('ideas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30)

    if (ideas && ideas.length > 0) {
      const today = new Date().toDateString()
      const todaysIdea = ideas.find(i => new Date(i.created_at).toDateString() === today)
      if (todaysIdea) setTodayIdea(todaysIdea)
      setPastIdeas(ideas.filter(i => i.id !== todaysIdea?.id))
    }

    setLoading(false)
  }

  async function generateIdea() {
    setGenerating(true)
    try {
      const res = await fetch('/api/generate', { method: 'POST' })
      const data = await res.json()
      if (data.idea) {
        setTodayIdea(data.idea)
      }
    } catch (err) {
      console.error('Generate error:', err)
    }
    setGenerating(false)
  }

  async function updateIdeaStatus(ideaId: string, status: string) {
    await supabase
      .from('ideas')
      .update({ status })
      .eq('id', ideaId)

    if (todayIdea?.id === ideaId) {
      setTodayIdea({ ...todayIdea, status })
    }
    setPastIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, status } : i))
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const diffColors: Record<string, string> = {
    'Quick & Easy': 'bg-[#7cff67]/15 text-[#7cff67]',
    'Medium Effort': 'bg-[#5227FF]/15 text-[#9061ff]',
    'Production Day': 'bg-pink-500/15 text-pink-400',
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 z-0">
          <Aurora
            colorStops={['#5227FF', '#7cff67', '#5227FF']}
            amplitude={0.6}
            blend={0.5}
            speed={0.5}
          />
        </div>
        <div className="text-center relative z-10">
          <div className="w-10 h-10 border-2 border-[#5227FF]/20 border-t-[#5227FF] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0">
        <Aurora
          colorStops={['#5227FF', '#7cff67', '#5227FF']}
          amplitude={0.6}
          blend={0.5}
          speed={0.4}
        />
      </div>
      <div className="fixed inset-0 z-[1] bg-gradient-to-b from-[#050510]/70 via-[#050510]/40 to-[#050510]/70" />

      {/* Top Nav */}
      <nav className="relative z-10 border-b border-white/[0.06] px-6 py-4 flex justify-between items-center backdrop-blur-xl bg-[#050510]/60">
        <div className="text-xl font-extrabold">
          <span className="bg-gradient-to-r from-[#5227FF] via-[#7cff67] to-[#5227FF] bg-clip-text text-transparent">
            ContentAI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs bg-[#5227FF]/15 text-[#9061ff] px-3 py-1 rounded-full font-semibold capitalize border border-[#5227FF]/20">{profile?.subscription_plan || 'Free'}</span>
          <Link href="/profile" className="text-gray-400 hover:text-white transition"><User size={20} /></Link>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white transition"><LogOut size={20} /></button>
        </div>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-5 py-8">
        {/* Welcome */}
        <BlurText
          text={`Hey ${profile?.full_name?.split(' ')[0] || 'Creator'} 👋`}
          className="text-2xl font-bold mb-1"
          delay={80}
        />
        <p className="text-gray-400 mb-8">Here&apos;s your content command center.</p>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-1 rounded-xl mb-8">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'today' ? 'bg-gradient-to-r from-[#5227FF] to-[#6B3FFF] text-white shadow-lg shadow-[#5227FF]/20' : 'text-gray-400 hover:text-white'}`}
          >
            Today&apos;s Idea
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'history' ? 'bg-gradient-to-r from-[#5227FF] to-[#6B3FFF] text-white shadow-lg shadow-[#5227FF]/20' : 'text-gray-400 hover:text-white'}`}
          >
            History ({pastIdeas.length})
          </button>
        </div>

        {/* Today's Idea Tab */}
        {activeTab === 'today' && (
          <>
            {!todayIdea && !generating && (
              <GlowCard className="text-center py-16 px-8">
                <Sparkles className="mx-auto text-[#7cff67] mb-4" size={48} />
                <h2 className="text-xl font-bold mb-2">Ready for today&apos;s idea?</h2>
                <p className="text-gray-400 mb-8">Let&apos;s generate a content idea tailored just for you.</p>
                <button
                  onClick={generateIdea}
                  className="bg-gradient-to-r from-[#5227FF] to-[#6B3FFF] hover:shadow-[0_0_30px_rgba(82,39,255,0.4)] text-white px-10 py-4 rounded-xl font-bold text-lg transition-all inline-flex items-center gap-2"
                >
                  <Sparkles size={20} /> Generate Today&apos;s Idea
                </button>
              </GlowCard>
            )}

            {generating && (
              <GlowCard className="text-center py-16 px-8">
                <div className="w-12 h-12 border-2 border-[#5227FF]/20 border-t-[#5227FF] rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Crafting your personalized idea with Grok AI...</p>
              </GlowCard>
            )}

            {todayIdea && !generating && (
              <GlowCard className="p-8">
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="bg-[#5227FF]/15 text-[#9061ff] px-4 py-1.5 rounded-lg text-xs font-semibold border border-[#5227FF]/20">
                    {todayIdea.platform} · {todayIdea.format}
                  </span>
                  <span className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${diffColors[todayIdea.difficulty] || ''}`}>
                    {todayIdea.difficulty}
                  </span>
                </div>

                <h2 className="text-xl font-bold mb-4 leading-relaxed">{todayIdea.title}</h2>

                <div className="bg-[#7cff67]/5 border-l-[3px] border-[#7cff67] rounded-r-lg px-5 py-4 mb-6">
                  <p className="text-[11px] uppercase tracking-widest text-[#7cff67] font-bold mb-1">Opening Hook</p>
                  <p className="text-green-200/80 italic leading-relaxed">&ldquo;{todayIdea.hook}&rdquo;</p>
                </div>

                <p className="text-[11px] uppercase tracking-widest text-[#9061ff] font-bold mb-3">Talking Points</p>
                <div className="space-y-3 mb-6">
                  {todayIdea.talking_points.map((p, i) => (
                    <p key={i} className="text-gray-300 text-sm leading-relaxed">
                      <span className="text-[#7cff67] mr-2 font-bold">→</span>{p}
                    </p>
                  ))}
                </div>

                <div className="bg-[#7cff67]/5 border-l-[3px] border-[#7cff67]/60 rounded-r-lg px-5 py-4 mb-6">
                  <p className="text-[11px] uppercase tracking-widest text-[#7cff67] font-bold mb-1">Call to Action</p>
                  <p className="text-green-300/80 text-sm">{todayIdea.cta}</p>
                </div>

                {todayIdea.trend_connection && (
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg px-5 py-3 mb-6">
                    <p className="text-[11px] uppercase tracking-widest text-[#FF6B35] font-bold mb-1">Trend Connection</p>
                    <p className="text-gray-400 text-sm">{todayIdea.trend_connection}</p>
                  </div>
                )}

                <p className="text-[11px] uppercase tracking-widest text-[#9061ff] font-bold mb-3">Hashtags</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {todayIdea.hashtags.map(h => (
                    <span key={h} className="bg-white/[0.03] text-gray-500 px-3 py-1.5 rounded-full text-xs border border-white/[0.06]">{h}</span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-6 border-t border-white/[0.06]">
                  <button
                    onClick={() => updateIdeaStatus(todayIdea.id, 'used')}
                    disabled={todayIdea.status === 'used'}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${todayIdea.status === 'used' ? 'bg-[#7cff67]/20 text-[#7cff67]' : 'bg-gradient-to-r from-[#7cff67]/80 to-[#7cff67] text-[#050510] hover:shadow-[0_0_20px_rgba(124,255,103,0.3)]'}`}
                  >
                    <Check size={16} /> {todayIdea.status === 'used' ? 'Used!' : 'Mark as Used'}
                  </button>
                  <button
                    onClick={() => updateIdeaStatus(todayIdea.id, 'saved')}
                    disabled={todayIdea.status === 'saved'}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-white transition border border-white/[0.06]"
                  >
                    <Bookmark size={16} /> {todayIdea.status === 'saved' ? 'Saved!' : 'Save for Later'}
                  </button>
                  <button
                    onClick={() => updateIdeaStatus(todayIdea.id, 'skipped')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-gray-400 transition border border-white/[0.06]"
                  >
                    <X size={16} /> Skip
                  </button>
                  <button
                    onClick={generateIdea}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#5227FF]/10 hover:bg-[#5227FF]/20 text-[#9061ff] transition border border-[#5227FF]/20 ml-auto"
                  >
                    <RefreshCw size={16} /> Regenerate
                  </button>
                </div>
              </GlowCard>
            )}
          </>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <>
            {pastIdeas.length === 0 ? (
              <GlowCard className="text-center py-16 px-8">
                <Clock className="mx-auto text-gray-600 mb-4" size={48} />
                <h2 className="text-xl font-bold mb-2">No history yet</h2>
                <p className="text-gray-400">Your past ideas will appear here.</p>
              </GlowCard>
            ) : (
              <div className="space-y-3">
                {pastIdeas.map(idea => (
                  <GlowCard key={idea.id} className="p-5 hover:translate-y-[-1px] transition-all duration-300">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-sm flex-1">{idea.title}</h3>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ml-3 ${
                        idea.status === 'used' ? 'bg-[#7cff67]/15 text-[#7cff67]' :
                        idea.status === 'saved' ? 'bg-[#5227FF]/15 text-[#9061ff]' :
                        idea.status === 'skipped' ? 'bg-white/5 text-gray-500' :
                        'bg-[#5227FF]/15 text-[#9061ff]'
                      }`}>
                        {idea.status === 'new' ? 'New' : idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex gap-3 text-xs text-gray-500">
                      <span>{idea.platform}</span>
                      <span>{idea.format}</span>
                      <span>{idea.difficulty}</span>
                      <span>{new Date(idea.created_at).toLocaleDateString()}</span>
                    </div>
                  </GlowCard>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
