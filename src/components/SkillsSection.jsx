import { useEffect, useMemo, useState } from 'react'
import { useProfile } from '@/data/ProfileContext.jsx'

const CATEGORY_LABELS = {
  all: 'All',
  bi: 'BI & Reporting',
  sql: 'SQL',
  python: 'Python',
  analytics: 'Analytics',
  tools: 'Tools',
}

function label(c) {
  return CATEGORY_LABELS[c] ?? c.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

export default function SkillsSection() {
  const profile = useProfile() || {}
  const ALL_SKILLS = Array.isArray(profile.skills) ? profile.skills : []

  const CATEGORIES = ['all', ...Array.from(new Set(ALL_SKILLS.map((s) => s.category || 'other')))]
  const [active, setActive] = useState('all')

  const skills = useMemo(() => {
    if (active === 'all') return ALL_SKILLS
    return ALL_SKILLS.filter((s) => s.category === active)
  }, [active, ALL_SKILLS])

  useEffect(() => {
    if (ALL_SKILLS.length && active !== 'all' && skills.length === 0) {
      setActive('all')
    }
  }, [ALL_SKILLS.length, active, skills.length])

  if (!ALL_SKILLS.length) return null

  return (
    <section id="skills" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="reveal text-3xl md:text-4xl font-bold mb-4 text-center">
          My <span className="text-gradient-animated">Skills</span>
        </h2>
        <p className="reveal text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Tools and technologies I use to move data from raw to ready.
        </p>

        <div
          className="reveal flex flex-wrap justify-center gap-3 sm:gap-4 mb-12"
          role="tablist"
          aria-label="Skill categories"
        >
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={active === c}
              onClick={() => setActive(c)}
              className={
                active === c
                  ? 'inline-flex items-center px-5 py-2 rounded-full bg-primary text-primary-foreground font-semibold capitalize transition-all duration-200 shadow-md ring-2 ring-primary/50'
                  : 'inline-flex items-center px-5 py-2 rounded-full bg-secondary text-secondary-foreground border border-border/60 capitalize transition-all duration-200 hover:border-primary/40 hover:text-primary'
              }
            >
              {label(c)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {skills.map((skill, idx) => (
            <span
              key={`${skill.name}-${idx}`}
              className="reveal surface-card hover-lift px-5 py-3 rounded-full text-sm font-medium transition-all duration-200"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
