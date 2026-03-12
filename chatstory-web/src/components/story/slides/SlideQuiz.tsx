'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { ChatMetrics, Participant, Language } from '@/types/chat'
import { ts } from '@/lib/i18n'
import { FloatingOrbs } from '../FloatingOrbs'
import { ConfettiBurst } from '../ConfettiBurst'

interface Props {
  metrics: ChatMetrics
  participants: Participant[]
  language: Language
  accentColor: string
  onComplete?: () => void // called after reveal delay — StoryPlayer uses this to advance
}

export function SlideQuiz({ metrics, participants, language, accentColor, onComplete }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [confetti, setConfetti] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)

  const topSender = Object.entries(metrics.messagesByParticipant)
    .sort((a, b) => b[1] - a[1])[0]

  const getAlias = (name: string) =>
    participants.find(p => p.name === name)?.alias ?? name

  const isCorrect = selected === topSender?.[0]

  const handleSelect = (name: string) => {
    if (selected) return
    setSelected(name)
    if (name === topSender?.[0]) setConfetti(true)
    // Start 5s countdown then advance
    setCountdown(5)
  }

  // Countdown ticker + auto-advance after 5s
  useEffect(() => {
    if (countdown === null) return
    if (countdown <= 0) {
      onComplete?.()
      return
    }
    const t = setTimeout(() => setCountdown(c => (c ?? 1) - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, onComplete])

  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-6 px-8 overflow-hidden">
      <FloatingOrbs accentColor={accentColor} />
      <ConfettiBurst trigger={confetti} />

      {/* Question */}
      <motion.p
        className="text-white text-2xl font-black text-center z-10 leading-tight"
        style={{ textShadow: '0 2px 20px rgba(255,255,255,0.2)' }}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
      >
        {ts(language, 'slide03Question')}
      </motion.p>

      {/* Options */}
      <div className="w-full space-y-3 z-10">
        {participants.map((p, i) => {
          const isChosen = selected === p.name
          const isTop = p.name === topSender?.[0]
          const showResult = !!selected
          const msgCount = metrics.messagesByParticipant[p.name] ?? 0
          const pct = metrics.totalMessages > 0 ? Math.round((msgCount / metrics.totalMessages) * 100) : 0

          return (
            <motion.button
              key={p.name}
              onClick={() => handleSelect(p.name)}
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 250, damping: 22, delay: 0.3 + i * 0.1 }}
              className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left relative overflow-hidden"
              style={{
                borderColor: !showResult
                  ? 'rgba(255,255,255,0.25)'
                  : isTop
                  ? '#4ade80'
                  : isChosen
                  ? '#f87171'
                  : 'rgba(255,255,255,0.08)',
                background: !showResult
                  ? 'rgba(255,255,255,0.08)'
                  : isTop
                  ? 'rgba(74,222,128,0.15)'
                  : isChosen
                  ? 'rgba(248,113,113,0.15)'
                  : 'rgba(255,255,255,0.04)',
                opacity: showResult && !isTop && !isChosen ? 0.45 : 1,
              }}
            >
              {/* Progress bar fill (shown after reveal) */}
              {showResult && isTop && (
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: 'rgba(74,222,128,0.1)', originX: 0 }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: pct / 100 }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                />
              )}

              <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center shrink-0 overflow-hidden relative z-10">
                {p.photoUrl ? (
                  <img src={p.photoUrl} alt={p.alias} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-lg">{p.alias.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 relative z-10">
                <span className="text-white font-bold text-base">{p.alias}</span>
                {showResult && (
                  <motion.p
                    className="text-white/50 text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {msgCount.toLocaleString()} msgs · {pct}%
                  </motion.p>
                )}
              </div>
              {showResult && isTop && <CheckCircle className="w-5 h-5 text-green-400 relative z-10 shrink-0" />}
              {showResult && isChosen && !isTop && <XCircle className="w-5 h-5 text-red-400 relative z-10 shrink-0" />}
            </motion.button>
          )
        })}
      </div>

      {/* Result reveal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="text-center z-10 space-y-1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          >
            <p
              className="text-2xl font-black"
              style={{ textShadow: isCorrect ? '0 0 20px rgba(74,222,128,0.6)' : '0 0 20px rgba(248,113,113,0.6)' }}
            >
              {isCorrect
                ? ts(language, 'slide03Correct')
                : `${ts(language, 'slide03Wrong')} ${getAlias(topSender![0])}!`}
            </p>
            <p className="text-white/50 text-sm">
              {getAlias(topSender![0])} — {topSender![1].toLocaleString()} {ts(language, 'messages')}
            </p>
            {countdown !== null && countdown > 0 && (
              <motion.p
                className="text-white/30 text-xs mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                próximo em {countdown}s…
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tap hint (before answering) */}
      {!selected && (
        <motion.p
          className="text-white/30 text-xs z-10"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          toque para responder
        </motion.p>
      )}
    </div>
  )
}
