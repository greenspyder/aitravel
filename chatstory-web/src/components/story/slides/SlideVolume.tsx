'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ChatMetrics, Language } from '@/types/chat'
import { ts } from '@/lib/i18n'

interface Props {
  metrics: ChatMetrics
  language: Language
  accentColor: string
}

export function SlideVolume({ metrics, language, accentColor }: Props) {
  const [displayCount, setDisplayCount] = useState(0)
  const target = metrics.totalMessages

  useEffect(() => {
    const duration = 1800
    const steps = 60
    const increment = target / steps
    let current = 0
    const interval = setInterval(() => {
      current += increment
      if (current >= target) {
        setDisplayCount(target)
        clearInterval(interval)
      } else {
        setDisplayCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(interval)
  }, [target])

  const avgPerDay = Math.round(target / Math.max(metrics.totalDays, 1))

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-8">
      <motion.p
        className="text-white/60 text-lg uppercase tracking-widest font-medium text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {ts(language, 'slide02Sub')}
      </motion.p>

      <motion.div
        className="text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.3 }}
      >
        <span
          className="text-8xl font-black tabular-nums leading-none"
          style={{ color: accentColor }}
        >
          {displayCount.toLocaleString()}
        </span>
      </motion.div>

      <motion.p
        className="text-white text-3xl font-bold text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {ts(language, 'slide02Title')}
      </motion.p>

      <motion.div
        className="flex gap-6 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="text-center px-4 py-3 bg-white/10 rounded-2xl">
          <p className="text-white text-2xl font-bold">{avgPerDay}</p>
          <p className="text-white/50 text-xs">per day</p>
        </div>
        <div className="text-center px-4 py-3 bg-white/10 rounded-2xl">
          <p className="text-white text-2xl font-bold">{metrics.totalDays}</p>
          <p className="text-white/50 text-xs">{ts(language, 'days')}</p>
        </div>
      </motion.div>
    </div>
  )
}
