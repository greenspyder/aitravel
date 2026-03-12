'use client'

import { motion } from 'framer-motion'
import { ThemeName } from '@/types/chat'

interface Props {
  themeName: ThemeName
  accentColor: string
}

// ─── Romantic ────────────────────────────────────────────────────────────────
const HEARTS = [
  { id: 0,  x: 3,  size: 14, dur: 18, del: 0,    op: 0.20 },
  { id: 1,  x: 8,  size: 22, dur: 22, del: 2.5,  op: 0.14 },
  { id: 2,  x: 13, size: 11, dur: 16, del: 5,    op: 0.22 },
  { id: 3,  x: 19, size: 28, dur: 24, del: 1,    op: 0.12 },
  { id: 4,  x: 25, size: 16, dur: 19, del: 7,    op: 0.25 },
  { id: 5,  x: 31, size: 12, dur: 21, del: 3.5,  op: 0.18 },
  { id: 6,  x: 37, size: 20, dur: 17, del: 9,    op: 0.15 },
  { id: 7,  x: 43, size: 26, dur: 23, del: 0.5,  op: 0.10 },
  { id: 8,  x: 49, size: 14, dur: 18, del: 4,    op: 0.22 },
  { id: 9,  x: 55, size: 18, dur: 20, del: 6.5,  op: 0.16 },
  { id: 10, x: 61, size: 11, dur: 16, del: 2,    op: 0.24 },
  { id: 11, x: 67, size: 24, dur: 22, del: 8,    op: 0.12 },
  { id: 12, x: 72, size: 16, dur: 19, del: 1.5,  op: 0.20 },
  { id: 13, x: 78, size: 12, dur: 17, del: 5.5,  op: 0.18 },
  { id: 14, x: 83, size: 20, dur: 21, del: 3,    op: 0.14 },
  { id: 15, x: 89, size: 14, dur: 18, del: 7.5,  op: 0.22 },
  { id: 16, x: 94, size: 22, dur: 23, del: 0,    op: 0.10 },
  { id: 17, x: 6,  size: 30, dur: 26, del: 4.5,  op: 0.08 },
  { id: 18, x: 22, size: 10, dur: 15, del: 10,   op: 0.28 },
  { id: 19, x: 40, size: 18, dur: 20, del: 2,    op: 0.16 },
  { id: 20, x: 58, size: 12, dur: 17, del: 6,    op: 0.20 },
  { id: 21, x: 75, size: 24, dur: 22, del: 3.5,  op: 0.12 },
  { id: 22, x: 91, size: 16, dur: 19, del: 8.5,  op: 0.18 },
  { id: 23, x: 15, size: 10, dur: 14, del: 1.5,  op: 0.26 },
  { id: 24, x: 50, size: 28, dur: 25, del: 11,   op: 0.09 },
  { id: 25, x: 35, size: 13, dur: 16, del: 4,    op: 0.22 },
  { id: 26, x: 64, size: 19, dur: 21, del: 7,    op: 0.15 },
  { id: 27, x: 80, size: 11, dur: 18, del: 2.5,  op: 0.24 },
  { id: 28, x: 46, size: 15, dur: 20, del: 9,    op: 0.18 },
  { id: 29, x: 97, size: 23, dur: 24, del: 5,    op: 0.11 },
]

