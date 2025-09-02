import { Code, Palette, Briefcase } from 'lucide-react'
import { useProfile } from '@/data/ProfileContext.jsx'

function Feature({ icon, title, children }) {
  return (
    <div className="gradient-border p-6 card-hover">
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
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">About <span className="text-primary">Me</span></h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">{profile.about?.title || 'About me'}</h3>
            {(profile.about?.paragraphs || []).map((p, i) => (
              <p key={i} className="text-muted-foreground">{p}</p>
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

          <div className="grid grid-cols-1 gap-6">
            <Feature title="Web Development" icon={<Code className="h-6 w-6" />}>Creating responsive, accessible web applications with modern frameworks.</Feature>
            <Feature title="UI/UX Design" icon={<Palette className="h-6 w-6" />}>Designing intuitive interfaces and seamless user experiences.</Feature>
            <Feature title="Leadership & Ownership" icon={<Briefcase className="h-6 w-6" />}>Leading projects end-to-end with a focus on quality and impact.</Feature>
          </div>
        </div>
      </div>
    </section>
  )
}
