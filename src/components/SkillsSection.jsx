import { useMemo, useState } from 'react'
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

  if (!ALL_SKILLS.length) return null
  return (
    <section id="skills" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="reveal text-3xl md:text-4xl font-bold mb-12 text-center">
          My <span className="text-gradient-animated">Skills</span>
        </h2>

        <div className="reveal flex flex-wrap justify-center gap-4 mb-12">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={
                active === c
                  ? 'px-5 py-2 rounded-full bg-primary text-primary-foreground capitalize transition-colors duration-300 hover:shadow'
                  : 'px-5 py-2 rounded-full surface-glass capitalize transition-colors duration-300'
              }
            >
              {c === 'ai-enthusiast' ? 'AI Enthusiast' : c === 'fullstack' ? 'Full Stack' : c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, idx) => (
            <div key={`${skill.name}-${idx}`} className="surface-card hover-lift reveal p-6">
              <div className="mb-4 text-left">
                <h3 className="font-semibold text-lg">{skill.name}</h3>
              </div>
              <div className="w-full bg-secondary/50 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-2 rounded-full origin-left animate-grow"
                  style={{ width: `${skill.level}%` }}
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