const SPARKLE_DOTS = [
  { id: 0,  x: 10, y: 12, s: 3, dur: 4,  del: 0   },
  { id: 1,  x: 22, y: 35, s: 4, dur: 5,  del: 1   },
  { id: 2,  x: 38, y: 18, s: 2, dur: 3.5,del: 2   },
  { id: 3,  x: 55, y: 45, s: 5, dur: 6,  del: 0.5 },
  { id: 4,  x: 70, y: 22, s: 3, dur: 4,  del: 1.5 },
  { id: 5,  x: 85, y: 60, s: 4, dur: 5,  del: 2.5 },
  { id: 6,  x: 15, y: 70, s: 2, dur: 3.5,del: 3   },
  { id: 7,  x: 48, y: 82, s: 3, dur: 4.5,del: 0.8 },
  { id: 8,  x: 78, y: 38, s: 5, dur: 6,  del: 1.8 },
  { id: 9,  x: 33, y: 55, s: 2, dur: 3.5,del: 3.5 },
  { id: 10, x: 62, y: 78, s: 4, dur: 5,  del: 1.2 },
  { id: 11, x: 90, y: 15, s: 3, dur: 4,  del: 2.8 },
  { id: 12, x: 5,  y: 90, s: 2, dur: 3.5,del: 0.3 },
  { id: 13, x: 42, y: 8,  s: 4, dur: 5.5,del: 2.2 },
  { id: 14, x: 95, y: 75, s: 3, dur: 4,  del: 1.7 },
  { id: 15, x: 27, y: 95, s: 2, dur: 3,  del: 3.8 },
]

// ─── Friendship ───────────────────────────────────────────────────────────────
const STARS = [
  { id: 0,  x: 4,  y: 6,  s: 4, dur: 4,   del: 0    },
  { id: 1,  x: 11, y: 20, s: 6, dur: 5,   del: 0.7  },
  { id: 2,  x: 18, y: 42, s: 3, dur: 3.5, del: 1.5  },
  { id: 3,  x: 25, y: 14, s: 5, dur: 6,   del: 2.2  },
  { id: 4,  x: 32, y: 65, s: 4, dur: 4.5, del: 0.4  },
  { id: 5,  x: 39, y: 30, s: 7, dur: 5,   del: 1.1  },
  { id: 6,  x: 46, y: 78, s: 3, dur: 3.5, del: 2.8  },
  { id: 7,  x: 53, y: 8,  s: 5, dur: 4,   del: 0.9  },
  { id: 8,  x: 60, y: 52, s: 6, dur: 5.5, del: 1.6  },
  { id: 9,  x: 67, y: 25, s: 4, dur: 4,   del: 3.1  },
  { id: 10, x: 74, y: 88, s: 5, dur: 5,   del: 0.3  },
  { id: 11, x: 81, y: 40, s: 3, dur: 3.5, del: 1.9  },
  { id: 12, x: 88, y: 68, s: 6, dur: 4.5, del: 2.6  },
  { id: 13, x: 95, y: 15, s: 4, dur: 4,   del: 0.6  },
  { id: 14, x: 7,  y: 55, s: 5, dur: 5,   del: 1.3  },
  { id: 15, x: 20, y: 83, s: 3, dur: 3.5, del: 3.5  },
  { id: 16, x: 35, y: 38, s: 7, dur: 6,   del: 0.2  },
  { id: 17, x: 50, y: 60, s: 4, dur: 4.5, del: 2.0  },
  { id: 18, x: 65, y: 92, s: 5, dur: 5,   del: 1.4  },
  { id: 19, x: 78, y: 12, s: 3, dur: 3.5, del: 3.0  },
  { id: 20, x: 90, y: 48, s: 6, dur: 4,   del: 0.8  },
  { id: 21, x: 13, y: 72, s: 4, dur: 5,   del: 2.4  },
  { id: 22, x: 28, y: 28, s: 5, dur: 4.5, del: 1.7  },
  { id: 23, x: 43, y: 96, s: 3, dur: 3.5, del: 0.5  },
  { id: 24, x: 58, y: 36, s: 6, dur: 5,   del: 2.9  },
  { id: 25, x: 72, y: 74, s: 4, dur: 4,   del: 1.0  },
  { id: 26, x: 86, y: 18, s: 5, dur: 5.5, del: 3.3  },
  { id: 27, x: 2,  y: 45, s: 3, dur: 3.5, del: 1.8  },
  { id: 28, x: 55, y: 22, s: 7, dur: 6,   del: 0.1  },
  { id: 29, x: 97, y: 62, s: 4, dur: 4.5, del: 2.7  },
  { id: 30, x: 16, y: 5,  s: 5, dur: 5,   del: 1.2  },
  { id: 31, x: 37, y: 48, s: 3, dur: 3.5, del: 3.6  },
  { id: 32, x: 69, y: 80, s: 6, dur: 4,   del: 0.6  },
  { id: 33, x: 83, y: 33, s: 4, dur: 5,   del: 2.1  },
  { id: 34, x: 93, y: 85, s: 5, dur: 4.5, del: 1.5  },
]

