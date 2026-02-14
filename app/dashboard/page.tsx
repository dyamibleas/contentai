'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { Sparkles, RefreshCw, Check, Bookmark, X, Clock, LogOut, User, Settings } from 'lucide-react'

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
    'Quick & Easy': 'bg-green-500/15 text-green-400',
    'Medium Effort': 'bg-blue-500/15 text-blue-400',
    'Production Day': 'bg-pink-500/15 text-pink-400',
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Top Nav */}
      <nav className="border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-extrabold bg-gradient-to-r from-brand-500 to-accent bg-clip-text text-transparent">
          ContentAI
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs bg-brand-500/15 text-brand-400 px-3 py-1 rounded-full font-semibold capitalize">{profile?.subscription_plan || 'Free'}</span>
          <Link href="/profile" className="text-gray-400 hover:text-white transition"><User size={20} /></Link>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white transition"><LogOut size={20} /></button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-5 py-8">
        {/* Welcome */}
        <h1 className="text-2xl font-bold mb-1">Hey {profile?.full_name?.split(' ')[0] || 'Creator'} 👋</h1>
        <p className="text-gray-400 mb-8">Here&apos;s your content command center.</p>

        {/* Tabs */}
        <div className="flex gap-1 bg-dark-100 p-1 rounded-xl mb-8">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition ${activeTab === 'today' ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Today&apos;s Idea
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition ${activeTab === 'history' ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            History ({pastIdeas.length})
          </button>
        </div>

        {/* Today's Idea Tab */}
        {activeTab === 'today' && (
          <>
            {!todayIdea && !generating && (
              <div className="text-center py-16">
                <Sparkles className="mx-auto text-brand-400 mb-4" size={48} />
                <h2 className="text-xl font-bold mb-2">Ready for today&apos;s idea?</h2>
                <p className="text-gray-400 mb-8">Let&apos;s generate a content idea tailored just for you.</p>
                <button
                  onClick={generateIdea}
                  className="bg-brand-500 hover:bg-brand-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition inline-flex items-center gap-2"
                >
                  <Sparkles size={20} /> Generate Today&apos;s Idea
                </button>
              </div>
            )}

            {generating && (
              <div className="text-center py-16">
                <div className="w-12 h-12 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Crafting your personalized idea with Grok AI...</p>
              </div>
            )}

            {todayIdea && !generating && (
              <div className="bg-dark-100 border border-brand-500/20 rounded-2xl p-8 animate-in">
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="bg-brand-500/15 text-brand-400 px-4 py-1.5 rounded-lg text-xs font-semibold">
                    {todayIdea.platform} · {todayIdea.format}
                  </span>
                  <span className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${diffColors[todayIdea.difficulty] || ''}`}>
                    {todayIdea.difficulty}
                  </span>
                </div>

                <h2 className="text-xl font-bold mb-4 leading-relaxed">{todayIdea.title}</h2>

                <div className="bg-accent/10 border-l-[3px] border-accent rounded-r-lg px-5 py-4 mb-6">
                  <p className="text-[11px] uppercase tracking-widest text-accent font-bold mb-1">Opening Hook</p>
                  <p className="text-orange-200 italic leading-relaxed">&ldquo;{todayIdea.hook}&rdquo;</p>
                </div>

                <p className="text-[11px] uppercase tracking-widest text-brand-400 font-bold mb-3">Talking Points</p>
                <div className="space-y-3 mb-6">
                  {todayIdea.talking_points.map((p, i) => (
                    <p key={i} className="text-gray-300 text-sm leading-relaxed">
                      <span className="text-brand-400 mr-2 font-bold">→</span>{p}
                    </p>
                  ))}
                </div>

                <div className="bg-green-500/8 border-l-[3px] border-green-400 rounded-r-lg px-5 py-4 mb-6">
                  <p className="text-[11px] uppercase tracking-widest text-green-400 font-bold mb-1">Call to Action</p>
                  <p className="text-green-300 text-sm">{todayIdea.cta}</p>
                </div>

                {todayIdea.trend_connection && (
                  <div className="bg-white/3 rounded-lg px-5 py-3 mb-6">
                    <p className="text-[11px] uppercase tracking-widest text-accent font-bold mb-1">Trend Connection</p>
                    <p className="text-gray-400 text-sm">{todayIdea.trend_connection}</p>
                  </div>
                )}

                <p className="text-[11px] uppercase tracking-widest text-brand-400 font-bold mb-3">Hashtags</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {todayIdea.hashtags.map(h => (
                    <span key={h} className="bg-white/5 text-gray-500 px-3 py-1.5 rounded-full text-xs">{h}</span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-6 border-t border-white/5">
                  <button
                    onClick={() => updateIdeaStatus(todayIdea.id, 'used')}
                    disabled={todayIdea.status === 'used'}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition ${todayIdea.status === 'used' ? 'bg-green-500/20 text-green-400' : 'bg-accent hover:bg-accent/80 text-white'}`}
                  >
                    <Check size={16} /> {todayIdea.status === 'used' ? 'Used!' : 'Mark as Used'}
                  </button>
                  <button
                    onClick={() => updateIdeaStatus(todayIdea.id, 'saved')}
                    disabled={todayIdea.status === 'saved'}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-white/5 hover:bg-white/10 text-white transition"
                  >
                    <Bookmark size={16} /> {todayIdea.status === 'saved' ? 'Saved!' : 'Save for Later'}
                  </button>
                  <button
                    onClick={() => updateIdeaStatus(todayIdea.id, 'skipped')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-white/5 hover:bg-white/10 text-gray-400 transition"
                  >
                    <X size={16} /> Skip
                  </button>
                  <button
                    onClick={generateIdea}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-white/5 hover:bg-white/10 text-brand-400 transition ml-auto"
                  >
                    <RefreshCw size={16} /> Regenerate
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <>
            {pastIdeas.length === 0 ? (
              <div className="text-center py-16">
                <Clock className="mx-auto text-gray-600 mb-4" size={48} />
                <h2 className="text-xl font-bold mb-2">No history yet</h2>
                <p className="text-gray-400">Your past ideas will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pastIdeas.map(idea => (
                  <div key={idea.id} className="bg-dark-100 border border-white/5 hover:border-brand-500/20 rounded-xl p-5 transition">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-sm flex-1">{idea.title}</h3>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ml-3 ${
                        idea.status === 'used' ? 'bg-green-500/15 text-green-400' :
                        idea.status === 'saved' ? 'bg-blue-500/15 text-blue-400' :
                        idea.status === 'skipped' ? 'bg-white/5 text-gray-500' :
                        'bg-brand-500/15 text-brand-400'
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
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
