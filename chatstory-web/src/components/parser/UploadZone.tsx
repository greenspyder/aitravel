'use client'

import { useCallback, useRef, useState } from 'react'
import { Upload, FileText, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { parseWhatsAppChat } from '@/lib/parser/whatsapp-parser'
import { ParsedChat, Language } from '@/types/chat'
import { ts } from '@/lib/i18n'

interface UploadZoneProps {
  onParsed: (chat: ParsedChat) => void
  language: Language
}

export function UploadZone({ onParsed, language }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.txt') && file.type !== 'text/plain') {
      setError('Please upload a .txt file exported from WhatsApp.')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const text = await file.text()
      const chat = parseWhatsAppChat(text)
      if (chat.messages.length === 0) {
        setError('No messages found. Make sure this is a valid WhatsApp export file.')
        setIsLoading(false)
        return
      }
      onParsed(chat)
    } catch {
      setError('Failed to parse the file. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [onParsed])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }, [processFile])

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        onClick={() => !isLoading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-all duration-200',
          isDragging
            ? 'border-white/80 bg-white/10 scale-[1.02]'
            : 'border-white/30 bg-white/5 hover:border-white/60 hover:bg-white/10',
          isLoading && 'cursor-not-allowed opacity-70'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".txt,text/plain"
          className="hidden"
          onChange={handleChange}
          disabled={isLoading}
        />

        {isLoading ? (
          <Loader2 className="h-12 w-12 animate-spin text-white/70" />
        ) : isDragging ? (
          <FileText className="h-12 w-12 text-white" />
        ) : (
          <Upload className="h-12 w-12 text-white/70" />
        )}

        <div className="text-center">
          <p className="text-white font-medium text-base">
            {isLoading ? 'Parsing your chat...' : ts(language, 'uploadInstructions')}
          </p>
          <p className="text-white/50 text-sm mt-1">
            {ts(language, 'uploadHint')}
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-center text-red-400 text-sm">{error}</p>
      )}
    </div>
  )
}