const BUBBLES = [
  { id: 0, x: 8,  size: 30, dur: 18, del: 0   },
  { id: 1, x: 18, size: 50, dur: 22, del: 3   },
  { id: 2, x: 28, size: 20, dur: 16, del: 6   },
  { id: 3, x: 38, size: 65, dur: 25, del: 1.5 },
  { id: 4, x: 50, size: 35, dur: 19, del: 8   },
  { id: 5, x: 60, size: 25, dur: 21, del: 4   },
  { id: 6, x: 72, size: 55, dur: 23, del: 2   },
  { id: 7, x: 82, size: 40, dur: 17, del: 9   },
  { id: 8, x: 90, size: 22, dur: 20, del: 5.5 },
  { id: 9, x: 45, size: 45, dur: 24, del: 7   },
  { id: 10, x: 65, size: 18, dur: 15, del: 11 },
  { id: 11, x: 22, size: 60, dur: 26, del: 0.5},
]

// ─── Dark ─────────────────────────────────────────────────────────────────────
const DARK_PARTICLES = [
  { id: 0,  x: 4,  y: 8,  s: 2,   dur: 6,  del: 0    },
  { id: 1,  x: 9,  y: 30, s: 1.5, dur: 8,  del: 0.6  },
  { id: 2,  x: 14, y: 55, s: 2.5, dur: 7,  del: 1.2  },
  { id: 3,  x: 19, y: 80, s: 1,   dur: 5,  del: 2.0  },
  { id: 4,  x: 24, y: 18, s: 2,   dur: 9,  del: 0.3  },
  { id: 5,  x: 29, y: 42, s: 3,   dur: 6,  del: 1.8  },
  { id: 6,  x: 34, y: 70, s: 1.5, dur: 7,  del: 3.0  },
  { id: 7,  x: 39, y: 5,  s: 2,   dur: 8,  del: 0.9  },
  { id: 8,  x: 44, y: 35, s: 1,   dur: 5,  del: 2.5  },
  { id: 9,  x: 49, y: 62, s: 2.5, dur: 9,  del: 1.5  },
  { id: 10, x: 54, y: 88, s: 2,   dur: 6,  del: 0.1  },
  { id: 11, x: 59, y: 22, s: 1.5, dur: 7,  del: 3.5  },
  { id: 12, x: 64, y: 48, s: 3,   dur: 8,  del: 1.0  },
  { id: 13, x: 69, y: 75, s: 1,   dur: 5,  del: 2.2  },
  { id: 14, x: 74, y: 12, s: 2,   dur: 9,  del: 0.7  },
  { id: 15, x: 79, y: 38, s: 1.5, dur: 6,  del: 4.0  },
  { id: 16, x: 84, y: 65, s: 2.5, dur: 7,  del: 1.4  },
  { id: 17, x: 89, y: 90, s: 2,   dur: 8,  del: 0.4  },
  { id: 18, x: 94, y: 28, s: 1,   dur: 5,  del: 3.0  },
  { id: 19, x: 6,  y: 95, s: 3,   dur: 9,  del: 1.7  },
  { id: 20, x: 17, y: 50, s: 2,   dur: 6,  del: 2.8  },
  { id: 21, x: 32, y: 72, s: 1.5, dur: 7,  del: 0.5  },
  { id: 22, x: 47, y: 15, s: 2.5, dur: 8,  del: 3.8  },
  { id: 23, x: 62, y: 58, s: 1,   dur: 5,  del: 1.1  },
  { id: 24, x: 77, y: 82, s: 2,   dur: 9,  del: 2.6  },
  { id: 25, x: 92, y: 44, s: 3,   dur: 6,  del: 0.2  },
  { id: 26, x: 11, y: 25, s: 1.5, dur: 7,  del: 4.5  },
  { id: 27, x: 26, y: 95, s: 2,   dur: 8,  del: 1.9  },
  { id: 28, x: 56, y: 33, s: 2.5, dur: 5,  del: 3.2  },
  { id: 29, x: 71, y: 20, s: 1,   dur: 9,  del: 0.8  },
  { id: 30, x: 86, y: 55, s: 2,   dur: 6,  del: 2.3  },
  { id: 31, x: 2,  y: 68, s: 1.5, dur: 7,  del: 1.6  },
  { id: 32, x: 41, y: 88, s: 3,   dur: 8,  del: 3.7  },
  { id: 33, x: 67, y: 6,  s: 2,   dur: 5,  del: 0.3  },
  { id: 34, x: 97, y: 78, s: 1.5, dur: 9,  del: 2.9  },
]

