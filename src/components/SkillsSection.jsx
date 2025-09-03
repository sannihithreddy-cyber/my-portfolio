import { useEffect, useMemo, useState } from 'react'
import { useProfile } from '@/data/ProfileContext.jsx'

export default function SkillsSection() {
  const profile = useProfile()
  const ALL_SKILLS = Array.isArray(profile.skills) ? profile.skills : []

  // Build categories dynamically from profile
  const CATEGORIES = ['all', ...Array.from(new Set(ALL_SKILLS.map((s) => s.category || 'other')))]
  const [active, setActive] = useState('all')

  const skills = useMemo(() => {
    if (active === 'all') return ALL_SKILLS
    return ALL_SKILLS.filter((s) => s.category === active)
  }, [active])

  // Ensure we don't show an empty grid when a category has no items
  useEffect(() => {
    if (ALL_SKILLS.length && active !== 'all' && skills.length === 0) {
      setActive('all')
    }
  }, [ALL_SKILLS.length, active, skills.length])

  if (!ALL_SKILLS.length) return null
  return (
    <section id="skills" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="reveal text-3xl md:text-4xl font-bold mb-12 text-center">
          My <span className="text-gradient-animated">Skills</span>
        </h2>

        <div className="reveal flex flex-wrap justify-center gap-3 sm:gap-4 mb-12" role="tablist" aria-label="Skill categories">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={active === c}
              aria-pressed={active === c}
              title={`Filter: ${c}`}
              onClick={() => setActive(c)}
              className={
                active === c
                  ? 'inline-flex items-center px-5 py-2 rounded-full bg-primary text-primary-foreground capitalize transition-all duration-200 shadow ring-2 ring-primary/60 hover:shadow-md hover:translate-y-[1px]'
                  : 'inline-flex items-center px-5 py-2 rounded-full surface-glass text-foreground/90 capitalize transition-all duration-200 hover:bg-secondary hover:shadow-sm hover:translate-y-[1px]'
              }
            >
              {c === 'ai-enthusiast' ? 'AI Enthusiast' : c === 'fullstack' ? 'Full Stack' : c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, idx) => (
            <div key={`${skill.name}-${idx}`} className="surface-card hover-lift p-6">
              <div className="mb-4 text-left">
                <h3 className="font-semibold text-lg">{skill.name}</h3>
              </div>
              <div className="w-full bg-secondary/50 h-2 rounded-full overflow-hidden">
                <div
                  key={`${skill.name}-${active}`}
                  className="bg-primary h-2 rounded-full origin-left animate-grow"
                  style={{ width: `${skill.level}%`, animationDuration: '900ms' }}
                />
              </div>
              <div className="text-right mt-1 text-sm text-muted-foreground">
                <span>{skill.level}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
