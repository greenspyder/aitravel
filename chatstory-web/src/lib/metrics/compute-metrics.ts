import { ParsedChat, ChatMetrics } from '@/types/chat'

// Emoji regex — matches most emoji sequences
const EMOJI_REGEX = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu

// Stop words for top words (common in PT/EN/ES)
const STOP_WORDS = new Set([
  // PT
  'de','a','o','que','e','do','da','em','um','para','é','com','uma','os','no','se',
  'na','por','mais','as','dos','como','mas','foi','ao','ele','das','tem','à','seu',
  'sua','ou','ser','quando','muito','há','nos','já','está','eu','também','só','pelo',
  'pela','até','isso','ela','entre','era','depois','sem','mesmo','aos','ter','seus',
  'quem','nas','me','esse','eles','estão','você','tinha','foram','essa','num','nem',
  'suas','meu','às','minha','têm','numa','pelos','pelas','este','dele','tu','te',
  'vocês','nós','lhe','lhes','meus','minhas','teu','tua','teus','tuas','nosso',
  // EN
  'the','be','to','of','and','a','in','that','have','it','for','not','on','with',
  'he','as','you','do','at','this','but','his','by','from','they','we','say','her',
  'she','or','an','will','my','one','all','would','there','their','what','so','up',
  'out','if','about','who','get','which','go','me','when','make','can','like','time',
  'no','just','him','know','take','people','into','year','your','good','some','could',
  'them','see','other','than','then','now','look','only','come','its','over','think',
  'also','back','after','use','two','how','our','work','first','well','way','even',
  'new','want','because','any','these','give','day','most','us','i','am','are','was',
  'is','it','im','ur','r','u',
  // ES
  'el','la','los','las','un','una','unos','unas','al','del','lo','le','les','y',
  'en','de','se','que','por','con','su','sus','más','pero','si','no','está','son',
  'hay','fue','era','ya','yo','me','mi','te','tu','él','ella','nos','os','ser','estar',
  // common short words
  'ok','sim','não','yes','no','sí','si','lol','haha','oi','olá','ola','hi','hey',
  'kkk','kk','kkkkk','rsrs','rs','hehe','ahaha','ok','isso','assim','tá','ta',
  'aqui','ali','lá','la','so','yeah','nah','hmm','ah','oh','uh','um','hm',
])

function extractEmojis(text: string): string[] {
  return text.match(EMOJI_REGEX) ?? []
}

function extractWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(EMOJI_REGEX, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))
}

