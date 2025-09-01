import ThemeToggle from '@/components/ThemeToggle.jsx'
import StarBackground from '@/components/StarBackground.jsx'
import Navbar from '@/components/Navbar.jsx'
import HeroSection from '@/components/HeroSection.jsx'
import AboutSection from '@/components/AboutSection.jsx'
import SkillsSection from '@/components/SkillsSection.jsx'
import ProjectsSection from '@/components/ProjectsSection.jsx'
import ContactSection from '@/components/ContactSection.jsx'
import Footer from '@/components/Footer.jsx'
import { ProfileProvider } from '@/data/ProfileContext.jsx'

export default function Home() {
  return (
    <ProfileProvider>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <ThemeToggle />
        <StarBackground />
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </ProfileProvider>
  )
}
