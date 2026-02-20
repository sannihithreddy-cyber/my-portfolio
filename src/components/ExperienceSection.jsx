import { useProfile } from '@/data/ProfileContext.jsx'

function ExperienceCard({ job }) {
  return (
    <div className="reveal relative pl-10 pb-14 last:pb-0">
      {/* Timeline line */}
      <span className="absolute left-0 top-3 bottom-0 w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent" aria-hidden="true" />
      {/* Timeline dot */}
      <span className="absolute left-[-4px] top-3 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" aria-hidden="true" />

      <div className="surface-card p-7 rounded-2xl hover-lift text-left">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
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

        {/* Prose paragraphs — no bullet clutter */}
        <div className="space-y-3">
          {(job.bullets || []).map((b, i) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">{b}</p>
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