// ─── Neon ─────────────────────────────────────────────────────────────────────
const NEON_PARTICLES = [
  { id: 0,  x: 5,  y: 10, s: 2,   dur: 5,  del: 0    },
  { id: 1,  x: 12, y: 28, s: 1.5, dur: 7,  del: 0.5  },
  { id: 2,  x: 20, y: 52, s: 2.5, dur: 4,  del: 1.2  },
  { id: 3,  x: 28, y: 76, s: 1,   dur: 6,  del: 2.0  },
  { id: 4,  x: 36, y: 18, s: 2,   dur: 5,  del: 0.8  },
  { id: 5,  x: 44, y: 44, s: 3,   dur: 7,  del: 1.6  },
  { id: 6,  x: 52, y: 68, s: 1.5, dur: 4,  del: 3.0  },
  { id: 7,  x: 60, y: 8,  s: 2,   dur: 6,  del: 0.3  },
  { id: 8,  x: 68, y: 36, s: 1,   dur: 5,  del: 2.4  },
  { id: 9,  x: 76, y: 62, s: 2.5, dur: 7,  del: 1.0  },
  { id: 10, x: 84, y: 85, s: 2,   dur: 4,  del: 3.5  },
  { id: 11, x: 92, y: 22, s: 1.5, dur: 6,  del: 0.6  },
  { id: 12, x: 8,  y: 90, s: 3,   dur: 5,  del: 1.8  },
  { id: 13, x: 24, y: 32, s: 2,   dur: 7,  del: 2.6  },
  { id: 14, x: 40, y: 58, s: 1,   dur: 4,  del: 0.2  },
  { id: 15, x: 56, y: 82, s: 2.5, dur: 6,  del: 1.4  },
  { id: 16, x: 72, y: 15, s: 2,   dur: 5,  del: 3.2  },
  { id: 17, x: 88, y: 48, s: 1.5, dur: 7,  del: 0.9  },
  { id: 18, x: 16, y: 65, s: 3,   dur: 4,  del: 2.1  },
  { id: 19, x: 48, y: 5,  s: 2,   dur: 6,  del: 4.0  },
  { id: 20, x: 80, y: 72, s: 1,   dur: 5,  del: 1.7  },
  { id: 21, x: 32, y: 42, s: 2.5, dur: 7,  del: 3.8  },
  { id: 22, x: 64, y: 92, s: 1.5, dur: 4,  del: 0.4  },
  { id: 23, x: 96, y: 35, s: 2,   dur: 6,  del: 2.8  },
  { id: 24, x: 3,  y: 50, s: 1,   dur: 5,  del: 1.3  },
]

