import { useState } from 'react'
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Twitch, Send } from 'lucide-react'
import { useProfile } from '@/data/ProfileContext.jsx'

export default function ContactSection() {
  const profile = useProfile() || {}
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notice, setNotice] = useState({ type: '', message: '', previewUrl: '' })

  function handleSubmit(e) {
    e.preventDefault()
    const formEl = e.currentTarget
    setIsSubmitting(true)
    setNotice({ type: 'info', message: 'Sending your message…', previewUrl: '' })
    ;(async () => {
      try {
        const form = new FormData(formEl)
        const payload = {
          name: form.get('name'),
          email: form.get('email'),
          message: form.get('message'),
        }
        const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''
        const res = await fetch(`${base}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data?.error || 'Failed to send')
        setIsSubmitting(false)
        if (data.previewUrl) {
          try { console.info('[contact] Email preview URL:', data.previewUrl); window.__MAIL_PREVIEW__ = data.previewUrl } catch {}
        }
        setNotice({
          type: 'success',
          message: data.previewUrl
            ? 'Message sent (developer preview generated).'
            : "Message sent! I'll get back to you soon.",
          previewUrl: data.previewUrl || '',
        })
        formEl?.reset()
      } catch (err) {
        console.error(err)
        setIsSubmitting(false)
        setNotice({ type: 'error', message: err?.message || 'Sorry, there was a problem sending your message.', previewUrl: '' })
      }
    })()
  }

  return (
    <section id="contact" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="reveal text-3xl md:text-4xl font-bold text-center">
          Get in <span className="text-gradient-animated">Touch</span>
        </h2>
        <p className="reveal text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          {profile.about?.contactIntro || ''}
        </p>

        {!!notice.type && (
          <div
            className={
              notice.type === 'success'
                ? 'surface-card border border-[hsl(var(--success)/.5)] text-foreground p-4 rounded-lg mb-8'
                : notice.type === 'error'
                ? 'surface-card border border-[hsl(var(--danger)/.5)] text-foreground p-4 rounded-lg mb-8'
                : 'surface-card border border-border text-foreground p-4 rounded-lg mb-8'
            }
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                {notice.message}
                {notice.previewUrl ? (
                  <>
                    {' '}
                    <a href={notice.previewUrl} target="_blank" rel="noopener noreferrer" className="underline-animate">
                      Open preview
                    </a>
                  </>
                ) : null}
              </div>
              <button
                type="button"
                className="px-2 py-1 rounded-md surface-glass hover:bg-secondary"
                aria-label="Dismiss"
                onClick={() => setNotice({ type: '', message: '', previewUrl: '' })}
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-8 surface-card p-8 rounded-lg reveal">
            <h3 className="text-2xl font-semibold mb-6">Contact information</h3>
            <div className="space-y-6 justify-center">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-[hsl(var(--primary)/0.1)] text-primary"><Mail className="h-6 w-6" /></div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Email</h4>
                  {profile.email ? (
                    <a href={`mailto:${profile.email}`} className="text-muted-foreground hover:text-primary transition-colors">{profile.email}</a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-[hsl(var(--primary)/0.1)] text-primary"><Phone className="h-6 w-6" /></div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Phone</h4>
                  {profile.phone ? (
                    <a href={`tel:${(profile.phone || '').replace(/\s/g,'')}`} className="text-muted-foreground hover:text-primary transition-colors">{profile.phone}</a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-[hsl(var(--primary)/0.1)] text-primary"><MapPin className="h-6 w-6" /></div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Location</h4>
                  <div className="text-muted-foreground">{profile.location || '—'}</div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <h4 className="font-medium mb-4">Connect with me</h4>
              <div className="flex gap-4 justify-center md:justify-start">
                <a href={profile.socials?.linkedin || 'https://www.linkedin.com/in/banalasannihith/'} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors"><Linkedin /></a>
                <a href={profile.socials?.twitter || '#'} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors"><Twitter /></a>
                <a href={profile.socials?.instagram || '#'} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors"><Instagram /></a>
                <a href={profile.socials?.twitch || '#'} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors"><Twitch /></a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="surface-card p-8 rounded-lg reveal">
            <h3 className="text-2xl font-semibold mb-6">Send a message</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Your name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={profile?.name || ''}
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
                  placeholder={profile?.email || ''}
                  required
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring focus:ring-[hsl(var(--primary))]"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Your message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder={''}
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
