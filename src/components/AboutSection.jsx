import { useProfile } from '@/data/ProfileContext.jsx'

const STATS = [
  { value: '15+', label: 'Dashboards shipped' },
  { value: '2+',  label: 'Years in analytics' },
  { value: '50+', label: 'Business users served' },
  { value: '40%', label: 'Avg. load-time reduction' },
]

export default function AboutSection() {
  const profile = useProfile() || {}

  const resumeHref = (() => {
    const configured = profile?.about?.resumeUrl
    const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''
    return configured && configured !== '#' ? configured : `${apiBase}/api/resume`
  })()

  return (
    <section id="about" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="reveal text-3xl md:text-4xl font-bold mb-16 text-center">
          About <span className="text-primary">Me</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

          {/* Left — text */}
          <div className="space-y-5 text-left">
            {(profile.about?.paragraphs || []).map((p, i) => (
              <p key={i} className="reveal text-muted-foreground leading-relaxed">{p}</p>
            ))}
            <div className="reveal flex flex-wrap gap-3 pt-3">
              <a href="#contact" className="cosmic-button">Get in touch</a>
              <a
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="px-6 py-2 rounded-full border border-primary/50 text-primary text-sm font-medium hover:bg-primary/8 transition-colors duration-300"
              >
                Download CV
              </a>
            </div>
          </div>

          {/* Right — stat cards */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="reveal surface-card p-6 rounded-2xl flex flex-col items-center justify-center text-center hover-lift">
                <span className="text-3xl font-extrabold text-primary mb-1">{s.value}</span>
                <span className="text-xs text-muted-foreground leading-tight">{s.label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
