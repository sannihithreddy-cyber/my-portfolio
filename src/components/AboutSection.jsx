import { BarChart2, Database, Code2, TrendingUp } from 'lucide-react'
import { useProfile } from '@/data/ProfileContext.jsx'

const SERVICES = [
  {
    icon: BarChart2,
    title: 'Dashboard Development',
    desc: 'Interactive Power BI reports with DAX measures, drill-throughs, and row-level security.',
  },
  {
    icon: Database,
    title: 'Data Modeling & SQL',
    desc: 'Star-schema design, CTEs, window functions, and query optimization for fast, maintainable pipelines.',
  },
  {
    icon: Code2,
    title: 'Python & ETL',
    desc: 'pandas-based data wrangling, pre-aggregation pipelines, and automated report distribution.',
  },
  {
    icon: TrendingUp,
    title: 'Analytics & Insights',
    desc: 'EDA, KPI definition, cohort analysis, and translating business questions into clear metrics.',
  },
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

          {/* Right — what I do cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SERVICES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="reveal surface-card p-5 rounded-2xl hover-lift text-left border-l-2 border-primary/30">
                <Icon className="text-primary mb-3" size={20} strokeWidth={1.75} />
                <h3 className="font-semibold text-sm mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