// ─── Components ───────────────────────────────────────────────────────────────

function RomanticBg({ accentColor }: { accentColor: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Large ambient glow orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: accentColor, left: '-10%', top: '-10%' }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.28, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full blur-3xl opacity-15"
        style={{ background: '#ffffff', right: '-10%', bottom: '20%' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full blur-3xl"
        style={{ background: accentColor, right: '10%', top: '5%', opacity: 0.12 }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.08, 0.20, 0.08] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      {/* Radial glow at bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 opacity-30"
        style={{ background: `radial-gradient(ellipse at 50% 100%, ${accentColor}, transparent 65%)` }}
      />

      {/* Light rays radiating from bottom */}
      {[20, 35, 50, 65, 80].map((angle, i) => (
        <div
          key={i}
          className="absolute bottom-0 left-1/2 w-px opacity-[0.07]"
          style={{
            height: '80%',
            background: `linear-gradient(0deg, ${accentColor}, transparent)`,
            transformOrigin: 'bottom center',
            transform: `rotate(${angle - 50}deg)`,
          }}
        />
      ))}

      {/* Diagonal shimmer grid */}
      <motion.div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${accentColor} 0px, transparent 1px, transparent 35px, ${accentColor} 36px)`,
        }}
        animate={{ backgroundPosition: ['0px 0px', '72px 72px'] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
      />
      {/* Anti-diagonal shimmer */}
      <motion.div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `repeating-linear-gradient(-45deg, ${accentColor} 0px, transparent 1px, transparent 55px, ${accentColor} 56px)`,
        }}
        animate={{ backgroundPosition: ['0px 0px', '-110px 110px'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Floating hearts */}
      {HEARTS.map(h => (
        <motion.div
          key={h.id}
          className="absolute select-none"
          style={{ left: `${h.x}%`, bottom: '-8%', fontSize: h.size, color: accentColor, opacity: 0 }}
          animate={{ y: [0, -900], opacity: [0, h.op, h.op, 0] }}
          transition={{ duration: h.dur, delay: h.del, repeat: Infinity, ease: 'linear' }}
        >
          ♥
        </motion.div>
      ))}

      {/* Sparkle dots */}
      {SPARKLE_DOTS.map(s => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, background: '#ffffff' }}
          animate={{ scale: [0, 1.5, 0], opacity: [0, 0.7, 0] }}
          transition={{ duration: s.dur, delay: s.del, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Pulsing concentric rings */}
      {[180, 280, 380, 480].map((size, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            border: `1px solid ${accentColor}`,
            width: size, height: size,
            left: '50%', top: '50%',
            marginLeft: -size / 2, marginTop: -size / 2,
            opacity: 0.08 + i * 0.02,
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.05, 0.18, 0.05] }}
          transition={{ duration: 5 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.2 }}
        />
      ))}
    </div>
  )
}

function FriendshipBg({ accentColor }: { accentColor: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Top radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-80 opacity-25"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${accentColor}, transparent 65%)` }}
      />
      {/* Bottom glow */}
      <motion.div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-15"
        style={{ background: accentColor }}
        animate={{ opacity: [0.10, 0.22, 0.10], scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-12"
        style={{ background: '#ffffff' }}
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, ${accentColor} 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Twinkling stars */}
      {STARS.map(s => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, background: accentColor }}
          animate={{ scale: [0.3, 2, 0.3], opacity: [0.05, 0.75, 0.05] }}
          transition={{ duration: s.dur, delay: s.del, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Cross / plus sparkles */}
      {STARS.slice(0, 10).map(s => (
        <motion.div
          key={`cross-${s.id}`}
          className="absolute"
          style={{ left: `${(s.x + 4) % 100}%`, top: `${(s.y + 7) % 100}%`, color: accentColor, fontSize: s.s + 4 }}
          animate={{ scale: [0, 1, 0], opacity: [0, 0.45, 0], rotate: [0, 45, 90] }}
          transition={{ duration: s.dur + 1, delay: s.del + 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          ✦
        </motion.div>
      ))}

      {/* Floating bubbles */}
      {BUBBLES.map(b => (
        <motion.div
          key={b.id}
          className="absolute rounded-full"
          style={{
            border: `1.5px solid ${accentColor}40`,
            background: `${accentColor}06`,
            width: b.size, height: b.size,
            left: `${b.x}%`,
            bottom: '-12%',
            opacity: 0,
          }}
          animate={{ y: [0, -950], opacity: [0, 0.5, 0.5, 0] }}
          transition={{ duration: b.dur, delay: b.del, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      {/* Concentric expanding rings */}
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            border: `1px solid ${accentColor}30`,
            width: 80 + i * 80, height: 80 + i * 80,
            left: '50%', top: '50%',
            marginLeft: -(40 + i * 40), marginTop: -(40 + i * 40),
          }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.08, 0.30, 0.08] }}
          transition={{ duration: 5 + i * 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
        />
      ))}

      {/* Shooting stars */}
      {[15, 45, 75].map((y, i) => (
        <motion.div
          key={i}
          className="absolute h-px"
          style={{
            top: `${y}%`,
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            width: 80 + i * 20,
          }}
          animate={{ left: ['-20%', '110%'], opacity: [0, 0.6, 0.6, 0] }}
          transition={{ duration: 2.5, delay: 4 + i * 5, repeat: Infinity, repeatDelay: 8 + i * 3 }}
        />
      ))}
    </div>
  )
}

function DarkBg({ accentColor }: { accentColor: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Ambient corner glows */}
      <motion.div
        className="absolute top-0 left-0 w-80 h-80 rounded-full blur-3xl"
        style={{ background: accentColor, opacity: 0.08, transform: 'translate(-30%, -30%)' }}
        animate={{ opacity: [0.05, 0.15, 0.05], scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl"
        style={{ background: accentColor, opacity: 0.10, transform: 'translate(25%, 25%)' }}
        animate={{ opacity: [0.06, 0.18, 0.06], scale: [1, 1.3, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        style={{ background: accentColor, opacity: 0.04 }}
        animate={{ opacity: [0.02, 0.10, 0.02], scale: [0.8, 1.5, 0.8] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Moving dot grid */}
      <motion.div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(circle, ${accentColor} 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
        animate={{ backgroundPosition: ['0px 0px', '28px 28px'] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      />

      {/* 2 vertical scan lines */}
      <motion.div
        className="absolute top-0 bottom-0 w-px opacity-15"
        style={{ background: `linear-gradient(180deg, transparent 0%, ${accentColor} 50%, transparent 100%)` }}
        animate={{ left: ['-5%', '105%'] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
      />
      <motion.div
        className="absolute top-0 bottom-0 w-px opacity-10"
        style={{ background: `linear-gradient(180deg, transparent 0%, ${accentColor} 50%, transparent 100%)` }}
        animate={{ left: ['-5%', '105%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear', repeatDelay: 6, delay: 7 }}
      />

      {/* 2 horizontal scan lines */}
      <motion.div
        className="absolute left-0 right-0 h-px opacity-12"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor} 50%, transparent)` }}
        animate={{ top: ['-2%', '102%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
      />
      <motion.div
        className="absolute left-0 right-0 h-px opacity-8"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor} 50%, transparent)` }}
        animate={{ top: ['102%', '-2%'] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'linear', repeatDelay: 5, delay: 5 }}
      />

      {/* Diagonal accent lines */}
      <motion.div
        className="absolute opacity-[0.06]"
        style={{
          width: 2, height: '160%', background: accentColor,
          left: '20%', top: '-30%',
          transformOrigin: 'center',
          transform: 'rotate(25deg)',
        }}
        animate={{ opacity: [0.03, 0.10, 0.03] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute opacity-[0.05]"
        style={{
          width: 1, height: '160%', background: accentColor,
          left: '70%', top: '-30%',
          transformOrigin: 'center',
          transform: 'rotate(-20deg)',
        }}
        animate={{ opacity: [0.02, 0.08, 0.02] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Floating particles */}
      {DARK_PARTICLES.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s * 2, height: p.s * 2, background: accentColor }}
          animate={{ opacity: [0, 0.55, 0], scale: [0.5, 1.8, 0.5] }}
          transition={{ duration: p.dur, delay: p.del, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function NeonBg({ accentColor }: { accentColor: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Grid */}
      <motion.div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(${accentColor} 1px, transparent 1px), linear-gradient(90deg, ${accentColor} 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
        animate={{ backgroundPosition: ['0px 0px', '50px 50px'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Corner neon glows */}
      <motion.div
        className="absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl"
        style={{ background: accentColor, opacity: 0.12, transform: 'translate(-40%, -40%)' }}
        animate={{ opacity: [0.07, 0.18, 0.07], scale: [1, 1.25, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl"
        style={{ background: accentColor, opacity: 0.14, transform: 'translate(35%, 35%)' }}
        animate={{ opacity: [0.08, 0.22, 0.08], scale: [1, 1.3, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"
        style={{ background: accentColor, opacity: 0.08 }}
        animate={{ opacity: [0.04, 0.16, 0.04], scale: [0.8, 2, 0.8] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Expanding pulse rings — from center */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            border: `1px solid ${accentColor}`,
            boxShadow: `0 0 10px ${accentColor}80, inset 0 0 10px ${accentColor}20`,
            width: 50, height: 50,
            left: '50%', top: '50%',
            marginLeft: -25, marginTop: -25,
          }}
          animate={{ scale: [1, 10], opacity: [0.7, 0] }}
          transition={{ duration: 4, delay: i * 0.65, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {/* Glitch horizontal streaks — more of them, slower repeat */}
      {[8, 22, 38, 54, 70, 84].map((y, i) => (
        <motion.div
          key={i}
          className="absolute left-0 right-0 h-px"
          style={{
            top: `${y}%`,
            background: `linear-gradient(90deg, transparent, ${accentColor}CC, transparent)`,
            boxShadow: `0 0 6px ${accentColor}`,
          }}
          animate={{ opacity: [0, 0.8, 0, 0.4, 0], scaleX: [0.2, 1, 0.5, 0.9, 0] }}
          transition={{
            duration: 0.5,
            delay: 0.5 + i * 1.8,
            repeat: Infinity,
            repeatDelay: 5 + i * 1.5,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Vertical neon lines */}
      {[25, 50, 75].map((x, i) => (
        <motion.div
          key={i}
          className="absolute top-0 bottom-0 w-px"
          style={{
            left: `${x}%`,
            background: `linear-gradient(180deg, transparent, ${accentColor}60, transparent)`,
          }}
          animate={{ opacity: [0, 0.25, 0], scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 3, delay: 2 + i * 2, repeat: Infinity, repeatDelay: 6, ease: 'easeInOut' }}
        />
      ))}

      {/* Electric particles */}
      {NEON_PARTICLES.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.s * 2, height: p.s * 2,
            background: accentColor,
            boxShadow: `0 0 6px ${accentColor}`,
          }}
          animate={{ opacity: [0, 0.8, 0], scale: [0.5, 2, 0.5] }}
          transition={{ duration: p.dur, delay: p.del, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

export function ThemeBackground({ themeName, accentColor }: Props) {
  switch (themeName) {
    case 'romantic':   return <RomanticBg accentColor={accentColor} />
    case 'friendship': return <FriendshipBg accentColor={accentColor} />
    case 'dark':       return <DarkBg accentColor={accentColor} />
    case 'neon':       return <NeonBg accentColor={accentColor} />
    default:           return null
  }
}
