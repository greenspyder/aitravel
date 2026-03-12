'use client'

import { motion } from 'framer-motion'
import { Share2, Download } from 'lucide-react'
import { ChatMetrics, Participant, Language, ThemeName } from '@/types/chat'
import { computeRelationshipScore } from '@/lib/metrics/compute-metrics'
import { ts } from '@/lib/i18n'

interface Props {
  metrics: ChatMetrics
  participants: Participant[]
  language: Language
  accentColor: string
  theme: ThemeName
  onShare: () => void
  onDownload: () => void
}

export function SlideEnding({ metrics, participants, language, accentColor, onShare, onDownload }: Props) {
  const score = computeRelationshipScore(metrics)

  const getScoreEmoji = (s: number) => {
    if (s >= 80) return '🔥'
    if (s >= 60) return '💕'
    if (s >= 40) return '😊'
    if (s >= 20) return '🌱'
    return '🌚'
  }

  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'Inseparáveis!'
    if (s >= 60) return 'Muito conectados'
    if (s >= 40) return 'Boa conexão'
    if (s >= 20) return 'Em crescimento'
    return 'Só começando'
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-8">
      <motion.div
        className="text-6xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
      >
        {getScoreEmoji(score)}
      </motion.div>

      <motion.div
        className="text-center"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-white/60 text-base uppercase tracking-widest">{ts(language, 'slide10Title')}</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-7xl font-black" style={{ color: accentColor }}>{score}</span>
          <span className="text-white/40 text-3xl font-bold">/100</span>
        </div>
        <p className="text-white text-xl font-semibold mt-1">{getScoreLabel(score)}</p>
        <p className="text-white/40 text-xs mt-1">{ts(language, 'slide10Sub')}</p>
      </motion.div>

      {/* Score bar */}
      <motion.div
        className="w-full bg-white/10 rounded-full h-3 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: accentColor }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
        />
      </motion.div>

      {/* Action buttons */}
      <motion.div
        className="flex gap-3 w-full"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <button
          onClick={onDownload}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/15 text-white font-semibold hover:bg-white/25 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          {ts(language, 'download')}
        </button>
        <button
          onClick={onShare}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-black font-bold hover:opacity-90 transition-all active:scale-95"
          style={{ background: accentColor }}
        >
          <Share2 className="w-4 h-4" />
          {ts(language, 'share')}
        </button>
      </motion.div>

      <motion.p
        className="text-white/20 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        {ts(language, 'madeWith')}
      </motion.p>
    </div>
  )
}
