import { Code, Palette, Briefcase } from 'lucide-react'
import { useProfile } from '@/data/ProfileContext.jsx'

function Feature({ icon, title, children }) {
  return (
    <div className="gradient-border p-6 hover-lift reveal">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-full bg-[hsl(var(--primary)/0.1)] text-primary">
          {icon}
        </div>
        <div className="text-left">
          <h4 className="font-semibold text-lg">{title}</h4>
          <p className="text-muted-foreground text-sm">{children}</p>
        </div>
      </div>
    </div>
  )
}

export default function AboutSection() {
  const profile = useProfile()
  return (
    <section id="about" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="reveal text-3xl md:text-4xl font-bold mb-12 text-center">About <span className="text-primary">Me</span></h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {profile.about?.title ? (
              <h3 className="reveal text-2xl font-semibold">{profile.about.title}</h3>
            ) : null}
            {(profile.about?.paragraphs || []).map((p, i) => (
              <p key={i} className="reveal text-muted-foreground">{p}</p>
            ))}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <a href="#contact" className="cosmic-button">Get in touch</a>
              {(() => {
                const configured = profile?.about?.resumeUrl
                const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''
                const fallback = `${apiBase}/api/resume`
                const href = configured && configured !== '#' ? configured : fallback
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300"
                  >
                    Download CV
                  </a>
                )
              })()}
            </div>
          </div>

          {Array.isArray(profile.about?.features) && profile.about.features.length ? (
            <div className="grid grid-cols-1 gap-6">
              {profile.about.features.map((f, i) => (
                <Feature key={i} title={f.title} icon={<Code className="h-6 w-6" />}>{f.text}</Feature>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
