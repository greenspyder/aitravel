import { ParsedMessage, ParsedChat, MessageType } from '@/types/chat'

// Patterns for different WhatsApp export formats:
// PT/BR: [DD/MM/AAAA HH:MM] Nome: mensagem
// EN:    [M/D/YY, H:MM AM] Name: message  OR  DD/MM/YYYY, HH:MM - Name: message
// ES:    D/M/AAAA, H:MM - Nombre: mensaje
// IT:    DD/MM/AA, HH:MM - Nome: messaggio
// DE:    DD.MM.YY, HH:MM - Name: Nachricht
const LINE_PATTERNS = [
  // [DD/MM/YYYY, HH:MM] Author: message  (PT bracket format)
  /^\[(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\]\s*(.+?):\s(.+)$/,
  // DD/MM/YYYY, HH:MM - Author: message  (PT/EN dash format)
  /^(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\s*[-–]\s*(.+?):\s(.+)$/,
  // M/D/YY, H:MM AM - Author: message  (EN US format)
  /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s+(\d{1,2}:\d{2}\s?[AP]M)\s*-\s*(.+?):\s(.+)$/,
]

// Media/system message indicators per language
const MEDIA_INDICATORS = [
  '<Media omitted>',
  '<Mídia omitida>',
  'imagem omitida',
  'áudio omitido',
  'vídeo omitido',
  'sticker omitido',
  'documento omitido',
  '‎image omitted',
  '‎video omitted',
  '‎audio omitted',
  '‎sticker omitted',
  '‎document omitted',
  'imagen omitida',
  'audio omitido',
  'video omitido',
]

const DELETED_INDICATORS = [
  'Esta mensagem foi apagada',
  'Você apagou esta mensagem',
  'This message was deleted',
  'You deleted this message',
  'Este mensaje fue eliminado',
  'Eliminaste este mensaje',
]

const STICKER_INDICATORS = [
  '‎sticker omitted',
  'sticker omitido',
  'sticker omitido',
]

function detectMessageType(content: string): MessageType {
  const lower = content.toLowerCase()
  if (STICKER_INDICATORS.some(s => lower.includes(s.toLowerCase()))) return 'sticker'
  if (MEDIA_INDICATORS.some(s => lower.includes(s.toLowerCase()))) return 'media'
  if (DELETED_INDICATORS.some(s => lower.includes(s.toLowerCase()))) return 'deleted'
  return 'text'
}

function parseDate(dateStr: string, timeStr: string): Date | null {
  try {
    // Normalize separators
    const d = dateStr.replace(/\./g, '/')
    const parts = d.split('/')
    if (parts.length !== 3) return null

    let day: number, month: number, year: number

    // Detect if M/D/YY (US) or DD/MM/YY (rest)
    const p0 = parseInt(parts[0])
    const p1 = parseInt(parts[1])
    const p2 = parseInt(parts[2])

    if (p2 < 100) {
      // 2-digit year
      year = p2 < 50 ? 2000 + p2 : 1900 + p2
    } else {
      year = p2
    }

    // Heuristic: if first part > 12, it must be DD/MM
    if (p0 > 12) {
      day = p0; month = p1
    } else if (p1 > 12) {
      day = p1; month = p0
    } else {
      // Ambiguous — assume DD/MM (most common globally)
      day = p0; month = p1
    }

    // Parse time
    let hours = 0, minutes = 0
    const timeClean = timeStr.trim()
    const ampm = timeClean.match(/([AP]M)/i)
    const timeParts = timeClean.replace(/\s?[AP]M/i, '').split(':')
    hours = parseInt(timeParts[0])
    minutes = parseInt(timeParts[1])

    if (ampm) {
      if (ampm[1].toUpperCase() === 'PM' && hours !== 12) hours += 12
      if (ampm[1].toUpperCase() === 'AM' && hours === 12) hours = 0
    }

    const date = new Date(year, month - 1, day, hours, minutes)
    if (isNaN(date.getTime())) return null
    return date
  } catch {
    return null
  }
}

function detectLanguage(lines: string[]): ParsedChat['detectedLanguage'] {
  const sample = lines.slice(0, 50).join('\n')
  if (/Mídia omitida|mensagem foi apagada|áudio omitido/i.test(sample)) return 'pt'
  if (/Media omitted|message was deleted/i.test(sample)) return 'en'
  if (/imagen omitida|mensaje eliminado/i.test(sample)) return 'es'
  if (/Medien weggelassen/i.test(sample)) return 'de'
  if (/Media omessa/i.test(sample)) return 'it'
  return 'unknown'
}

export function parseWhatsAppChat(rawText: string): ParsedChat {
  const lines = rawText.split('\n')
  const messages: ParsedMessage[] = []
  const participantSet = new Set<string>()
  let currentMessage: ParsedMessage | null = null

  for (const rawLine of lines) {
    // Strip BOM and zero-width characters
    const line = rawLine.replace(/^\uFEFF/, '').replace(/\u200E/g, '').trim()
    if (!line) continue

    let matched = false
    for (const pattern of LINE_PATTERNS) {
      const match = line.match(pattern)
      if (match) {
        // Save previous message
        if (currentMessage) messages.push(currentMessage)

        const [, dateStr, timeStr, author, content] = match
        const timestamp = parseDate(dateStr, timeStr)
        if (!timestamp) continue

        const cleanAuthor = author.trim()
        const cleanContent = content.trim()

        // Skip system messages (no real author — typically whatsapp adds ~)
        if (cleanAuthor.startsWith('~') || cleanContent === '') {
          currentMessage = null
          matched = true
          break
        }

        participantSet.add(cleanAuthor)
        currentMessage = {
          timestamp,
          author: cleanAuthor,
          content: cleanContent,
          type: detectMessageType(cleanContent),
        }
        matched = true
        break
      }
    }

    // Continuation line (multi-line message)
    if (!matched && currentMessage) {
      currentMessage.content += '\n' + line
    }
  }

  if (currentMessage) messages.push(currentMessage)

  return {
    messages,
    participants: Array.from(participantSet),
    detectedLanguage: detectLanguage(lines),
  }
}
