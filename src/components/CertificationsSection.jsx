import { useProfile } from '@/data/ProfileContext.jsx'

function CertCard({ cert }) {
  return (
    <div className="surface-card p-6 rounded-lg reveal hover-lift text-left flex gap-4 items-start">
      {cert.badgeImage ? (
        <img src={cert.badgeImage} alt={cert.title} className="w-14 h-14 rounded-md object-cover bg-secondary/40" />
      ) : (
        <div className="w-14 h-14 rounded-md bg-secondary/50" />
      )}
      <div className="min-w-0">
        <div className="font-semibold truncate">{cert.title}</div>
        <div className="text-sm text-muted-foreground truncate">{cert.issuer}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : null}
          {cert.credentialId ? ` · ID: ${cert.credentialId}` : ''}
        </div>
        <div className="mt-3">
          {cert.credentialUrl ? (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-animate text-sm"
            >
              View credential
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default function CertificationsSection() {
  const profile = useProfile() || {}
  const items = Array.isArray(profile.certifications) ? profile.certifications : []
  if (!items.length) return null
  return (
    <section id="certifications" className="py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="reveal text-3xl md:text-4xl font-bold text-center">Certifications</h2>
        <p className="reveal text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Verified accomplishments from recognized organizations.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((c) => (
            <CertCard key={c.id || c.title} cert={c} />
          ))}
        </div>
      </div>
    </section>
  )
}

