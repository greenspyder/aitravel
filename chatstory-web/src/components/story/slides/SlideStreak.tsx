'use client'

import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { ChatMetrics, Language } from '@/types/chat'
import { FloatingOrbs } from '../FloatingOrbs'
import { ConfettiBurst } from '../ConfettiBurst'
import { ts } from '@/lib/i18n'

interface Props {
  metrics: ChatMetrics
  language: Language
  accentColor: string
}

export function SlideStreak({ metrics, language, accentColor }: Props) {
  const { longestStreak } = metrics
  const date = new Date(longestStreak.startDate)
  const months = ts(language, 'months') as unknown as string[]
  const dateStr = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`

  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-8 px-8 overflow-hidden">
      <FloatingOrbs accentColor={accentColor} />
      <ConfettiBurst trigger={true} />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
      >
        <Flame className="w-20 h-20" style={{ color: accentColor }} />
      </motion.div>

      <motion.div
        className="text-center"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-9xl font-black" style={{ color: accentColor }}>
          {longestStreak.days}
        </span>
      </motion.div>

      <motion.div
        className="text-center space-y-1"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p className="text-white text-2xl font-bold">{ts(language, 'slide09Title')}</p>
        <p className="text-white/60 text-base">{ts(language, 'slide09Sub')}</p>
        <p className="text-white/40 text-sm mt-2">starting {dateStr}</p>
      </motion.div>

      {/* Flame icons row */}
      <motion.div
        className="flex gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {Array.from({ length: Math.min(longestStreak.days, 10) }, (_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + i * 0.05 }}
          >
            <Flame className="w-5 h-5" style={{ color: accentColor, opacity: 0.7 }} />
          </motion.div>
        ))}
        {longestStreak.days > 10 && (
          <span className="text-white/60 text-sm self-center ml-1">+{longestStreak.days - 10}</span>
        )}
      </motion.div>
    </div>
  )
}
