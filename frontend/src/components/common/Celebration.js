import React from 'react'
import './celebration.css'

export default function Celebration({ show }) {
  if (!show) return null
  const pieces = Array.from({ length: 18 })
  return (
    <div className="celebration-root" aria-hidden>
      {pieces.map((_, i) => (
        <span key={i} className={`confetti confetti-${i % 6}`} />
      ))}
    </div>
  )
}
