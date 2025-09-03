import { useEffect, useRef } from 'react'

export default function ParallaxTilt({ children, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    function onMove(e) {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - (rect.left + rect.width / 2)) / rect.width
      const y = (e.clientY - (rect.top + rect.height / 2)) / rect.height
      const rx = Math.max(-1, Math.min(1, y)) * 4
      const ry = Math.max(-1, Math.min(1, -x)) * 4
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
      })
    }
    function onLeave() {
      cancelAnimationFrame(raf)
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
    }
  }, [])

  return (
    <div ref={ref} className={className} style={{ transformStyle: 'preserve-3d', transition: 'transform .25s ease' }}>
      {children}
    </div>
  )
}

