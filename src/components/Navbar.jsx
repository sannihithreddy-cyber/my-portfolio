import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProfile } from '@/data/ProfileContext.jsx'
import { navItems } from '@/data/nav.js'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 40)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const profile = useProfile()

  return (
    <nav
      className={cn(
        'fixed w-full z-40 transition-all duration-300',
        isScrolled ? 'py-3 surface-glass' : 'py-5'
      )}
    >
      <div className="container flex items-center justify-between">
        <a href="#hero" className="relative z-10 text-xl font-bold text-primary flex items-center">
          <span className="text-glow">{profile?.brandName || `${profile?.name || ''} Portfolio`}</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex space-x-8 text-foreground opacity-80">
          {navItems.map((item) => (
            <a key={item.name} href={item.href} className="hover:text-primary transition-colors duration-300">
              {item.name}
            </a>
          ))}
        </div>

        {/* Mobile trigger */}
        <button
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="md:hidden p-2 text-foreground z-50"
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 bg-background/95 backdrop-blur-md z-40 flex flex-col items-center justify-center transition-all duration-300 md:hidden',
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="flex flex-col space-y-6 text-xl">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
