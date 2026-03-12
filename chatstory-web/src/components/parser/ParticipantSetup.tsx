'use client'

import { useState, useCallback } from 'react'
import { Camera } from 'lucide-react'
import { Participant, ThemeName, Language } from '@/types/chat'
import { THEMES } from '@/lib/themes'
import { ts } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface ParticipantSetupProps {
  participants: string[]
  theme: ThemeName
  language: Language
  onThemeChange: (t: ThemeName) => void
  onLanguageChange: (l: Language) => void
  onConfirm: (participants: Participant[]) => void
}

export function ParticipantSetup({
  participants,
  theme,
  language,
  onThemeChange,
  onLanguageChange,
  onConfirm,
}: ParticipantSetupProps) {
  const [localParticipants, setLocalParticipants] = useState<Participant[]>(
    participants.map(name => ({ name, alias: name }))
  )

  const updateAlias = (index: number, alias: string) => {
    setLocalParticipants(prev => prev.map((p, i) => i === index ? { ...p, alias } : p))
  }

  const handlePhoto = useCallback((index: number, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const photoUrl = e.target?.result as string
      setLocalParticipants(prev => prev.map((p, i) => i === index ? { ...p, photoUrl } : p))
    }
    reader.readAsDataURL(file)
  }, [])

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div>
        <h2 className="text-white text-xl font-bold">{ts(language, 'setupTitle')}</h2>
        <p className="text-white/60 text-sm mt-1">{ts(language, 'setupSubtitle')}</p>
      </div>

      {/* Participants */}
      <div className="space-y-3">
        {localParticipants.map((p, i) => (
          <div key={p.name} className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
            {/* Photo */}
            <label className="relative cursor-pointer shrink-0">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handlePhoto(i, f) }}
              />
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                {p.photoUrl ? (
                  <img src={p.photoUrl} alt={p.alias} className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-5 h-5 text-white/60" />
                )}
              </div>
            </label>

            {/* Alias input */}
            <div className="flex-1 min-w-0">
              <p className="text-white/50 text-xs truncate">{p.name}</p>
              <input
                type="text"
                value={p.alias}
                onChange={e => updateAlias(i, e.target.value)}
                placeholder={ts(language, 'nickname') as string}
                className="w-full bg-transparent text-white font-medium text-sm outline-none border-b border-white/30 focus:border-white/70 transition-colors pb-0.5"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Theme selector */}
      <div>
        <p className="text-white/60 text-sm mb-2">{ts(language, 'theme')}</p>
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(THEMES) as ThemeName[]).map(t => (
            <button
              key={t}
              onClick={() => onThemeChange(t)}
              className={cn(
                'h-10 rounded-xl border-2 transition-all',
                theme === t ? 'border-white scale-105' : 'border-transparent'
              )}
              style={{ background: `linear-gradient(135deg, ${THEMES[t].from}, ${THEMES[t].to})` }}
              title={THEMES[t].label}
            />
          ))}
        </div>
      </div>

      {/* Language selector */}
      <div>
        <p className="text-white/60 text-sm mb-2">{ts(language, 'language')}</p>
        <div className="flex gap-2">
          {(['pt', 'en', 'es'] as Language[]).map(l => (
            <button
              key={l}
              onClick={() => onLanguageChange(l)}
              className={cn(
                'flex-1 py-2 rounded-xl text-sm font-medium transition-all',
                language === l
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              )}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Confirm button */}
      <button
        onClick={() => onConfirm(localParticipants)}
        className="w-full py-3 rounded-2xl bg-white text-black font-bold text-base hover:bg-white/90 transition-all active:scale-95"
      >
        {ts(language, 'startStory')}
      </button>
    </div>
  )
}
