'use client'

import { motion } from 'framer-motion'

const ORB_CONFIGS = [
  { x: '5%',  y: '8%',  size: 280, dur: 12, delay: 0,   alt: false },
  { x: '60%', y: '55%', size: 200, dur: 15, delay: 3,   alt: true  },
  { x: '15%', y: '65%', size: 150, dur: 10, delay: 6,   alt: false },
  { x: '72%', y: '5%',  size: 170, dur: 13, delay: 1.5, alt: true  },
  { x: '40%', y: '35%', size: 120, dur: 8,  delay: 4,   alt: false },
]

export function FloatingOrbs({ accentColor }: { accentColor: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {ORB_CONFIGS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: orb.alt ? 'rgba(255,255,255,0.9)' : accentColor,
            opacity: 0.07,
            filter: 'blur(70px)',
          }}
          animate={{
            x: [0, 25, -15, 10, 0],
            y: [0, -20, 25, -8, 0],
            scale: [1, 1.1, 0.93, 1.05, 1],
          }}
          transition={{
            duration: orb.dur,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
