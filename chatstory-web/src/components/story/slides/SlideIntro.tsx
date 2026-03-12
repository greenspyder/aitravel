'use client'

import { motion } from 'framer-motion'
import { ChatMetrics, Participant, Language } from '@/types/chat'
import { ts } from '@/lib/i18n'

interface Props {
  metrics: ChatMetrics
  participants: Participant[]
  language: Language
  accentColor: string
}

export function SlideIntro({ metrics, participants, language, accentColor }: Props) {
  const date = new Date(metrics.firstMessage.date)
  const months = t(language, 'months') as unknown as string[]
  const dateStr = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`

  function t(lang: Language, key: Parameters<typeof ts>[1]) {
    return ts(lang, key)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-8">
      {/* Avatars */}
      <motion.div
        className="flex items-center gap-0"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
      >
        {participants.slice(0, 2).map((p, i) => (
          <div
            key={p.name}
            className="w-24 h-24 rounded-full border-4 border-white/30 overflow-hidden bg-white/20 flex items-center justify-center"
            style={{ marginLeft: i > 0 ? '-12px' : 0, zIndex: i > 0 ? 1 : 2 }}
          >
            {p.photoUrl ? (
              <img src={p.photoUrl} alt={p.alias} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-white">
                {p.alias.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        ))}
        {participants.length > 2 && (
          <div className="w-24 h-24 rounded-full border-4 border-white/30 bg-white/20 flex items-center justify-center -ml-3">
            <span className="text-white font-bold">+{participants.length - 2}</span>
          </div>
        )}
      </motion.div>

      {/* Names */}
      <motion.div
        className="text-center"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h1 className="text-white text-4xl font-black tracking-tight leading-tight">
          {participants.slice(0, 2).map(p => p.alias).join(' & ')}
          {participants.length > 2 && ` +${participants.length - 2}`}
        </h1>
      </motion.div>

      {/* Title + date */}
      <motion.div
        className="text-center space-y-1"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-white/60 text-lg uppercase tracking-widest font-medium">
          {t(language, 'slide01Title')}
        </p>
        <p className="text-white/50 text-base">{t(language, 'slide01Sub')}</p>
        <p className="text-white text-2xl font-bold" style={{ color: accentColor }}>
          {dateStr}
        </p>
      </motion.div>

      {/* Total days badge */}
      <motion.div
        className="px-6 py-2 rounded-full bg-white/10 border border-white/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <span className="text-white font-medium">
          {metrics.totalDays} {t(language, 'days')}
        </span>
      </motion.div>
    </div>
  )
}
