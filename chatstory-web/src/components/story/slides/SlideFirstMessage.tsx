'use client'

import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import { ChatMetrics, Participant, Language } from '@/types/chat'
import { ts } from '@/lib/i18n'

interface Props {
  metrics: ChatMetrics
  participants: Participant[]
  language: Language
  accentColor: string
}

export function SlideFirstMessage({ metrics, participants, language, accentColor }: Props) {
  const { firstMessage } = metrics
  const author = participants.find(p => p.name === firstMessage.author) ?? {
    alias: firstMessage.author,
    photoUrl: undefined,
    name: firstMessage.author,
  }
  const date = new Date(firstMessage.date)
  const months = ts(language, 'months') as unknown as string[]
  const dateStr = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`

  // Truncate very long messages
  const content = firstMessage.content.length > 120
    ? firstMessage.content.slice(0, 120) + '...'
    : firstMessage.content

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-8">
      <motion.div
        className="text-center space-y-1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-white text-2xl font-bold">{ts(language, 'slide08Title')}</p>
        <p className="text-white/50 text-sm">{ts(language, 'slide08Sub')}</p>
      </motion.div>

      {/* Message bubble */}
      <motion.div
        className="w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 150, delay: 0.5 }}
      >
        <div className="bg-white/15 backdrop-blur-sm rounded-3xl rounded-tl-sm p-5 space-y-3 border border-white/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden shrink-0">
              {author.photoUrl ? (
                <img src={author.photoUrl} alt={author.alias} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-xs font-bold">{author.alias.charAt(0)}</span>
              )}
            </div>
            <span className="text-white font-semibold text-sm" style={{ color: accentColor }}>
              {author.alias}
            </span>
          </div>
          <p className="text-white text-base leading-relaxed">
            {content || '👋'}
          </p>
          <p className="text-white/40 text-xs text-right">{dateStr}</p>
        </div>
      </motion.div>

      <motion.div
        className="flex items-center gap-2 text-white/40 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <MessageSquare className="w-4 h-4" />
        <span>message #{1}</span>
      </motion.div>
    </div>
  )
}
