import { useProfile } from '@/data/ProfileContext.jsx'

function ExperienceCard({ job }) {
  return (
    <div className="reveal relative pl-10 pb-12 last:pb-0">
      {/* Timeline line */}
      <span className="absolute left-0 top-3 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/15 to-transparent" aria-hidden="true" />
      <div className="surface-card p-7 rounded-2xl hover-lift text-left border-l-2 border-primary/40">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-5">
          <div>
            <h3 className="font-bold text-lg leading-snug">{job.role}</h3>
            <p className="text-primary font-semibold text-sm mt-0.5">{job.company}</p>
          </div>
          <div className="sm:text-right shrink-0">
            <span className="inline-block text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
              {job.period}
            </span>
            <p className="text-xs text-muted-foreground mt-1">{job.location}</p>
          </div>
        </div>

        {/* Paragraphs separated by a faint rule */}
        <div>
          {(job.bullets || []).map((b, i) => (
            <div key={i}>
              {i > 0 && (
                <div className="my-4 border-t border-border/40" />
              )}
              <p className="text-sm text-muted-foreground leading-relaxed">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ExperienceSection() {
  const profile = useProfile() || {}
  const items = Array.isArray(profile.experience) ? profile.experience : []
  if (!items.length) return null

  return (
    <section id="experience" className="py-24 px-4">
      <div className="container mx-auto max-w-3xl">
        <h2 className="reveal text-3xl md:text-4xl font-bold text-center mb-3">
          Work <span className="text-primary">Experience</span>
        </h2>
        <p className="reveal text-center text-muted-foreground mb-16 max-w-xl mx-auto">
          Where the dashboards actually had to work.
        </p>
        <div className="relative">
          {items.map((job) => (
            <ExperienceCard key={job.id || job.company} job={job} />
          ))}
        </div>
      </div>
    </section>
  )
}
