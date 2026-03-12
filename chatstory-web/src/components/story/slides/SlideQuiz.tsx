'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { ChatMetrics, Participant, Language } from '@/types/chat'
import { ts } from '@/lib/i18n'

interface Props {
  metrics: ChatMetrics
  participants: Participant[]
  language: Language
  accentColor: string
  onAnswer?: () => void
}

export function SlideQuiz({ metrics, participants, language, accentColor, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  const topSender = Object.entries(metrics.messagesByParticipant)
    .sort((a, b) => b[1] - a[1])[0]

  const getAlias = (name: string) =>
    participants.find(p => p.name === name)?.alias ?? name

  const handleSelect = (name: string) => {
    if (selected) return
    setSelected(name)
    onAnswer?.()
  }

  const isCorrect = selected === topSender?.[0]

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-8">
      <motion.p
        className="text-white text-2xl font-bold text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {ts(language, 'slide03Question')}
      </motion.p>

      <div className="w-full space-y-3">
        {participants.map((p, i) => {
          const isSelected = selected === p.name
          const isTop = p.name === topSender?.[0]
          const showResult = !!selected

          return (
            <motion.button
              key={p.name}
              onClick={() => handleSelect(p.name)}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                !showResult
                  ? 'border-white/30 bg-white/10 hover:bg-white/20 hover:border-white/60'
                  : isTop
                  ? 'border-green-400 bg-green-400/20'
                  : isSelected
                  ? 'border-red-400 bg-red-400/20'
                  : 'border-white/10 bg-white/5 opacity-50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 overflow-hidden">
                {p.photoUrl ? (
                  <img src={p.photoUrl} alt={p.alias} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold">{p.alias.charAt(0)}</span>
                )}
              </div>
              <span className="text-white font-semibold flex-1">{p.alias}</span>
              {showResult && isTop && <CheckCircle className="w-5 h-5 text-green-400" />}
              {showResult && isSelected && !isTop && <XCircle className="w-5 h-5 text-red-400" />}
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="text-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <p className="text-white text-xl font-bold">
              {isCorrect
                ? ts(language, 'slide03Correct')
                : `${ts(language, 'slide03Wrong')} ${getAlias(topSender![0])}!`}
            </p>
            <p className="text-white/60 text-sm mt-1">
              {getAlias(topSender![0])} — {topSender![1].toLocaleString()} {ts(language, 'messages')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
