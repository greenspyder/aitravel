'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Share2, Download } from 'lucide-react'
import { ChatMetrics, Participant, Language, ThemeName } from '@/types/chat'
import { computeRelationshipScore } from '@/lib/metrics/compute-metrics'
import { ts } from '@/lib/i18n'
import { FloatingOrbs } from '../FloatingOrbs'
import { ConfettiBurst } from '../ConfettiBurst'
import { Sparkles } from '../Sparkles'

interface Props {
  metrics: ChatMetrics
  participants: Participant[]
  language: Language
  accentColor: string
  theme: ThemeName
  onShare: () => void
  onDownload: () => void
}

const SCORE_LABELS = [
  { min: 80, label: 'Inseparáveis', emoji: '🔥' },
  { min: 60, label: 'Muito conectados', emoji: '💕' },
  { min: 40, label: 'Boa conexão', emoji: '😊' },
  { min: 20, label: 'Em crescimento', emoji: '🌱' },
  { min: 0,  label: 'Só começando',   emoji: '🌙' },
]

function getScoreInfo(score: number) {
  return SCORE_LABELS.find(l => score >= l.min) ?? SCORE_LABELS[SCORE_LABELS.length - 1]
}

interface StatItem {
  emoji: string
  label: string
  value: string
}

export function SlideEnding({ metrics, participants, language, accentColor, onShare, onDownload }: Props) {
  const score = computeRelationshipScore(metrics)
  const scoreInfo = getScoreInfo(score)
  const [visibleStats, setVisibleStats] = useState(0)
  const [scoreVisible, setScoreVisible] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [buttonsVisible, setButtonsVisible] = useState(false)

  const topSender = Object.entries(metrics.messagesByParticipant).sort((a, b) => b[1] - a[1])[0]
  const topSenderAlias = participants.find(p => p.name === topSender?.[0])?.alias ?? topSender?.[0] ?? '?'
  const topEmoji = metrics.topEmojis[0]?.emoji ?? '💬'

  const peakHour = Object.entries(metrics.messagesByHour).sort((a, b) => b[1] - a[1])[0]
  const hour = parseInt(peakHour?.[0] ?? '20')
  const formattedHour = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`

  const date = new Date(metrics.firstMessage.date)
  const months = ts(language, 'months') as unknown as string[]
  const dateStr = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`

  const stats: StatItem[] = [
    { emoji: '💬', label: 'mensagens',        value: metrics.totalMessages.toLocaleString() },
    { emoji: '📅', label: 'dias juntos',       value: String(metrics.totalDays) },
    { emoji: '🔥', label: 'streak recorde',   value: `${metrics.longestStreak.days} dias` },
    { emoji: '⏰', label: 'horário favorito', value: formattedHour },
    { emoji: topEmoji, label: 'emoji favorito', value: `×${metrics.topEmojis[0]?.count ?? 0}` },
    { emoji: '🏆', label: 'mais ativo',        value: topSenderAlias },
    { emoji: '📆', label: 'desde',             value: dateStr },
  ]

  // Cascade reveal
  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      i++
      setVisibleStats(i)
      if (i >= stats.length) {
        clearInterval(timer)
        setTimeout(() => {
          setScoreVisible(true)
          setConfetti(true)
        }, 400)
        setTimeout(() => setButtonsVisible(true), 1200)
      }
    }, 280)
    return () => clearInterval(timer)
  }, [stats.length])

  const [scoreDisplay, setScoreDisplay] = useState(0)
  useEffect(() => {
    if (!scoreVisible) return
    let n = 0
    const interval = setInterval(() => {
      n += 2
      if (n >= score) { setScoreDisplay(score); clearInterval(interval) }
      else setScoreDisplay(n)
    }, 25)
    return () => clearInterval(interval)
  }, [scoreVisible, score])

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      <FloatingOrbs accentColor={accentColor} />
      <Sparkles color={accentColor} count={14} />
      <ConfettiBurst trigger={confetti} />

      {/* Title */}
      <motion.div
        className="pt-10 pb-4 px-6 text-center z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="text-white/40 text-xs uppercase tracking-[0.3em]">ChatStory Recap</p>
        <h2
          className="text-white text-2xl font-black mt-1"
          style={{ textShadow: `0 0 30px ${accentColor}60` }}
        >
          {participants.slice(0, 2).map(p => p.alias).join(' & ')}
        </h2>
      </motion.div>

      {/* Stats list */}
      <div className="flex-1 px-5 overflow-y-auto space-y-2 z-10 pb-2">
        {stats.map((stat, i) => (
          <AnimatePresence key={stat.label}>
            {visibleStats > i && (
              <motion.div
                className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/15 backdrop-blur-sm"
                style={{ background: `${accentColor}12` }}
                initial={{ x: -50, opacity: 0, scale: 0.9 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 50, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              >
                <motion.span
                  className="text-2xl shrink-0"
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }}
                >
                  {stat.emoji}
                </motion.span>
                <div className="flex-1 min-w-0">
                  <p className="text-white/50 text-[10px] uppercase tracking-wider leading-none">{stat.label}</p>
                  <p
                    className="text-white font-black text-lg leading-tight truncate"
                    style={{ textShadow: `0 0 15px ${accentColor}50` }}
                  >
                    {stat.value}
                  </p>
                </div>
                {/* Accent dot */}
                <motion.div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: accentColor }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        ))}

        {/* Score card */}
        <AnimatePresence>
          {scoreVisible && (
            <motion.div
              className="rounded-2xl p-4 text-center border border-white/20 backdrop-blur-sm"
              style={{ background: `${accentColor}20` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              <p className="text-white/50 text-xs uppercase tracking-[0.2em]">
                {ts(language, 'slide10Title')}
              </p>
              <div className="flex items-baseline justify-center gap-1 my-1">
                <span
                  className="text-5xl font-black tabular-nums"
                  style={{ color: accentColor, textShadow: `0 0 30px ${accentColor}80` }}
                >
                  {scoreDisplay}
                </span>
                <span className="text-white/30 text-2xl">/100</span>
              </div>
              {/* Score bar */}
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mx-2">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${accentColor}, white)` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <motion.p
                className="text-white font-bold text-base mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {scoreInfo.emoji} {scoreInfo.label}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <AnimatePresence>
        {buttonsVisible && (
          <motion.div
            className="px-5 pb-8 pt-3 flex gap-3 z-10"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 250, damping: 22 }}
          >
            <button
              onClick={onDownload}
              onPointerDown={e => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/15 text-white font-bold border border-white/25 hover:bg-white/25 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              {ts(language, 'download')}
            </button>
            <button
              onClick={onShare}
              onPointerDown={e => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black hover:opacity-90 transition-all active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, white)`,
                color: '#000',
                boxShadow: `0 8px 30px ${accentColor}60`,
              }}
            >
              <Share2 className="w-4 h-4" />
              {ts(language, 'share')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Watermark */}
      <p className="text-center text-white/15 text-[10px] pb-2 z-10">{ts(language, 'madeWith')}</p>
    </div>
  )
}
