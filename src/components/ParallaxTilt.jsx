import { useEffect, useRef } from 'react'

export default function ParallaxTilt({ children, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0

    function onMove(e) {
      // Use viewport centre as reference so distant mouse movement barely registers
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const x = (e.clientX - cx) / cx   // -1 to 1
      const y = (e.clientY - cy) / cy   // -1 to 1
      // Max tilt reduced to 1.2° and clamped — very subtle
      const rx = Math.max(-1, Math.min(1, y)) * 1.2
      const ry = Math.max(-1, Math.min(1, -x)) * 1.2
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(1200px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
      })
    }

    function onLeave() {
      cancelAnimationFrame(raf)
      el.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)'
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
    }
  }, [])

  return (
    <div ref={ref} className={className} style={{ transformStyle: 'preserve-3d', transition: 'transform .6s ease' }}>
      {children}
    </div>
  )
}
