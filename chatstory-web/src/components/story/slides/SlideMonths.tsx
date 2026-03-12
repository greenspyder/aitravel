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

export function SlideMonths({ metrics, language, accentColor }: Props) {
  const monthLabels = ts(language, 'months') as unknown as string[]

  const monthEntries = Object.entries(metrics.messagesByMonth)
    .sort((a, b) => a[0].localeCompare(b[0]))

  const maxCount = Math.max(...monthEntries.map(([, c]) => c), 1)
  const peakEntry = monthEntries.find(([, c]) => c === maxCount)
  const peakMonthKey = peakEntry?.[0] ?? ''
  const peakMonth = peakMonthKey
    ? `${monthLabels[parseInt(peakMonthKey.split('-')[1]) - 1]} ${peakMonthKey.split('-')[0]}`
    : ''

  // Show last 12 months max
  const displayEntries = monthEntries.slice(-12)

  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-6 px-6 overflow-hidden">
      <FloatingOrbs accentColor={accentColor} />
      <motion.p
        className="text-white text-2xl font-bold text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {ts(language, 'slide06Title')}
      </motion.p>

      <motion.div
        className="text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 150, delay: 0.3 }}
      >
        <span className="text-6xl font-black" style={{ color: accentColor }}>
          {maxCount.toLocaleString()}
        </span>
        <p className="text-white/60 text-sm mt-1">{ts(language, 'slide06Sub')}</p>
        <p className="text-white font-semibold text-lg mt-0.5">{peakMonth}</p>
      </motion.div>

      {/* Bar chart */}
      <div className="w-full flex items-end gap-1 h-32">
        {displayEntries.map(([key, count], i) => {
          const isPeak = key === peakMonthKey
          const height = (count / maxCount) * 100
          const [year, month] = key.split('-')
          const label = monthLabels[parseInt(month) - 1]

          return (
            <motion.div
              key={key}
              className="flex-1 flex flex-col items-center gap-1"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              style={{ transformOrigin: 'bottom' }}
            >
              <div className="w-full flex flex-col justify-end" style={{ height: '100px' }}>
                <div
                  className="w-full rounded-t-sm transition-all"
                  style={{
                    height: `${height}%`,
                    minHeight: 4,
                    background: isPeak ? accentColor : 'rgba(255,255,255,0.3)',
                  }}
                />
              </div>
              <span className="text-white/40 text-[9px] truncate w-full text-center">{label}</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
