import { Resend } from 'resend'
import { ContentIdea } from './grok'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendDailyIdeaEmail(
  to: string,
  creatorName: string,
  idea: ContentIdea
) {
  const difficultyColors: Record<string, string> = {
    'Quick & Easy': '#4ADE80',
    'Medium Effort': '#60A5FA',
    'Production Day': '#F472B6',
  }

  const diffColor = difficultyColors[idea.difficulty] || '#60A5FA'

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0F0F1A;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="margin:0;font-size:24px;background:linear-gradient(135deg,#6C3CE1,#FF6B35);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">ContentAI</h1>
      <p style="color:#8892A0;font-size:14px;margin-top:4px;">Your daily content idea is ready</p>
    </div>

    <!-- Main Card -->
    <div style="background:#1A1A2E;border:1px solid rgba(108,60,225,0.2);border-radius:16px;padding:32px;">

      <!-- Meta -->
      <div style="margin-bottom:16px;">
        <span style="background:rgba(108,60,225,0.15);color:#6C3CE1;padding:6px 14px;border-radius:8px;font-size:13px;font-weight:600;">${idea.platform} · ${idea.format}</span>
        <span style="background:${diffColor}20;color:${diffColor};padding:6px 14px;border-radius:8px;font-size:13px;font-weight:600;margin-left:8px;">${idea.difficulty}</span>
      </div>

      <!-- Title -->
      <h2 style="color:#FFFFFF;font-size:22px;margin:16px 0;line-height:1.4;">${idea.title}</h2>

      <!-- Hook -->
      <div style="background:rgba(255,107,53,0.08);border-left:3px solid #FF6B35;padding:16px;border-radius:0 8px 8px 0;margin:20px 0;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#FF6B35;font-weight:700;margin-bottom:6px;">Opening Hook</div>
        <p style="color:#FFB088;font-style:italic;font-size:16px;margin:0;line-height:1.5;">"${idea.hook}"</p>
      </div>

      <!-- Talking Points -->
      <div style="margin:20px 0;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#6C3CE1;font-weight:700;margin-bottom:12px;">Talking Points</div>
        ${idea.talking_points.map(p => `
          <div style="padding:8px 0;color:#B8BCC8;font-size:15px;line-height:1.5;">
            <span style="color:#6C3CE1;margin-right:8px;">→</span>${p}
          </div>
        `).join('')}
      </div>

      <!-- CTA -->
      <div style="background:rgba(74,222,128,0.08);border-left:3px solid #4ADE80;padding:14px;border-radius:0 8px 8px 0;margin:20px 0;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#4ADE80;font-weight:700;margin-bottom:6px;">Call to Action</div>
        <p style="color:#4ADE80;font-size:15px;margin:0;">${idea.cta}</p>
      </div>

      <!-- Hashtags -->
      <div style="margin-top:20px;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#6C3CE1;font-weight:700;margin-bottom:10px;">Hashtags</div>
        <p style="color:#8892A0;font-size:14px;margin:0;">${idea.hashtags.join('  ')}</p>
      </div>

      ${idea.trend_connection ? `
      <!-- Trend -->
      <div style="margin-top:20px;padding:12px;background:rgba(255,255,255,0.03);border-radius:8px;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#FF6B35;font-weight:700;margin-bottom:6px;">Trend Connection</div>
        <p style="color:#8892A0;font-size:14px;margin:0;">${idea.trend_connection}</p>
      </div>
      ` : ''}

    </div>

    <!-- Dashboard Link -->
    <div style="text-align:center;margin-top:24px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block;background:#6C3CE1;color:#FFFFFF;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">View in Dashboard</a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:32px;color:#8892A0;font-size:12px;">
      <p>You're receiving this because you signed up for ContentAI.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color:#6C3CE1;text-decoration:none;">Manage preferences</a> · <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe" style="color:#6C3CE1;text-decoration:none;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'ContentAI <ideas@contentai.com>',
    to: [to],
    subject: `Today's Idea: ${idea.title}`,
    html,
  })

  if (error) {
    console.error('Email send error:', error)
    throw error
  }

  return data
}

export async function sendWelcomeEmail(to: string, name: string) {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'ContentAI <ideas@contentai.com>',
    to: [to],
    subject: 'Welcome to ContentAI — your first idea is on the way!',
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0F0F1A;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="margin:0;font-size:24px;color:#6C3CE1;">Welcome to ContentAI!</h1>
    </div>
    <div style="background:#1A1A2E;border-radius:16px;padding:32px;color:#B8BCC8;font-size:15px;line-height:1.7;">
      <p>Hey ${name || 'there'},</p>
      <p>You're all set! Starting tomorrow morning, you'll receive a personalized content idea in your inbox every day.</p>
      <p>Each idea comes with:</p>
      <p style="color:#6C3CE1;">→ A scroll-stopping hook<br>→ Talking points<br>→ Platform-specific format<br>→ Trending hashtags<br>→ A call to action</p>
      <p>Head to your dashboard to complete your creator profile so we can personalize your ideas.</p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/profile" style="display:inline-block;background:#6C3CE1;color:#FFFFFF;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;">Set Up My Profile</a>
      </div>
      <p>Let's create something amazing,<br>The ContentAI Team</p>
    </div>
  </div>
</body>
</html>`,
  })

  if (error) console.error('Welcome email error:', error)
  return data
}
