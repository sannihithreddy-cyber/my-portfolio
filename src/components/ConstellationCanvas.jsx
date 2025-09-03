import { useEffect, useRef } from 'react'

export default function ConstellationCanvas({ className = '' }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    let raf = 0
    let mouse = { x: -9999, y: -9999 }

    function sizeCanvas() {
      const rect = container.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      return { w: rect.width, h: rect.height }
    }

    const { w, h } = sizeCanvas()
    const area = w * h
    const targetCount = Math.max(100, Math.min(280, Math.floor(area / 6000)))
    const points = new Array(targetCount).fill(0).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.4,
    }))

    function step() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // draw points
      ctx.fillStyle = 'rgba(180,180,200,0.8)'
      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // draw lines
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i], b = points[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          const maxDist = 150
          if (d2 < maxDist * maxDist) {
            const alpha = 1 - Math.sqrt(d2) / maxDist
            ctx.strokeStyle = `hsla(259 84% 64% / ${Math.min(0.5, alpha * 0.5)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // mouse influence
      if (mouse.x > -999) {
        for (let i = 0; i < points.length; i++) {
          const p = points[i]
          const dx = p.x - mouse.x, dy = p.y - mouse.y
          const d2 = dx * dx + dy * dy
          const maxDist = 180
          if (d2 < maxDist * maxDist) {
            const d = Math.sqrt(d2) || 1
            const alpha = 1 - d / maxDist
            // line to mouse
            ctx.strokeStyle = `hsla(198 93% 60% / ${Math.min(0.6, alpha * 0.6)})`
            ctx.lineWidth = 1.2
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
            // slight attraction
            const ax = (dx / d) * 0.02 * alpha
            const ay = (dy / d) * 0.02 * alpha
            p.vx -= ax
            p.vy -= ay
          }
        }
      }

      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    function onMove(e) {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    function onLeave() { mouse.x = -9999; mouse.y = -9999 }
    function onResize() { sizeCanvas() }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onLeave)
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div ref={containerRef} className={`absolute inset-0 z-0 pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full"/>
    </div>
  )
}
