import { useState } from 'react'
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Twitch, Send } from 'lucide-react'
import { useProfile } from '@/data/ProfileContext.jsx'

export default function ContactSection() {
  const profile = useProfile()
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      // Simple feedback. You can replace with a toast implementation later.
      alert('Message sent! Thank you for your message. I\'ll get back to you soon.')
    }, 1500)
  }

  return (
    <section id="contact" className="py-24 px-4 relative bg-[hsl(var(--secondary)/0.3)]">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Get in <span className="text-primary">Touch</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Have a project in mind or want to collaborate? Reach out—always open to new opportunities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold mb-6">Contact information</h3>
            <div className="space-y-6 justify-center">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-[hsl(var(--primary)/0.1)] text-primary"><Mail className="h-6 w-6" /></div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Email</h4>
                  <a href={`mailto:${profile.email || 'hello@example.com'}`} className="text-muted-foreground hover:text-primary transition-colors">{profile.email || 'hello@example.com'}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-[hsl(var(--primary)/0.1)] text-primary"><Phone className="h-6 w-6" /></div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Phone</h4>
                  <a href={`tel:${(profile.phone || '').replace(/\s/g,'') || '+11234567890'}`} className="text-muted-foreground hover:text-primary transition-colors">{profile.phone || '+1 123 456 7890'}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-[hsl(var(--primary)/0.1)] text-primary"><MapPin className="h-6 w-6" /></div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Location</h4>
                  <div className="text-muted-foreground">{profile.location || 'Your City, Country'}</div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <h4 className="font-medium mb-4">Connect with me</h4>
              <div className="flex gap-4 justify-center md:justify-start">
                <a href={profile.socials?.linkedin || '#'} target="_blank" className="text-foreground hover:text-primary transition-colors"><Linkedin /></a>
                <a href={profile.socials?.twitter || '#'} target="_blank" className="text-foreground hover:text-primary transition-colors"><Twitter /></a>
                <a href={profile.socials?.instagram || '#'} target="_blank" className="text-foreground hover:text-primary transition-colors"><Instagram /></a>
                <a href={profile.socials?.twitch || '#'} target="_blank" className="text-foreground hover:text-primary transition-colors"><Twitch /></a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-card p-8 rounded-lg shadow-xs">
            <h3 className="text-2xl font-semibold mb-6">Send a message</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Your name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={profile?.name || 'Your Name'}
                  required
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring focus:ring-[hsl(var(--primary))]"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Your email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={profile?.email || 'you@example.com'}
                  required
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring focus:ring-[hsl(var(--primary))]"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Your message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Hello, I\'d like to talk about..."
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring focus:ring-[hsl(var(--primary))] resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="cosmic-button w-full flex items-center justify-center gap-2"
              >
                <Send size={16} /> {isSubmitting ? 'Sending…' : 'Send message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

