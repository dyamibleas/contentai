import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { generateContentIdea } from '@/lib/grok'

export async function POST() {
  try {
    const supabase = createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.niche) {
      return NextResponse.json({ error: 'Profile not set up' }, { status: 400 })
    }

    // Check subscription status
    if (!['trialing', 'active'].includes(profile.subscription_status)) {
      return NextResponse.json({ error: 'Subscription inactive' }, { status: 403 })
    }

    // Generate idea using Grok
    const idea = await generateContentIdea({
      niche: profile.niche,
      platforms: profile.platforms,
      tone: profile.tone,
      goal: profile.goal,
      audience: profile.audience,
      recent_topics: profile.recent_topics,
    })

    // Save to database
    const { data: savedIdea, error: saveError } = await supabase
      .from('ideas')
      .insert({
        user_id: user.id,
        title: idea.title,
        hook: idea.hook,
        talking_points: idea.talking_points,
        platform: idea.platform,
        format: idea.format,
        hashtags: idea.hashtags,
        cta: idea.cta,
        difficulty: idea.difficulty,
        trend_connection: idea.trend_connection || null,
      })
      .select()
      .single()

    if (saveError) {
      console.error('Save error:', saveError)
      return NextResponse.json({ error: 'Failed to save idea' }, { status: 500 })
    }

    // Update ideas count
    await supabase
      .from('profiles')
      .update({ ideas_generated: (profile.ideas_generated || 0) + 1 })
      .eq('id', user.id)

    return NextResponse.json({ idea: savedIdea })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Failed to generate idea' }, { status: 500 })
  }
}
