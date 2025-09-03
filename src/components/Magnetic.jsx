import { useEffect, useRef } from 'react'

export default function Magnetic({ children, strength = 10, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    function onMove(e) {
      const r = el.getBoundingClientRect()
      const mx = e.clientX - (r.left + r.width / 2)
      const my = e.clientY - (r.top + r.height / 2)
      const tx = (mx / (r.width / 2)) * strength
      const ty = (my / (r.height / 2)) * strength
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`
      })
    }
    function onLeave() {
      cancelAnimationFrame(frame)
      el.style.transform = 'translate(0px, 0px)'
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
    }
  }, [strength])

  return (
    <span ref={ref} className={className} style={{ display: 'inline-block', willChange: 'transform' }}>
      {children}
    </span>
  )
}

