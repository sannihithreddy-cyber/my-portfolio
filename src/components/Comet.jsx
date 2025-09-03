import { useEffect, useMemo, useRef, useState } from 'react'

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function rand(min, max) { return Math.random() * (max - min) + min }

export default function Comet({ intervalMin = 4000, intervalMax = 9000 }) {
  const [key, setKey] = useState(0)
  const [vars, setVars] = useState({})
  const reduced = useMemo(() => prefersReducedMotion(), [])
  const timerRef = useRef(null)

  useEffect(() => {
    if (reduced) return
    function launch() {
      const w = window.innerWidth
      const h = window.innerHeight
      // randomize entry/exit edges and angle
      const startSide = Math.random() < 0.5 ? 'left' : 'top'
      const angle = rand(-20, 20) + (startSide === 'left' ? 30 : -30)
      const x0 = startSide === 'left' ? -100 : rand(0, w * 0.6)
      const y0 = startSide === 'left' ? rand(0, h * 0.6) : -100
      const x1 = startSide === 'left' ? w + 100 : rand(w * 0.4, w)
      const y1 = startSide === 'left' ? rand(h * 0.4, h) : h + 100
      const dur = rand(3.5, 6.5)
      setVars({
        ['--x0']: `${x0}px`,
        ['--y0']: `${y0}px`,
        ['--x1']: `${x1}px`,
        ['--y1']: `${y1}px`,
        ['--rot']: `${angle}deg`,
        ['--dur']: `${dur}s`,
      })
      setKey((k) => k + 1)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(launch, rand(intervalMin, intervalMax))
    }
    launch()
    return () => clearTimeout(timerRef.current)
  }, [intervalMin, intervalMax, reduced])

  if (reduced) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-30" aria-hidden>
      <div key={key} className="comet" style={vars} />
    </div>
  )
}

