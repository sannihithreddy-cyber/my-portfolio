import { ArrowDown } from 'lucide-react'
import { useProfile } from '@/data/ProfileContext.jsx'
import BackgroundOrbs from '@/components/BackgroundOrbs.jsx'
import ConstellationCanvas from '@/components/ConstellationCanvas.jsx'
import ParallaxTilt from '@/components/ParallaxTilt.jsx'
import Magnetic from '@/components/Magnetic.jsx'

export default function HeroSection() {
  const profile = useProfile()
  const hasHero = Boolean(profile?.name || profile?.role)

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-4">
      <BackgroundOrbs />
      <ConstellationCanvas />
      <div className="grid-overlay" />
      <div className="container max-w-5xl mx-auto text-center z-10 relative">
        <ParallaxTilt className="space-y-7">
          {hasHero ? (
            <h1 className="reveal text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              <span className="opacity-80">Hi, I&apos;m</span>{' '}
              {(() => {
                const parts = (profile.name || '').trim().split(' ')
                const first = parts[0] || ''
                const last = parts.slice(1).join(' ')
                return (
                  <>
                    <span className="text-primary">{first}</span>{' '}
                    {last ? (
                      <span className="text-gradient-animated ml-2">{last}</span>
                    ) : null}
                  </>
                )
              })()}
            </h1>
          ) : null}
          {profile.role ? (
            <p className="reveal text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in-delay-3">
              {profile.role}
            </p>
          ) : null}
          {!hasHero ? (
            <div className="text-muted-foreground reveal">Loading profile…</div>
          ) : null}
          <div className="reveal">
            <Magnetic strength={12}>
              <a id="hero-cta" href="#projects" className="cosmic-button mt-4 inline-flex">View my work</a>
            </Magnetic>
          </div>
        </ParallaxTilt>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
        <span className="text-sm text-muted-foreground mb-2">Scroll</span>
        <ArrowDown className="h-5 w-5 text-primary" />
      </div>
    </section>
  )
}
