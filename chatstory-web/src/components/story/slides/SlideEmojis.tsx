'use client'

import { motion } from 'framer-motion'
import { ChatMetrics, Language } from '@/types/chat'
import { ts } from '@/lib/i18n'

interface Props {
  metrics: ChatMetrics
  language: Language
  accentColor: string
}

export function SlideEmojis({ metrics, language, accentColor }: Props) {
  const emojis = metrics.topEmojis.slice(0, 10)
  const maxCount = emojis[0]?.count ?? 1

  if (emojis.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white/50 text-lg">No emojis found in this chat</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-8">
      <motion.p
        className="text-white text-2xl font-bold text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {ts(language, 'slide05Title')}
      </motion.p>
      <motion.p
        className="text-white/60 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {ts(language, 'slide05Sub')}
      </motion.p>

      {/* Top 1 big */}
      {emojis[0] && (
        <motion.div
          className="text-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
        >
          <span className="text-8xl">{emojis[0].emoji}</span>
          <p className="text-white/60 text-sm mt-1">×{emojis[0].count.toLocaleString()}</p>
        </motion.div>
      )}

      {/* Grid of remaining */}
      <div className="grid grid-cols-5 gap-3 w-full">
        {emojis.slice(1).map(({ emoji, count }, i) => (
          <motion.div
            key={emoji}
            className="flex flex-col items-center gap-1 bg-white/10 rounded-xl p-2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.5 + i * 0.06 }}
          >
            <span className="text-3xl">{emoji}</span>
            <span className="text-white/50 text-xs">×{count}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
