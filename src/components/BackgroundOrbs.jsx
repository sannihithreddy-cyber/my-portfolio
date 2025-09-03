export default function BackgroundOrbs({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 z-0 ${className}`} aria-hidden>
      <div className="spotlight" />
      <div className="absolute -top-10 -left-20 w-[38rem] h-[38rem] orb orb-primary" />
      <div className="absolute top-40 -right-32 w-[34rem] h-[34rem] orb orb-accent" />
    </div>
  )
}
