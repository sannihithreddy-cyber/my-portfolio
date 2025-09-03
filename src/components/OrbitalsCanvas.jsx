import { useEffect, useRef } from 'react'

export default function OrbitalsCanvas({ className = '' }) {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    let raf = 0
    let t = 0
    let mouse = { x: -9999, y: -9999 }

    function size() {
      const rect = wrap.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      return { w: rect.width, h: rect.height }
    }

    let { w, h } = size()
    let cx = w / 2
    let cy = h / 2

    const rings = [
      { r: Math.min(w, h) * 0.18, speed: 0.015, nodes: 6 },
      { r: Math.min(w, h) * 0.28, speed: -0.011, nodes: 8 },
      { r: Math.min(w, h) * 0.38, speed: 0.008, nodes: 10 },
    ]
    const nodes = []
    rings.forEach((ring, i) => {
      for (let k = 0; k < ring.nodes; k++) {
        nodes.push({
          ring: i,
          baseAngle: (Math.PI * 2 * k) / ring.nodes + Math.random() * 0.5,
          jitter: Math.random() * 1000,
        })
      }
    })

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // backdrop rings
      ctx.strokeStyle = 'rgba(120,120,150,0.20)'
      ctx.lineWidth = 1
      rings.forEach((ring) => {
        ctx.beginPath()
        ctx.arc(cx, cy, ring.r, 0, Math.PI * 2)
        ctx.stroke()
      })

      // orbiting nodes
      const now = t
      nodes.forEach((n) => {
        const ring = rings[n.ring]
        const ang = n.baseAngle + now * ring.speed
        const radialJitter = Math.sin(now * 0.8 + n.jitter) * 3
        const x = cx + Math.cos(ang) * (ring.r + radialJitter)
        const y = cy + Math.sin(ang) * (ring.r + radialJitter)

        // connection to nearby mouse
        if (mouse.x > -999) {
          const dx = x - mouse.x, dy = y - mouse.y
          const d2 = dx * dx + dy * dy
          const max = 140
          if (d2 < max * max) {
            const a = 1 - Math.sqrt(d2) / max
            ctx.strokeStyle = `hsla(198 93% 60% / ${a * 0.5})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
          }
        }

        // node
        ctx.fillStyle = 'rgba(180,180,200,0.9)'
        ctx.beginPath()
        ctx.arc(x, y, 2.2, 0, Math.PI * 2)
        ctx.fill()
      })

      // gentle rotating chords between rings (spark lines)
      ctx.strokeStyle = 'hsla(259 84% 64% / 0.22)'
      ctx.lineWidth = 1
      for (let i = 0; i < rings.length - 1; i++) {
        const r1 = rings[i]
        const r2 = rings[i + 1]
        const a = now * (r1.speed * 0.8)
        const x1 = cx + Math.cos(a) * r1.r
        const y1 = cy + Math.sin(a) * r1.r
        const x2 = cx + Math.cos(-a * 1.1) * r2.r
        const y2 = cy + Math.sin(-a * 1.1) * r2.r
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      t += 1
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    function onMove(e) {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    function onLeave() { mouse.x = -9999; mouse.y = -9999 }
    function onResize() { ({ w, h } = size()); cx = w / 2; cy = h / 2 }
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
    <div ref={wrapRef} className={`absolute inset-0 z-0 pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

