import ThemeToggle from '@/components/ThemeToggle.jsx'
import StarBackground from '@/components/StarBackground.jsx'
import Navbar from '@/components/Navbar.jsx'
import Footer from '@/components/Footer.jsx'
import Comet from '@/components/Comet.jsx'
import Ladybug from '@/components/Ladybug.jsx'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ThemeToggle />
      <StarBackground />
      <Comet />
      <Ladybug />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
