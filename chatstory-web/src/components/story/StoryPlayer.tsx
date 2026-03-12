'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Volume2, VolumeX } from 'lucide-react'
import { StoryState } from '@/types/chat'
import { THEMES, getThemeGradient } from '@/lib/themes'
import { useAmbientAudio } from '@/lib/useAmbientAudio'
import { ThemeBackground } from './ThemeBackground'
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

const SLIDE_DURATION = 9000
const QUIZ_SLIDE = 2
const LAST_SLIDE = 9
const TOTAL_SLIDES = 10

// Transition style per slide — cycles through different feels like Spotify Wrapped
type TransStyle = 'slide' | 'zoom' | 'swipeUp' | 'flip'
const SLIDE_TRANS: TransStyle[] = [
  'zoom',    // 0: Intro — big entrance
  'swipeUp', // 1: Volume
  'slide',   // 2: Quiz
  'zoom',    // 3: Time
  'swipeUp', // 4: Emojis
  'slide',   // 5: Months
  'swipeUp', // 6: Participants
  'zoom',    // 7: First Message
  'flip',    // 8: Streak — dramatic
  'zoom',    // 9: Ending — grand reveal
]

function getVariants(slideIndex: number, dir: number) {
  const style = SLIDE_TRANS[slideIndex] ?? 'slide'
  switch (style) {
    case 'zoom':
      return {
        enter: { scale: dir > 0 ? 0.6 : 1.4, opacity: 0, filter: 'blur(8px)' },
        center: { scale: 1, opacity: 1, filter: 'blur(0px)' },
        exit: { scale: dir > 0 ? 1.2 : 0.8, opacity: 0, filter: 'blur(6px)' },
      }
    case 'swipeUp':
      return {
        enter: { y: dir > 0 ? '100%' : '-100%', opacity: 0 },
        center: { y: 0, opacity: 1 },
        exit: { y: dir > 0 ? '-15%' : '15%', opacity: 0, scale: 0.95 },
      }
    case 'flip':
      return {
        enter: { rotateY: dir > 0 ? 90 : -90, opacity: 0, scale: 0.85 },
        center: { rotateY: 0, opacity: 1, scale: 1 },
        exit: { rotateY: dir > 0 ? -90 : 90, opacity: 0, scale: 0.85 },
      }
    default: // slide
      return {
        enter: { x: dir > 0 ? '100%' : '-100%', opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: dir > 0 ? '-20%' : '20%', opacity: 0, scale: 0.9 },
      }
  }
}

function getTransition(slideIndex: number) {
  const style = SLIDE_TRANS[slideIndex] ?? 'slide'
  if (style === 'flip') return { duration: 0.5, ease: 'easeInOut' as const }
  if (style === 'zoom') return { duration: 0.5, type: 'spring' as const, stiffness: 200, damping: 22 }
  return { duration: 0.4, ease: 'easeInOut' as const }
}

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
  const [quizBlocked, setQuizBlocked] = useState(false)
  const [direction, setDirection] = useState(1)
  const [flash, setFlash] = useState(false)
  const pointerStartX = useRef<number | null>(null)
  const storyRef = useRef<HTMLDivElement>(null)

  const { muted, toggle: toggleAudio } = useAmbientAudio(theme)

  // Block auto-advance when entering quiz slide
  useEffect(() => {
    setProgress(0)
    setQuizBlocked(currentSlide === QUIZ_SLIDE)
  }, [currentSlide])

  const triggerFlash = useCallback(() => {
    setFlash(true)
    setTimeout(() => setFlash(false), 200)
  }, [])

  const goTo = useCallback((index: number, dir: number = 1) => {
    if (index < 0 || index >= TOTAL_SLIDES) return
    triggerFlash()
    setDirection(dir)
    setCurrentSlide(index)
  }, [triggerFlash])

  const goNext = useCallback(() => {
    if (currentSlide < TOTAL_SLIDES - 1) goTo(currentSlide + 1, 1)
  }, [currentSlide, goTo])

  const goPrev = useCallback(() => {
    if (currentSlide > 0) goTo(currentSlide - 1, -1)
  }, [currentSlide, goTo])

  const handleQuizComplete = useCallback(() => {
    setQuizBlocked(false)
    goNext()
  }, [goNext])

  // Auto-advance timer
  useEffect(() => {
    const blocked = paused || quizBlocked || currentSlide === LAST_SLIDE
    if (blocked) return
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct = (elapsed / SLIDE_DURATION) * 100
      if (pct >= 100) {
        clearInterval(interval)
        goNext()
      } else {
        setProgress(pct)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [currentSlide, paused, quizBlocked, goNext])

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape') onClose()
      if (e.key === 'm') toggleAudio()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev, onClose, toggleAudio])

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
      if (currentSlide === QUIZ_SLIDE) return
      const rect = storyRef.current?.getBoundingClientRect()
      if (rect) {
        if (e.clientX > rect.left + rect.width / 2) goNext()
        else goPrev()
      }
    }
  }

  const variants = useMemo(() => getVariants(currentSlide, direction), [currentSlide, direction])
  const transitionCfg = useMemo(() => getTransition(currentSlide), [currentSlide])

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
    }
  }

  const renderSlide = () => {
    switch (currentSlide) {
      case 0: return <SlideIntro {...slideProps} />
      case 1: return <SlideVolume {...slideProps} />
      case 2: return <SlideQuiz {...slideProps} onComplete={handleQuizComplete} />
      case 3: return <SlideTime {...slideProps} />
      case 4: return <SlideEmojis {...slideProps} />
      case 5: return <SlideMonths {...slideProps} />
      case 6: return <SlideParticipants {...slideProps} />
      case 7: return <SlideFirstMessage {...slideProps} />
      case 8: return <SlideStreak {...slideProps} />
      case 9: return <SlideEnding {...slideProps} onShare={handleShare} onDownload={handleDownload} />
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
      {/* Persistent theme background decorations */}
      <ThemeBackground themeName={theme} accentColor={accentColor} />

      {/* Flash overlay on slide change */}
      <AnimatePresence>
        {flash && (
          <motion.div
            key="flash"
            className="absolute inset-0 z-40 pointer-events-none"
            style={{ background: accentColor }}
            initial={{ opacity: 0.25 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Progress bars */}
      <div className="flex gap-1 px-3 pt-3 pb-2 z-10 relative">
        {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              style={{
                width:
                  i < currentSlide ? '100%' :
                  i === currentSlide ? (quizBlocked ? '0%' : `${progress}%`) :
                  '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <span className="text-white/40 text-xs font-medium tabular-nums">
          {currentSlide + 1}/{TOTAL_SLIDES}
        </span>
      </div>

      {/* Audio toggle */}
      <button
        className="absolute top-5 right-14 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/25 backdrop-blur-sm"
        onClick={(e) => { e.stopPropagation(); toggleAudio() }}
        onPointerDown={(e) => e.stopPropagation()}
        title={muted ? 'Ativar som (M)' : 'Silenciar (M)'}
      >
        {muted
          ? <VolumeX className="w-4 h-4 text-white/60" />
          : <Volume2 className="w-4 h-4 text-white" />
        }
      </button>

      {/* Close */}
      <button
        className="absolute top-5 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/25 backdrop-blur-sm"
        onClick={(e) => { e.stopPropagation(); onClose() }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <X className="w-4 h-4 text-white" />
      </button>

      {/* Slides */}
      <div className="flex-1 relative overflow-hidden" style={{ perspective: 1200 }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            initial={variants.enter}
            animate={variants.center}
            exit={variants.exit}
            transition={transitionCfg}
            className="absolute inset-0"
          >
            {renderSlide()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
