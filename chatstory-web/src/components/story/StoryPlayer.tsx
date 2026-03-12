'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { StoryState } from '@/types/chat'
import { THEMES, getThemeGradient } from '@/lib/themes'
import { SlideIntro } from './slides/SlideIntro'
import { SlideVolume } from './slides/SlideVolume'
import { SlideQuiz } from './slides/SlideQuiz'
import { SlideTime } from './slides/SlideTime'
import { SlideEmojis } from './slides/SlideEmojis'
import { SlideMonths } from './slides/SlideMonths'
import { SlideParticipants } from './slides/SlideParticipants'
import { SlideFirstMessage } from './slides/SlideFirstMessage'
import { SlideStreak } from './slides/SlideStreak'
import { SlideEnding } from './slides/SlideEnding'

const SLIDE_DURATION = 8000 // ms
const TOTAL_SLIDES = 10

interface Props {
  story: StoryState
  onClose: () => void
}

export function StoryPlayer({ story, onClose }: Props) {
  const { metrics, participants, theme, language } = story
  const currentTheme = THEMES[theme]
  const accentColor = currentTheme.accentColor

  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const [direction, setDirection] = useState(1) // 1=forward, -1=backward
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pointerStartX = useRef<number | null>(null)
  const storyRef = useRef<HTMLDivElement>(null)

  const goTo = useCallback((index: number, dir: number = 1) => {
    if (index < 0 || index >= TOTAL_SLIDES) return
    setDirection(dir)
    setCurrentSlide(index)
    setProgress(0)
  }, [])

  const goNext = useCallback(() => {
    if (currentSlide < TOTAL_SLIDES - 1) goTo(currentSlide + 1, 1)
  }, [currentSlide, goTo])

  const goPrev = useCallback(() => {
    if (currentSlide > 0) goTo(currentSlide - 1, -1)
  }, [currentSlide, goTo])

  // Auto-advance timer
  useEffect(() => {
    if (paused) return
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct = (elapsed / SLIDE_DURATION) * 100
      if (pct >= 100) {
        clearInterval(interval)
        if (currentSlide < TOTAL_SLIDES - 1) {
          goNext()
        } else {
          setProgress(100)
        }
      } else {
        setProgress(pct)
      }
    }, 50)
    timerRef.current = interval
    return () => clearInterval(interval)
  }, [currentSlide, paused, goNext])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev, onClose])

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartX.current = e.clientX
    setPaused(true)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    setPaused(false)
    if (pointerStartX.current === null) return
    const dx = e.clientX - pointerStartX.current
    pointerStartX.current = null
    if (Math.abs(dx) > 50) {
      if (dx < 0) goNext()
      else goPrev()
    } else {
      // Tap: right half = next, left half = prev
      const rect = storyRef.current?.getBoundingClientRect()
      if (rect) {
        if (e.clientX > rect.left + rect.width / 2) goNext()
        else goPrev()
      }
    }
  }

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  const slideProps = { metrics, participants, language, accentColor, theme }

  const handleDownload = async () => {
    const { default: html2canvas } = await import('html2canvas')
    const el = storyRef.current
    if (!el) return
    const canvas = await html2canvas(el, {
      width: el.offsetWidth,
      height: el.offsetHeight,
      scale: 2,
      backgroundColor: null,
      useCORS: true,
    })
    const link = document.createElement('a')
    link.download = 'chatstory.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'ChatStory', text: 'Veja minha história no WhatsApp!' })
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copiado!')
    }
  }

  const renderSlide = () => {
    switch (currentSlide) {
      case 0: return <SlideIntro {...slideProps} />
      case 1: return <SlideVolume {...slideProps} />
      case 2: return <SlideQuiz {...slideProps} />
      case 3: return <SlideTime {...slideProps} />
      case 4: return <SlideEmojis {...slideProps} />
      case 5: return <SlideMonths {...slideProps} />
      case 6: return <SlideParticipants {...slideProps} />
      case 7: return <SlideFirstMessage {...slideProps} />
      case 8: return <SlideStreak {...slideProps} />
      case 9: return (
        <SlideEnding
          {...slideProps}
          onShare={handleShare}
          onDownload={handleDownload}
        />
      )
      default: return null
    }
  }

  return (
    <div
      ref={storyRef}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden select-none touch-none"
      style={{ background: getThemeGradient(currentTheme) }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Progress bars */}
      <div className="flex gap-1 px-3 pt-3 pb-2 z-10">
        {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-none"
              style={{
                width:
                  i < currentSlide ? '100%' :
                  i === currentSlide ? `${progress}%` :
                  '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Close button */}
      <button
        className="absolute top-6 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/20"
        onClick={(e) => { e.stopPropagation(); onClose() }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <X className="w-4 h-4 text-white" />
      </button>

      {/* Slides */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            {renderSlide()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
