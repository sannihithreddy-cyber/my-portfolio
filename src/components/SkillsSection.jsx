import { useMemo, useState } from 'react'
import { useProfile } from '@/data/ProfileContext.jsx'

export default function SkillsSection() {
  const profile = useProfile()
  const ALL_SKILLS = profile.skills && profile.skills.length ? profile.skills : [
    { name: 'HTML & CSS', level: 95, category: 'frontend' },
    { name: 'JavaScript', level: 92, category: 'frontend' },
    { name: 'React', level: 90, category: 'frontend' },
  ]

  // Build categories dynamically from profile
  const CATEGORIES = ['all', ...Array.from(new Set(ALL_SKILLS.map((s) => s.category || 'other')))]
  const [active, setActive] = useState('all')

  const skills = useMemo(() => {
    if (active === 'all') return ALL_SKILLS
    return ALL_SKILLS.filter((s) => s.category === active)
  }, [active])

  return (
    <section id="skills" className="py-24 px-4 relative bg-[hsl(var(--secondary)/0.3)]">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          My <span className="text-primary">Skills</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={
                active === c
                  ? 'px-5 py-2 rounded-full bg-primary text-primary-foreground capitalize transition-colors duration-300'
                  : 'px-5 py-2 rounded-full bg-[hsl(var(--secondary)/0.5)] text-foreground capitalize hover:bg-secondary transition-colors duration-300'
              }
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, idx) => (
            <div key={`${skill.name}-${idx}`} className="bg-card rounded-lg shadow-sm card-hover p-6">
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
