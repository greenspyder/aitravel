'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquare, Sparkles, Share2, Lock } from 'lucide-react'
import { UploadZone } from '@/components/parser/UploadZone'
import { ParticipantSetup } from '@/components/parser/ParticipantSetup'
import { ParsedChat, Participant, ThemeName, Language, StoryState } from '@/types/chat'
import { computeMetrics } from '@/lib/metrics/compute-metrics'
import { ts } from '@/lib/i18n'

type Step = 'landing' | 'setup'

export default function HomePage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('landing')
  const [parsedChat, setParsedChat] = useState<ParsedChat | null>(null)
  const [theme, setTheme] = useState<ThemeName>('romantic')
  const [language, setLanguage] = useState<Language>('pt')

  const handleParsed = (chat: ParsedChat) => {
    setParsedChat(chat)
    setStep('setup')
  }

  const handleConfirm = (participants: Participant[]) => {
    if (!parsedChat) return
    const metrics = computeMetrics(parsedChat)
    const storyState: StoryState = { metrics, participants, theme, language }
    sessionStorage.setItem('chatstory', JSON.stringify(storyState))
    router.push('/story')
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-white" />
          <span className="text-white font-black text-lg tracking-tight">ChatStory</span>
        </div>
        <div className="flex gap-2">
          {(['pt', 'en', 'es'] as Language[]).map(l => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                language === l ? 'bg-white text-black' : 'text-white/50 hover:text-white'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {step === 'landing' ? (
          <div className="w-full max-w-lg space-y-12">
            {/* Hero */}
            <div className="text-center space-y-4">
              <h1 className="text-white text-5xl font-black leading-tight tracking-tight whitespace-pre-line">
                {ts(language, 'heroTitle')}
              </h1>
              <p className="text-white/60 text-lg leading-relaxed">
                {ts(language, 'heroSubtitle')}
              </p>
            </div>

            {/* Upload zone */}
            <UploadZone onParsed={handleParsed} language={language} />

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Sparkles, label: '10 slides animados' },
                { icon: Share2, label: 'Export para Stories' },
                { icon: Lock, label: '100% privado' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5">
                  <Icon className="w-5 h-5 text-white/60" />
                  <span className="text-white/50 text-xs text-center leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : parsedChat ? (
          <ParticipantSetup
            participants={parsedChat.participants}
            theme={theme}
            language={language}
            onThemeChange={setTheme}
            onLanguageChange={setLanguage}
            onConfirm={handleConfirm}
          />
        ) : null}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-white/20 text-xs">{ts(language, 'madeWith')} · v1.0</p>
      </footer>
    </div>
  )
}
