'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

const COLORS = ['#FF006E', '#8338EC', '#3A86FF', '#00B4D8', '#39FF14', '#FFD700', '#FF4D4D', '#00FF88', '#FF9500']

export function ConfettiBurst({ trigger }: { trigger: boolean }) {
  const pieces = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.7) * 700,
      rotate: Math.random() * 720 - 360,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 4,
      isCircle: Math.random() > 0.6,
    })), [])

  if (!trigger) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center z-20">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          className={`absolute ${p.isCircle ? 'rounded-full' : 'rounded-sm'}`}
          style={{ width: p.w, height: p.isCircle ? p.w : p.h, background: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: [1, 1, 1, 0],
            rotate: p.rotate,
            scale: [0, 1.2, 1, 0.5],
          }}
          transition={{ duration: 2.2, ease: [0.2, 0.8, 0.4, 1] }}
        />
      ))}
    </div>
  )
}
