import { useEffect, useRef } from 'react'

/**
 * DataFlowCanvas — abstract "living data" animation for the hero section.
 * Flowing bezier streams with glowing particles traveling along them.
 */

const STREAM_COUNT = 7
const PARTICLES_PER_STREAM = 6
const BASE_SPEED = 0.0004

// Tailwind 4 stores --primary as raw "H S% L%" without hsl() wrapper.
// Canvas needs proper hsla(H, S%, L%, A) with commas.
function hsla(opacity = 1) {
  try {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary')
      .trim() // e.g. "259 84% 64%"
    const parts = raw.split(' ')
    if (parts.length === 3) {
      return `hsla(${parts[0]}, ${parts[1]}, ${parts[2]}, ${opacity})`
    }
  } catch (_) {}
  return `hsla(259, 84%, 64%, ${opacity})`
}

function makeStreams() {
  return Array.from({ length: STREAM_COUNT }, (_, i) => ({
    yRatio: (i + 1) / (STREAM_COUNT + 1),
    amplitude: 28 + Math.random() * 40,
    frequency: 1.2 + Math.random() * 1.4,
    phaseOffset: Math.random() * Math.PI * 2,
    breathSpeed: 0.3 + Math.random() * 0.4,
    breathPhase: Math.random() * Math.PI * 2,
    lineOpacity: 0.12 + Math.random() * 0.12,
  }))
}

function streamY(stream, x, w, h, time) {
  const breathe = 1 + 0.25 * Math.sin(time * stream.breathSpeed + stream.breathPhase)
  return (
    stream.yRatio * h +
    stream.amplitude * breathe * Math.sin((x / w) * Math.PI * stream.frequency + stream.phaseOffset + time * 0.4)
  )
}

function makeParticles(streams) {
  return streams.flatMap((_, si) =>
    Array.from({ length: PARTICLES_PER_STREAM }, (__, pi) => ({
      streamIndex: si,
      progress: pi / PARTICLES_PER_STREAM,
      speed: BASE_SPEED * (0.7 + Math.random() * 0.9),
      size: 1.5 + Math.random() * 2.5,
      opacity: 0.5 + Math.random() * 0.5,
    }))
  )
}

export default function DataFlowCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let w = 0, h = 0
    let streams = []
    let particles = []
    let raf = null
    let time = 0

    function resize() {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
      streams = makeStreams()
      particles = makeParticles(streams)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    function draw() {
      ctx.clearRect(0, 0, w, h)
      time += 0.016

      // Draw stream paths
      streams.forEach((stream) => {
        ctx.beginPath()
        const steps = Math.ceil(w / 4)
        for (let i = 0; i <= steps; i++) {
          const x = (i / steps) * w
          const y = streamY(stream, x, w, h, time)
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.strokeStyle = hsla(stream.lineOpacity)
        ctx.lineWidth = 1.2
        ctx.stroke()
      })

      // Draw particles
      particles.forEach((p) => {
        p.progress += p.speed
        if (p.progress > 1) p.progress -= 1

        const stream = streams[p.streamIndex]
        const x = p.progress * w
        const y = streamY(stream, x, w, h, time)

        // Soft glow ring
        const grad = ctx.createRadialGradient(x, y, 0, x, y, p.size * 4)
        grad.addColorStop(0, hsla(p.opacity))
        grad.addColorStop(1, hsla(0))

        ctx.beginPath()
        ctx.arc(x, y, p.size * 4, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(x, y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = hsla(p.opacity)
        ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
