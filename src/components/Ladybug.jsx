import { useEffect, useMemo, useRef, useState } from 'react'

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)) }
function randomIn(min, max) { return Math.random() * (max - min) + min }

function randomPoint(bounds, inset = 0.1) {
  const w = bounds.width, h = bounds.height
  const ix = inset * w, iy = inset * h
  return { x: randomIn(ix, w - ix), y: randomIn(iy, h - iy) }
}

function cubicPath(from, to, bounds) {
  const w = bounds.width, h = bounds.height
  const dx = to.x - from.x
  const dy = to.y - from.y
  const len = Math.hypot(dx, dy) || 1
  const norm = { x: dx / len, y: dy / len }
  const perp = { x: -norm.y, y: norm.x }
  const magnitude = clamp(len * randomIn(0.2, 0.45), 60, Math.min(w, h) * 0.35)
  const c1 = { x: from.x + dx * 0.25 + perp.x * randomIn(-magnitude, magnitude), y: from.y + dy * 0.25 + perp.y * randomIn(-magnitude, magnitude) }
  const c2 = { x: from.x + dx * 0.75 + perp.x * randomIn(-magnitude, magnitude), y: from.y + dy * 0.75 + perp.y * randomIn(-magnitude, magnitude) }
  return `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${to.x.toFixed(1)} ${to.y.toFixed(1)}`
}

export default function Ladybug({ enabled = true }) {
  const rootRef = useRef(null)
  const posRef = useRef({ x: 0, y: 0 })
  const [path, setPath] = useState('')
  const [dur, setDur] = useState(8)
  const [animKey, setAnimKey] = useState(0)
  const isReduced = useMemo(() => prefersReducedMotion(), [])
  const timerRef = useRef(null)

  useEffect(() => {
    if (!enabled || isReduced) return
    const bounds = { width: window.innerWidth, height: window.innerHeight }
    if (posRef.current.x === 0 && posRef.current.y === 0) {
      posRef.current = randomPoint(bounds, 0.12)
    }
    let stopped = false

    function flyToRandom() {
      if (stopped) return
      const from = posRef.current
      const to = randomPoint(bounds, 0.12)
      posRef.current = to
      const nextDur = randomIn(6.5, 9.5)
      setDur(nextDur)
      setPath(cubicPath(from, to, bounds))
      setAnimKey((k) => k + 1)
      // Timer fallback to keep motion continuous even if animationend doesn't fire
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => flyToRandom(), nextDur * 1000)
    }

    flyToRandom()
    const el = rootRef.current
    if (!el) return
    function handleEnd() {
      // Immediately continue to the next segment (no pause)
      flyToRandom()
    }
    el.addEventListener('animationend', handleEnd)
    const onResize = () => flyToRandom()
    window.addEventListener('resize', onResize)
    return () => {
      stopped = true
      clearTimeout(timerRef.current)
      el && el.removeEventListener('animationend', handleEnd)
      window.removeEventListener('resize', onResize)
    }
  }, [enabled, isReduced])

  if (!enabled || isReduced) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50" aria-hidden>
      <div
        ref={rootRef}
        key={animKey}
        className="ladybug animate-ladybug pointer-events-auto"
        style={{
          offsetPath: path ? `path('${path}')` : undefined,
          offsetDistance: '0%',
          animationDuration: `${dur}s`,
        }}
        title="Hello!"
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bugGrad" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#ff8a8a"/>
              <stop offset="100%" stopColor="#ef4444"/>
            </radialGradient>
          </defs>
          <g transform="translate(6,6)">
            <circle cx="12" cy="12" r="11" fill="url(#bugGrad)" stroke="#111827" strokeWidth="1"/>
            <circle cx="12" cy="5" r="5" fill="#111827"/>
            <g className="wing wing-left" transform="translate(12,12)">
              <path d="M0 0 C -6 -2, -8 6, -1 8" fill="rgba(255,255,255,0.15)"/>
            </g>
            <g className="wing wing-right" transform="translate(12,12)">
              <path d="M0 0 C 6 -2, 8 6, 1 8" fill="rgba(255,255,255,0.15)"/>
            </g>
            <circle cx="16" cy="14" r="1.4" fill="#111827"/>
            <circle cx="8" cy="14" r="1.4" fill="#111827"/>
            <circle cx="12" cy="18" r="1.2" fill="#111827"/>
            <line x1="12" y1="6" x2="12" y2="23" stroke="#111827" strokeWidth="1"/>
          </g>
        </svg>
      </div>
    </div>
  )
}
