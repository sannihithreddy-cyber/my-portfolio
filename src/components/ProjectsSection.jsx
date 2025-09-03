import { ExternalLink, Github, ArrowRight } from 'lucide-react'
import { useProfile } from '@/data/ProfileContext.jsx'
export default function ProjectsSection() {
  const profile = useProfile()
  const PROJECTS = Array.isArray(profile.projects) ? profile.projects : []

  return (
    <section id="projects" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="reveal text-3xl md:text-4xl font-bold text-center">
          Featured <span className="text-gradient-animated">Projects</span>
        </h2>
        <p className="reveal text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          A few recent builds showcasing design, performance, and developer experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((p) => (
            <div key={p.id} className="group surface-card overflow-hidden hover-lift reveal">
              <div className="h-48 overflow-hidden bg-[hsl(var(--secondary)/0.3)]">
                {/* If images are not present yet, this block keeps layout clean */}
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {(p.tags || []).map((t, i) => (
                    <span key={i} className="px-2 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-semibold mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{p.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-3">
                    <a
                      href={p.demoUrl}
                      target="_blank"
                      className="text-foreground opacity-80 hover:opacity-100 hover:text-primary transition-colors"
                    >
                      <ExternalLink size={20} />
                    </a>
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      className="text-foreground opacity-80 hover:opacity-100 hover:text-primary transition-colors"
                    >
                      <Github size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href={profile.socials?.github || 'https://github.com/sannihithreddy-cyber'}
            target="_blank"
            rel="noopener noreferrer"
            className="cosmic-button inline-flex items-center gap-2 mx-auto"
          >
            Check my GitHub <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}
