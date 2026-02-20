import HeroSection from '@/components/HeroSection.jsx'
import AboutSection from '@/components/AboutSection.jsx'
import ExperienceSection from '@/components/ExperienceSection.jsx'
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
      <ExperienceSection />
      <div className="section-divider" />
      <div className="section-alt"><SkillsSection /></div>
      <div className="section-divider" />
      <CertificationsSection />
      <div className="section-divider" />
      <div className="section-alt"><ProjectsSection /></div>
      <div className="section-divider" />
      <ContactSection />
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
