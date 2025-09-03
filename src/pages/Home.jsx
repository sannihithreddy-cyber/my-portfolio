import HeroSection from '@/components/HeroSection.jsx'
import AboutSection from '@/components/AboutSection.jsx'
import SkillsSection from '@/components/SkillsSection.jsx'
import ProjectsSection from '@/components/ProjectsSection.jsx'
import ContactSection from '@/components/ContactSection.jsx'
import CertificationsSection from '@/components/CertificationsSection.jsx'
import { ProfileProvider, useProfile } from '@/data/ProfileContext.jsx'
import Layout from '@/components/Layout.jsx'

function NoDataBanner() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 bg-[hsl(var(--warning)/0.1)] text-foreground border-b border-border px-4 py-3 text-sm">
      <div className="container max-w-5xl mx-auto flex items-center justify-between">
        <span>
          No profile data loaded. Ensure the API returns JSON at <code>/api/profile</code> and that the app is running via Vite.
        </span>
        <a href="/api/profile" className="underline-animate">Check /api/profile</a>
      </div>
    </div>
  )
}

function Page() {
  const profile = useProfile() || {}
  const hasAny = Boolean(
    profile.name || (profile.about && (profile.about.title || (profile.about.paragraphs || []).length)) ||
    (Array.isArray(profile.skills) && profile.skills.length) ||
    (Array.isArray(profile.projects) && profile.projects.length) ||
    (Array.isArray(profile.certifications) && profile.certifications.length)
  )
  return (
    <Layout>
      {!hasAny && <NoDataBanner />}
      <HeroSection />
      <div className="section-divider" />
      <div className="section-alt"><AboutSection /></div>
      <div className="section-divider" />
      <SkillsSection />
      <div className="section-divider" />
      <div className="section-alt"><CertificationsSection /></div>
      <div className="section-divider" />
      <ProjectsSection />
      <div className="section-divider" />
      <div className="section-alt"><ContactSection /></div>
    </Layout>
  )
}

export default function Home() {
  return (
    <ProfileProvider>
      <Page />
    </ProfileProvider>
  )
}
