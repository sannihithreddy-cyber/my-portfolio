export default function BackgroundOrbs({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`} aria-hidden>
      <div className="hero-gradient-base" />
      <div className="hero-gradient-wash" />
      <div className="hero-gradient-contrast" />
      <div className="hero-gradient-noise" />
    </div>
  )
}
