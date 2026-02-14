import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ContentAI — AI-Powered Daily Content Ideas for Creators',
  description: 'Never run out of content ideas again. Get personalized, AI-generated content ideas delivered to your inbox every morning.',
  openGraph: {
    title: 'ContentAI — AI-Powered Daily Content Ideas',
    description: 'Personalized content ideas delivered daily. Tailored to your niche, audience, and style.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
