import React, { createContext, useContext, useEffect, useState } from 'react'

const UIFeedbackContext = createContext()

export const UIFeedbackProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try { return JSON.parse(localStorage.getItem('soundEnabled')) ?? true } catch { return true }
  })

  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    try { localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled)) } catch {}
  }, [soundEnabled])

  const toggleSound = () => setSoundEnabled(s => !s)

  const playChime = () => {
    if (!soundEnabled) return
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const now = ctx.currentTime

      const hit = (freq, time, dur = 0.18) => {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        const bp = ctx.createBiquadFilter()
        o.type = 'sine'
        o.frequency.setValueAtTime(freq, time)
        g.gain.setValueAtTime(0.0001, time)
        g.gain.exponentialRampToValueAtTime(0.6, time + 0.005)
        g.gain.exponentialRampToValueAtTime(0.0001, time + dur)
        bp.type = 'bandpass'
        bp.frequency.setValueAtTime(180, time)
        bp.Q.setValueAtTime(0.8, time)
        o.connect(bp)
        bp.connect(g)
        g.connect(ctx.destination)
        o.start(time)
        o.stop(time + dur + 0.02)
      }

      // two low percussive hits (tam-tam)
      hit(120, now + 0.01, 0.18)
      hit(100, now + 0.24, 0.2)

      setTimeout(() => { try { ctx.close() } catch (e) {} }, 1200)
    } catch (e) {
      /* ignore if WebAudio not available */
    }
  }

  const celebrate = () => {
    playChime()
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 1600)
  }

  return (
    <UIFeedbackContext.Provider value={{ soundEnabled, toggleSound, celebrate, showConfetti }}>{children}</UIFeedbackContext.Provider>
  )
}

export const useUIFeedback = () => useContext(UIFeedbackContext)

export default UIFeedbackContext
