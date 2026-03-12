'use client'

import { motion } from 'framer-motion'
import { ChatMetrics, Language } from '@/types/chat'
import { ts } from '@/lib/i18n'

interface Props {
  metrics: ChatMetrics
  language: Language
  accentColor: string
}

export function SlideTime({ metrics, language, accentColor }: Props) {
  const peakHour = Object.entries(metrics.messagesByHour)
    .sort((a, b) => b[1] - a[1])[0]
  const hour = parseInt(peakHour?.[0] ?? '20')
  const formattedHour = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`

  // Clock hand angle: 0h = -90deg, 12h = -90deg, etc.
  const hourAngle = ((hour % 12) / 12) * 360 - 90
  const minuteAngle = 0

  // Bar chart for hours
  const maxCount = Math.max(...Object.values(metrics.messagesByHour))
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-8">
      <motion.p
        className="text-white/60 text-base uppercase tracking-widest font-medium text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {ts(language, 'slide04Title')}
      </motion.p>

      {/* Clock SVG */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 150, delay: 0.3 }}
      >
        <svg width="160" height="160" viewBox="0 0 160 160">
          {/* Clock face */}
          <circle cx="80" cy="80" r="76" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          {/* Hour markers */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * 2 * Math.PI - Math.PI / 2
            const x1 = 80 + 62 * Math.cos(angle)
            const y1 = 80 + 62 * Math.sin(angle)
            const x2 = 80 + 72 * Math.cos(angle)
            const y2 = 80 + 72 * Math.sin(angle)
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
          })}
          {/* Hour hand */}
          <motion.line
            x1="80" y1="80"
            x2={80 + 45 * Math.cos((hourAngle * Math.PI) / 180)}
            y2={80 + 45 * Math.sin((hourAngle * Math.PI) / 180)}
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          />
          {/* Minute hand */}
          <motion.line
            x1="80" y1="80"
            x2={80 + 60 * Math.cos(((minuteAngle - 90) * Math.PI) / 180)}
            y2={80 + 60 * Math.sin(((minuteAngle - 90) * Math.PI) / 180)}
            stroke={accentColor}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          />
          <circle cx="80" cy="80" r="5" fill={accentColor} />
        </svg>
      </motion.div>

      <motion.div
        className="text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <p className="text-white text-5xl font-black" style={{ color: accentColor }}>
          {formattedHour}
        </p>
        <p className="text-white/60 text-base mt-1">{ts(language, 'slide04Sub')}</p>
      </motion.div>

      {/* Mini bar chart */}
      <motion.div
        className="flex items-end gap-0.5 h-12 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {hours.map(h => {
          const count = metrics.messagesByHour[h] ?? 0
          const height = maxCount > 0 ? (count / maxCount) * 100 : 0
          return (
            <div key={h} className="flex-1 flex flex-col items-center gap-0">
              <div
                className="w-full rounded-sm transition-all"
                style={{
                  height: `${height}%`,
                  minHeight: 2,
                  background: h === hour ? accentColor : 'rgba(255,255,255,0.2)',
                }}
              />
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
