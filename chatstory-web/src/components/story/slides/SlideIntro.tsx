'use client'

import { motion } from 'framer-motion'
import { ChatMetrics, Participant, Language } from '@/types/chat'
import { ts } from '@/lib/i18n'
import { FloatingOrbs } from '../FloatingOrbs'
import { Sparkles } from '../Sparkles'

interface Props {
  metrics: ChatMetrics
  participants: Participant[]
  language: Language
  accentColor: string
}

export function SlideIntro({ metrics, participants, language, accentColor }: Props) {
  const date = new Date(metrics.firstMessage.date)
  const months = ts(language, 'months') as unknown as string[]
  const dateStr = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  const topEmoji = metrics.topEmojis[0]?.emoji ?? '💬'

  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-5 px-8 overflow-hidden">
      <FloatingOrbs accentColor={accentColor} />
      <Sparkles color={accentColor} count={12} />

      {/* Decorative rings */}
      {[340, 440, 540].map((size, i) => (
        <motion.div
          key={size}
          className="absolute rounded-full border border-white/8"
          style={{ width: size, height: size }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 + i * 0.15, ease: 'easeOut', delay: i * 0.1 }}
        />
      ))}

      {/* Avatars */}
      <motion.div
        className="flex items-center relative z-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.3 }}
      >
        {participants.slice(0, 2).map((p, i) => (
          <motion.div
            key={p.name}
            className="w-28 h-28 rounded-full overflow-hidden bg-white/20 flex items-center justify-center shadow-2xl"
            style={{
              marginLeft: i > 0 ? '-16px' : 0,
              zIndex: i > 0 ? 1 : 2,
              border: `4px solid ${accentColor}60`,
              boxShadow: `0 0 30px ${accentColor}40`,
            }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          >
            {p.photoUrl ? (
              <img src={p.photoUrl} alt={p.alias} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-black text-white">{p.alias.charAt(0).toUpperCase()}</span>
            )}
          </motion.div>
        ))}
        {participants.length > 2 && (
          <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center -ml-4 border-4 border-white/30">
            <span className="text-white font-black text-lg">+{participants.length - 2}</span>
          </div>
        )}
      </motion.div>

      {/* Floating top emoji */}
      <motion.div
        className="text-5xl z-10"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.6 }}
        style={{ filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.4))' }}
      >
        {topEmoji}
      </motion.div>

      {/* Names */}
      <motion.h1
        className="text-white text-4xl font-black tracking-tight text-center leading-tight z-10"
        style={{ textShadow: `0 0 40px ${accentColor}80, 0 2px 20px rgba(0,0,0,0.5)` }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.45 }}
      >
        {participants.slice(0, 2).map(p => p.alias).join(' & ')}
        {participants.length > 2 && ` +${participants.length - 2}`}
      </motion.h1>

      {/* Date */}
      <motion.div
        className="text-center z-10 space-y-1"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.65 }}
      >
        <p className="text-white/50 text-xs uppercase tracking-[0.3em]">
          {ts(language, 'slide01Title')} · {ts(language, 'slide01Sub')}
        </p>
        <motion.p
          className="text-xl font-bold"
          style={{ color: accentColor, textShadow: `0 0 20px ${accentColor}80` }}
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 250, delay: 0.85 }}
        >
          {dateStr}
        </motion.p>
      </motion.div>

      {/* Days pill */}
      <motion.div
        className="px-6 py-2 rounded-full backdrop-blur-sm z-10 border border-white/20"
        style={{ background: `${accentColor}20` }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 1 }}
      >
        <span className="text-white font-semibold text-sm">
          {metrics.totalDays} {ts(language, 'days')} juntos 🗓️
        </span>
      </motion.div>
    </div>
  )
}