function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function computeMetrics(chat: ParsedChat): ChatMetrics {
  const { messages, participants } = chat

  const textMessages = messages.filter(m => m.type === 'text' || m.type === 'deleted')

  // Message counts by participant
  const messagesByParticipant: Record<string, number> = {}
  participants.forEach(p => { messagesByParticipant[p] = 0 })

  // By hour (0-23)
  const messagesByHour: Record<number, number> = {}
  for (let i = 0; i < 24; i++) messagesByHour[i] = 0

  // By day of week (0=Sun...6=Sat)
  const messagesByDayOfWeek: Record<number, number> = {}
  for (let i = 0; i < 7; i++) messagesByDayOfWeek[i] = 0

  // By month (YYYY-MM)
  const messagesByMonth: Record<string, number> = {}

  // Emoji counts
  const emojiCounts: Record<string, number> = {}

  // Word counts
  const wordCounts: Record<string, number> = {}

  // Media counts per participant
  const mediaCount: Record<string, number> = {}
  participants.forEach(p => { mediaCount[p] = 0 })

  // Unique dates for streak calculation
  const activeDates = new Set<string>()

  for (const msg of messages) {
    messagesByParticipant[msg.author] = (messagesByParticipant[msg.author] ?? 0) + 1
    messagesByHour[msg.timestamp.getHours()] = (messagesByHour[msg.timestamp.getHours()] ?? 0) + 1
    messagesByDayOfWeek[msg.timestamp.getDay()] = (messagesByDayOfWeek[msg.timestamp.getDay()] ?? 0) + 1

    const monthKey = getMonthKey(msg.timestamp)
    messagesByMonth[monthKey] = (messagesByMonth[monthKey] ?? 0) + 1

    const dateKey = msg.timestamp.toISOString().slice(0, 10)
    activeDates.add(dateKey)

    if (msg.type === 'media' || msg.type === 'sticker' || msg.type === 'audio') {
      mediaCount[msg.author] = (mediaCount[msg.author] ?? 0) + 1
    }

    if (msg.type === 'text') {
      const emojis = extractEmojis(msg.content)
      emojis.forEach(e => { emojiCounts[e] = (emojiCounts[e] ?? 0) + 1 })

      const words = extractWords(msg.content)
      words.forEach(w => { wordCounts[w] = (wordCounts[w] ?? 0) + 1 })
    }
  }

  // Exclude emojis that appear in participant names
  const nameEmojis = new Set<string>()
  participants.forEach(name => extractEmojis(name).forEach(e => nameEmojis.add(e)))

  // Top 10 emojis
  const topEmojis = Object.entries(emojiCounts)
    .filter(([emoji]) => !nameEmojis.has(emoji))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([emoji, count]) => ({ emoji, count }))

  // Top 20 words
  const topWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, count]) => ({ word, count }))

  // First message (skip system messages)
  const firstMsg = messages.find(m => m.type === 'text') ?? messages[0]

  // Longest streak
  const sortedDates = Array.from(activeDates).sort()
  let maxStreak = 1
  let currentStreak = 1
  let streakStart = sortedDates[0]
  let bestStreakStart = sortedDates[0]

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1])
    const curr = new Date(sortedDates[i])
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    if (diff === 1) {
      currentStreak++
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak
        bestStreakStart = streakStart
      }
    } else {
      currentStreak = 1
      streakStart = sortedDates[i]
    }
  }

  // Average response time per participant (in minutes)
  const averageResponseTime: Record<string, number> = {}
  const responseTimes: Record<string, number[]> = {}
  participants.forEach(p => { responseTimes[p] = [] })

  for (let i = 1; i < messages.length; i++) {
    const prev = messages[i - 1]
    const curr = messages[i]
    if (prev.author !== curr.author) {
      const diffMin = (curr.timestamp.getTime() - prev.timestamp.getTime()) / (1000 * 60)
      // Only count reasonable response times (< 24h)
      if (diffMin > 0 && diffMin < 1440) {
        if (responseTimes[curr.author]) {
          responseTimes[curr.author].push(diffMin)
        }
      }
    }
  }

  participants.forEach(p => {
    const times = responseTimes[p] ?? []
    averageResponseTime[p] = times.length > 0
      ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
      : 0
  })

  const totalDays = sortedDates.length

  return {
    totalMessages: messages.length,
    messagesByParticipant,
    messagesByHour,
    messagesByDayOfWeek,
    messagesByMonth,
    topEmojis,
    topWords,
    mediaCount,
    firstMessage: firstMsg
      ? { author: firstMsg.author, content: firstMsg.content, date: firstMsg.timestamp.toISOString() }
      : { author: '', content: '', date: new Date().toISOString() },
    longestStreak: { days: maxStreak, startDate: bestStreakStart ?? new Date().toISOString() },
    averageResponseTime,
    totalDays,
    participants,
  }
}

export function computeRelationshipScore(metrics: ChatMetrics): number {
  const total = metrics.totalMessages
  const days = metrics.totalDays
  const streakDays = metrics.longestStreak.days
  const emojiCount = metrics.topEmojis.reduce((s, e) => s + e.count, 0)

  // Simple formula: normalize each factor 0-100, weighted average
  const activityScore = Math.min(100, (total / Math.max(days, 1)) * 2)       // avg msgs/day
  const consistencyScore = Math.min(100, (streakDays / Math.max(days, 1)) * 200) // streak ratio
  const emojiScore = Math.min(100, (emojiCount / Math.max(total, 1)) * 500)   // emoji ratio

  return Math.round(activityScore * 0.5 + consistencyScore * 0.3 + emojiScore * 0.2)
}
