'use client'

import { motion } from 'framer-motion'
import { ChatMetrics, Language } from '@/types/chat'
import { ts } from '@/lib/i18n'
import { FloatingOrbs } from '../FloatingOrbs'

interface Props {
  metrics: ChatMetrics
  language: Language
  accentColor: string
}

export function SlideEmojis({ metrics, language, accentColor }: Props) {
  const emojis = metrics.topEmojis.slice(0, 10)

  if (emojis.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white/50 text-lg">Nenhum emoji encontrado 😶</p>
      </div>
    )
  }

  const maxCount = emojis[0]?.count ?? 1

  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-5 px-8 overflow-hidden">
      <FloatingOrbs accentColor={accentColor} />

      {/* Header */}
      <motion.div
        className="text-center z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-white/50 text-xs uppercase tracking-[0.3em]">{ts(language, 'slide05Sub')}</p>
        <p
          className="text-white text-2xl font-black mt-1"
          style={{ textShadow: '0 2px 20px rgba(255,255,255,0.3)' }}
        >
          {ts(language, 'slide05Title')}
        </p>
      </motion.div>

      {/* #1 emoji — huge */}
      {emojis[0] && (
        <motion.div
          className="relative z-10 text-center"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 14, delay: 0.35 }}
        >
          {/* Glow */}
          <motion.div
            className="absolute inset-0 rounded-full blur-2xl"
            style={{ background: accentColor, opacity: 0.2 }}
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.span
            className="relative text-[5rem] leading-none"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))' }}
          >
            {emojis[0].emoji}
          </motion.span>
          <motion.div
            className="inline-block ml-2 px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: `${accentColor}30`, color: accentColor, border: `1px solid ${accentColor}50` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
          >
            ×{emojis[0].count.toLocaleString()}
          </motion.div>
        </motion.div>
      )}

      {/* Grid of remaining 9 */}
      <div className="grid grid-cols-3 gap-2.5 w-full z-10">
        {emojis.slice(1, 10).map(({ emoji, count }, i) => {
          const barWidth = (count / maxCount) * 100
          return (
            <motion.div
              key={emoji}
              className="flex flex-col items-center gap-1 rounded-2xl p-2.5 border border-white/15 backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.07)' }}
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 250, damping: 18, delay: 0.45 + i * 0.07 }}
            >
              <motion.span
                className="text-3xl leading-none"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
              >
                {emoji}
              </motion.span>
              {/* Mini bar */}
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: accentColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ delay: 0.6 + i * 0.07, duration: 0.6 }}
                />
              </div>
              <span className="text-white/40 text-[10px]">×{count}</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
