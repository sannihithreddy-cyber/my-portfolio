import { ArrowDown } from 'lucide-react'
import { useProfile } from '@/data/ProfileContext.jsx'
import DataFlowCanvas from '@/components/DataFlowCanvas.jsx'
import ParallaxTilt from '@/components/ParallaxTilt.jsx'
import Magnetic from '@/components/Magnetic.jsx'

export default function HeroSection() {
  const profile = useProfile() || {}
  const hasHero = Boolean(profile?.name || profile?.role)
  const parts = (profile?.name || '').trim().split(' ')
  const first = parts[0] || ''
  const last = parts.slice(1).join(' ')

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      <DataFlowCanvas />

      {/* Soft radial fog centred on text so it stays readable against the canvas */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 50% 50%, hsl(var(--background) / 0.82) 0%, hsl(var(--background) / 0.45) 55%, transparent 100%)',
        }}
      />

      <div className="container max-w-4xl mx-auto text-center z-10 relative">
        <ParallaxTilt className="space-y-6">

          {/* Name */}
          {hasHero ? (
            <h1 className="reveal text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              <span className="opacity-60 text-3xl md:text-4xl font-normal block mb-2">Hi, I&apos;m</span>
              {first && <span className="text-foreground">{first}</span>}
              {last && <span className="text-gradient-animated ml-3">{last}</span>}
            </h1>
          ) : null}

          {/* Role */}
          {profile?.role ? (
            <p className="reveal text-base md:text-lg text-muted-foreground max-w-xl mx-auto tracking-wide">
              {profile.role}
            </p>
          ) : null}

          {/* One-liner hook */}
          <p className="reveal text-sm text-muted-foreground/70 max-w-md mx-auto italic">
            Turning raw data into decisions people actually act on.
          </p>

          {/* CTA */}
          <div className="reveal flex justify-center gap-4 pt-2">
            <Magnetic strength={12}>
              <a href="#projects" className="cosmic-button inline-flex">View my work</a>
            </Magnetic>
            <a
              href="#contact"
              className="inline-flex px-6 py-2 rounded-full border border-primary/40 text-primary text-sm hover:bg-primary/10 transition-colors duration-300"
            >
              Get in touch
            </a>
          </div>

        </ParallaxTilt>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
        <span className="text-xs text-muted-foreground/60 mb-2 tracking-widest uppercase">Scroll</span>
        <ArrowDown className="h-4 w-4 text-primary/60" />
      </div>
    </section>
  )
}
