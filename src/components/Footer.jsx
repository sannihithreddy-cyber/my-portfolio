import { ArrowUp } from 'lucide-react'
import { useProfile } from '@/data/ProfileContext.jsx'

export default function Footer() {
  const profile = useProfile()
  return (
    <footer className="py-10 px-4 surface-glass footer-glow relative border-t border-border mt-12 flex flex-wrap gap-4 justify-between items-center">
      <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} {(profile && (profile.siteName || profile.brandName || profile.name)) || ''}. All rights reserved</p>
      <a href="#hero" className="p-2 rounded-full bg-[hsl(var(--primary)/0.1)] hover:bg-[hsl(var(--primary)/0.2)] text-primary transition-colors">
        <ArrowUp size={20} />
      </a>
    </footer>
  )
}
