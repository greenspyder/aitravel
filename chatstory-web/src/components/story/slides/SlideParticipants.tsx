'use client'

import { motion } from 'framer-motion'
import { ChatMetrics, Participant, Language } from '@/types/chat'
import { ts } from '@/lib/i18n'
import { FloatingOrbs } from '../FloatingOrbs'

interface Props {
  metrics: ChatMetrics
  participants: Participant[]
  language: Language
  accentColor: string
}

function StatCard({
  participant,
  metrics,
  language,
  accentColor,
  delay,
}: {
  participant: Participant
  metrics: ChatMetrics
  language: Language
  accentColor: string
  delay: number
}) {
  const msgs = metrics.messagesByParticipant[participant.name] ?? 0
  const media = metrics.mediaCount[participant.name] ?? 0
  const emojiTotal = metrics.topEmojis.reduce((s, e) => s + e.count, 0)

  const pct = metrics.totalMessages > 0 ? Math.round((msgs / metrics.totalMessages) * 100) : 0

  return (
    <motion.div
      className="flex-1 bg-white/10 rounded-2xl p-4 flex flex-col items-center gap-3"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
    >
      {/* Avatar */}
      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30">
        {participant.photoUrl ? (
          <img src={participant.photoUrl} alt={participant.alias} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl font-bold text-white">{participant.alias.charAt(0)}</span>
        )}
      </div>

      <p className="text-white font-bold text-sm text-center truncate w-full">{participant.alias}</p>

      {/* Stats */}
      <div className="w-full space-y-2">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-white/60">{ts(language, 'slide07Msgs')}</span>
            <span className="text-white font-bold">{msgs.toLocaleString()}</span>
          </div>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: accentColor }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ delay: delay + 0.4, duration: 0.8 }}
            />
          </div>
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-white/60">{ts(language, 'slide07Medias')}</span>
          <span className="text-white font-bold">{media.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  )
}

export function SlideParticipants({ metrics, participants, language, accentColor }: Props) {
  const display = participants.slice(0, 3)

  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-6 px-6 overflow-hidden">
      <FloatingOrbs accentColor={accentColor} />
      <motion.p
        className="text-white text-2xl font-bold text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {ts(language, 'slide07Title')}
      </motion.p>

      <div className="flex gap-3 w-full">
        {display.map((p, i) => (
          <StatCard
            key={p.name}
            participant={p}
            metrics={metrics}
            language={language}
            accentColor={accentColor}
            delay={0.3 + i * 0.15}
          />
        ))}
      </div>
    </div>
  )
}
