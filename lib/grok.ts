import OpenAI from 'openai'

// xAI/Grok uses an OpenAI-compatible API
const grok = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
})

export interface CreatorProfile {
  niche: string
  platforms: string[]
  tone: string
  goal: string
  audience: string
  recent_topics?: string
}

export interface ContentIdea {
  title: string
  hook: string
  talking_points: string[]
  platform: string
  format: string
  hashtags: string[]
  cta: string
  difficulty: 'Quick & Easy' | 'Medium Effort' | 'Production Day'
  trend_connection?: string
}

export async function generateContentIdea(profile: CreatorProfile): Promise<ContentIdea> {
  const platform = profile.platforms[Math.floor(Math.random() * profile.platforms.length)]

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  const prompt = `You are ContentAI, an expert content strategist for creators and influencers. Generate ONE highly specific, creative, and actionable content idea for today.

CREATOR PROFILE:
- Niche: ${profile.niche}
- Target Platform: ${platform}
- Tone/Voice: ${profile.tone}
- Goal: ${profile.goal}
- Target Audience: ${profile.audience}
${profile.recent_topics ? `- Topics to AVOID (recently covered): ${profile.recent_topics}` : ''}
- Today's Date: ${today}

REQUIREMENTS:
- Make the idea specific and actionable, not generic
- Include a scroll-stopping hook (the first line people see/hear)
- Tie into current trends, seasonal events, or viral formats when possible
- Format the idea for ${platform} specifically
- Include relevant hashtags for the platform
- Vary the difficulty level

Respond in this exact JSON format (no markdown, no code blocks, just raw JSON):
{
  "title": "The content title/concept",
  "hook": "The opening line or visual hook to grab attention",
  "talking_points": ["Point 1", "Point 2", "Point 3", "Point 4"],
  "platform": "${platform}",
  "format": "Specific format for the platform (e.g., '60-second Reel', 'Thread with 8 tweets', '10-slide carousel')",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "cta": "The call to action for the end of the content",
  "difficulty": "Quick & Easy OR Medium Effort OR Production Day",
  "trend_connection": "How this ties to a current trend or event (or null if not applicable)"
}`

  const response = await grok.chat.completions.create({
    model: 'grok-3',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.9,
    max_tokens: 1000,
  })

  const content = response.choices[0]?.message?.content || ''

  try {
    // Parse the JSON response, handling potential markdown code blocks
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const idea: ContentIdea = JSON.parse(cleaned)
    return idea
  } catch (e) {
    // Fallback if JSON parsing fails
    return {
      title: `${profile.niche} Content Idea for Today`,
      hook: "Here's something your audience needs to hear today...",
      talking_points: [
        "Share a personal insight from your experience",
        "Address a common misconception in your niche",
        "Give one actionable tip your audience can use immediately",
        "End with a thought-provoking question"
      ],
      platform,
      format: "Short-form video (60 seconds)",
      hashtags: ["#contentcreator", "#creatortips", `#${profile.niche.toLowerCase().replace(/\s+/g, '')}`],
      cta: "Save this for later and follow for more daily ideas",
      difficulty: "Quick & Easy",
    }
  }
}
