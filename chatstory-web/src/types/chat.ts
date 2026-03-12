export type MessageType = 'text' | 'media' | 'sticker' | 'audio' | 'deleted' | 'system'

export interface ParsedMessage {
  timestamp: Date
  author: string
  content: string
  type: MessageType
}

export interface ParsedChat {
  messages: ParsedMessage[]
  participants: string[]
  detectedLanguage: 'pt' | 'en' | 'es' | 'it' | 'de' | 'unknown'
}

export interface Participant {
  name: string
  alias: string
  photoUrl?: string // base64 stored in localStorage
}

export interface ChatMetrics {
  totalMessages: number
  messagesByParticipant: Record<string, number>
  messagesByHour: Record<number, number>
  messagesByDayOfWeek: Record<number, number>
  messagesByMonth: Record<string, number>
  topEmojis: Array<{ emoji: string; count: number }>
  topWords: Array<{ word: string; count: number }>
  mediaCount: Record<string, number>
  firstMessage: { author: string; content: string; date: string } // ISO string for serialization
  longestStreak: { days: number; startDate: string } // ISO string
  averageResponseTime: Record<string, number> // in minutes
  totalDays: number
  participants: string[]
}

export type ThemeName = 'romantic' | 'friendship' | 'dark' | 'neon'

export interface Theme {
  name: ThemeName
  label: string
  from: string
  via: string
  to: string
  textColor: string
  accentColor: string
}

export type Language = 'pt' | 'en' | 'es'

export interface StoryState {
  metrics: ChatMetrics
  participants: Participant[]
  theme: ThemeName
  language: Language
}
