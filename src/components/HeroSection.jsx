import { ArrowDown } from 'lucide-react'
import { useProfile } from '@/data/ProfileContext.jsx'

export default function HeroSection() {
  const profile = useProfile()

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-4">
      <div className="container max-w-4xl mx-auto text-center z-10">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="opacity-0 animate-fade-in">Hi, I&apos;m</span>{' '}
            {(() => {
              const parts = (profile.name || '').trim().split(' ')
              const first = parts[0] || 'Your'
              const last = parts.slice(1).join(' ')
              return (
                <>
                  <span className="text-primary opacity-0 animate-fade-in-delay-1">{first}</span>{' '}
                  {last ? (
                    <span className="text-gradient ml-2 opacity-0 animate-fade-in-delay-2">{last}</span>
                  ) : null}
                </>
              )
            })()}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in-delay-3">
            {profile.role || 'Software Developer'} — I build responsive web experiences with React and Tailwind, blending performance, accessibility, and delightful UI.
          </p>
          <div>
            <a href="#projects" className="cosmic-button opacity-0 animate-fade-in-delay-4 mt-4 inline-flex">View my work</a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
        <span className="text-sm text-muted-foreground mb-2">Scroll</span>
        <ArrowDown className="h-5 w-5 text-primary" />
      </div>
    </section>
  )
}
