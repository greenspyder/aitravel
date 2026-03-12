'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ChatMetrics, Language } from '@/types/chat'
import { ts } from '@/lib/i18n'
import { FloatingOrbs } from '../FloatingOrbs'
import { ConfettiBurst } from '../ConfettiBurst'
import { Sparkles } from '../Sparkles'

interface Props {
  metrics: ChatMetrics
  language: Language
  accentColor: string
}

export function SlideVolume({ metrics, language, accentColor }: Props) {
  const [displayCount, setDisplayCount] = useState(0)
  const [confetti, setConfetti] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const target = metrics.totalMessages

  useEffect(() => {
    const duration = 2000
    const steps = 80
    const increment = target / steps
    let current = 0
    const interval = setInterval(() => {
      current += increment
      if (current >= target) {
        setDisplayCount(target)
        setConfetti(true)
        setRevealed(true)
        clearInterval(interval)
      } else {
        setDisplayCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(interval)
  }, [target])

  const avgPerDay = Math.round(target / Math.max(metrics.totalDays, 1))

  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-5 px-8 overflow-hidden">
      <FloatingOrbs accentColor={accentColor} />
      <Sparkles color={accentColor} count={8} />
      <ConfettiBurst trigger={confetti} />

      <motion.p
        className="text-white/50 text-xs uppercase tracking-[0.35em] font-medium z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {ts(language, 'slide02Sub')}
      </motion.p>

      {/* Big number */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.3 }}
      >
        <motion.div
          animate={revealed ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {/* Glow ring behind number */}
          <motion.div
            className="absolute inset-0 rounded-full blur-3xl"
            style={{ background: accentColor, opacity: 0.15 }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span
            className="relative text-[5.5rem] sm:text-[7rem] font-black tabular-nums leading-none"
            style={{
              color: accentColor,
              textShadow: `0 0 60px ${accentColor}80, 0 0 120px ${accentColor}40`,
            }}
          >
            {displayCount.toLocaleString()}
          </span>
        </motion.div>
      </motion.div>

      <motion.p
        className="text-white text-3xl font-black text-center z-10"
        style={{ textShadow: '0 2px 20px rgba(255,255,255,0.3)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {ts(language, 'slide02Title')}
      </motion.p>

      {/* Stats row */}
      <motion.div
        className="flex gap-4 z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, type: 'spring' }}
      >
        {[
          { value: avgPerDay, label: 'por dia' },
          { value: metrics.totalDays, label: ts(language, 'days') as string },
          { value: Math.round(target / Math.max(metrics.participants.length, 1)).toLocaleString(), label: 'por pessoa' },
        ].map(({ value, label }) => (
          <div
            key={label}
            className="text-center px-4 py-3 rounded-2xl backdrop-blur-sm border border-white/20"
            style={{ background: `${accentColor}15` }}
          >
            <p className="text-white text-2xl font-black">{value}</p>
            <p className="text-white/50 text-xs uppercase tracking-wider mt-0.5">{label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
