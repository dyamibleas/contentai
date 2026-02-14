import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { generateContentIdea } from '@/lib/grok'
import { sendDailyIdeaEmail } from '@/lib/email'

// This endpoint is called by a cron job (e.g., Vercel Cron or external service)
// It generates and emails daily ideas to all active subscribers
// Recommended schedule: every day at 7:00 AM UTC

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  try {
    // Get all active subscribers with complete profiles
    const { data: subscribers, error } = await supabase
      .from('profiles')
      .select('*')
      .in('subscription_status', ['active', 'trialing'])
      .not('niche', 'is', null)
      .not('platforms', 'eq', '{}')

    if (error) {
      console.error('Fetch subscribers error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: 'No active subscribers', sent: 0 })
    }

    let sent = 0
    let failed = 0

    for (const subscriber of subscribers) {
      try {
        // Generate personalized idea
        const idea = await generateContentIdea({
          niche: subscriber.niche,
          platforms: subscriber.platforms,
          tone: subscriber.tone,
          goal: subscriber.goal,
          audience: subscriber.audience,
          recent_topics: subscriber.recent_topics,
        })

        // Save to database
        await supabase.from('ideas').insert({
          user_id: subscriber.id,
          title: idea.title,
          hook: idea.hook,
          talking_points: idea.talking_points,
          platform: idea.platform,
          format: idea.format,
          hashtags: idea.hashtags,
          cta: idea.cta,
          difficulty: idea.difficulty,
          trend_connection: idea.trend_connection || null,
          emailed: true,
        })

        // Send email
        await sendDailyIdeaEmail(
          subscriber.email,
          subscriber.full_name || 'Creator',
          idea
        )

        // Update ideas count
        await supabase
          .from('profiles')
          .update({ ideas_generated: (subscriber.ideas_generated || 0) + 1 })
          .eq('id', subscriber.id)

        sent++

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 200))

      } catch (err) {
        console.error(`Failed for ${subscriber.email}:`, err)
        failed++
      }
    }

    return NextResponse.json({
      message: `Daily ideas sent`,
      total: subscribers.length,
      sent,
      failed,
    })

  } catch (error) {
    console.error('Cron error:', error)
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 })
  }
}
