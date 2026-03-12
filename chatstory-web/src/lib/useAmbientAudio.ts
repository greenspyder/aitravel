'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import { ThemeName } from '@/types/chat'

interface ThemeAudioConfig {
  frequencies: number[]   // oscillator freqs
  lfoRate: number         // LFO speed (Hz)
  lfoDepth: number        // vibrato depth (cents)
  filterFreq: number      // lowpass cutoff
  masterGain: number      // overall volume
  waveType: OscillatorType
}

const THEME_AUDIO: Record<ThemeName, ThemeAudioConfig> = {
  romantic: {
    frequencies: [220, 277.18, 329.63, 415.3],  // A3, C#4, E4, G#4 — A major arp
    lfoRate: 0.25,
    lfoDepth: 3,
    filterFreq: 900,
    masterGain: 0.07,
    waveType: 'sine',
  },
  friendship: {
    frequencies: [261.63, 329.63, 392, 523.25],  // C4, E4, G4, C5 — C major
    lfoRate: 0.4,
    lfoDepth: 4,
    filterFreq: 1200,
    masterGain: 0.065,
    waveType: 'sine',
  },
  dark: {
    frequencies: [55, 110, 82.41, 164.81],  // A1, A2, E2, E3 — power chord drone
    lfoRate: 0.1,
    lfoDepth: 1,
    filterFreq: 500,
    masterGain: 0.08,
    waveType: 'sine',
  },
  neon: {
    frequencies: [140, 210, 280, 420],  // slightly dissonant electronic feel
    lfoRate: 0.6,
    lfoDepth: 5,
    filterFreq: 1800,
    masterGain: 0.055,
    waveType: 'sine',
  },
}

export function useAmbientAudio(themeName: ThemeName) {
  const [muted, setMuted] = useState(true)
  const ctxRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<(AudioNode | OscillatorNode)[]>([])

  const stop = useCallback(() => {
    nodesRef.current.forEach(n => {
      try { (n as OscillatorNode).stop?.() } catch {}
    })
    nodesRef.current = []
  }, [])

  const start = useCallback(() => {
    stop()
    if (typeof window === 'undefined') return
    const ctx = ctxRef.current ?? new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    ctxRef.current = ctx
    if (ctx.state === 'suspended') ctx.resume()

    const config = THEME_AUDIO[themeName]
    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0, ctx.currentTime)
    masterGain.gain.linearRampToValueAtTime(config.masterGain, ctx.currentTime + 1.5)
    masterGain.connect(ctx.destination)
    nodesRef.current.push(masterGain)

    config.frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      osc.type = config.waveType
      osc.frequency.setValueAtTime(freq, ctx.currentTime)

      // LFO for slow vibrato / movement
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.type = 'sine'
      lfo.frequency.setValueAtTime(config.lfoRate + i * 0.07, ctx.currentTime)
      lfoGain.gain.setValueAtTime(config.lfoDepth, ctx.currentTime)
      lfo.connect(lfoGain)
      lfoGain.connect(osc.detune)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(config.filterFreq, ctx.currentTime)
      filter.Q.setValueAtTime(0.5, ctx.currentTime)

      // Each harmonic gets quieter
      gainNode.gain.setValueAtTime(1 / Math.pow(i + 1, 1.4), ctx.currentTime)

      osc.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(masterGain)

      osc.start()
      lfo.start()

      nodesRef.current.push(osc, lfo, gainNode, filter, lfoGain)
    })
  }, [themeName, stop])

  const toggle = useCallback(() => {
    if (muted) {
      start()
      setMuted(false)
    } else {
      // Fade out then stop
      if (ctxRef.current) {
        const ctx = ctxRef.current
        const masterGain = nodesRef.current[0] as GainNode
        if (masterGain && 'gain' in masterGain) {
          masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5)
        }
        setTimeout(() => stop(), 600)
      }
      setMuted(true)
    }
  }, [muted, start, stop])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop()
      ctxRef.current?.close()
    }
  }, [stop])

  return { muted, toggle }
}
