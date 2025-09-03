import HeroSection from '@/components/HeroSection.jsx'
import AboutSection from '@/components/AboutSection.jsx'
import SkillsSection from '@/components/SkillsSection.jsx'
import ProjectsSection from '@/components/ProjectsSection.jsx'
import ContactSection from '@/components/ContactSection.jsx'
import CertificationsSection from '@/components/CertificationsSection.jsx'
import { ProfileProvider } from '@/data/ProfileContext.jsx'
import Layout from '@/components/Layout.jsx'

function Page() {
  return (
    <Layout>
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
