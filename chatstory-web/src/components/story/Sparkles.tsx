'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface SparkleConfig {
  id: number
  x: string
  y: string
  size: number
  duration: number
  delay: number
  rotation: number
}

function SparkleIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L13.5 9.5L21 12L13.5 14.5L12 22L10.5 14.5L3 12L10.5 9.5L12 2Z"
        fill={color}
      />
    </svg>
  )
}

export function Sparkles({ color = 'white', count = 8 }: { color?: string; count?: number }) {
  const configs = useMemo<SparkleConfig[]>(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: `${Math.random() * 90 + 5}%`,
      y: `${Math.random() * 90 + 5}%`,
      size: Math.random() * 12 + 6,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 3,
      rotation: Math.random() * 45,
    })), [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {configs.map(s => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{ left: s.x, top: s.y }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.7, 0],
            rotate: [s.rotation, s.rotation + 180],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 2 + 1,
            ease: 'easeInOut',
          }}
        >
          <SparkleIcon size={s.size} color={color} />
        </motion.div>
      ))}
    </div>
  )
}
