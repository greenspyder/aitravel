'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { StoryPlayer } from '@/components/story/StoryPlayer'
import { StoryState } from '@/types/chat'

export default function StoryPage() {
  const router = useRouter()
  const [story, setStory] = useState<StoryState | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('chatstory')
      if (!raw) { setError(true); return }
      const parsed = JSON.parse(raw) as StoryState
      setStory(parsed)
    } catch {
      setError(true)
    }
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-white text-xl font-bold">No story found</p>
        <p className="text-white/50">Upload your WhatsApp chat first.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-6 py-3 rounded-2xl bg-white text-black font-bold hover:bg-white/90"
        >
          Go back
        </button>
      </div>
    )
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return <StoryPlayer story={story} onClose={() => router.push('/')} />
}
