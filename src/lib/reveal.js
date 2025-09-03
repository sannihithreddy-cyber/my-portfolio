export function initReveal() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return () => {}
  let els = Array.from(document.querySelectorAll('.reveal'))
  if (els.length === 0) return () => {}

  const hasIO = 'IntersectionObserver' in window
  const observer = hasIO
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              observer && observer.unobserve(entry.target)
            }
          })
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
      )
    : null

  if (observer) els.forEach((el) => observer.observe(el))
  else els.forEach((el) => el.classList.add('is-visible'))

  // Safety fallback: reveal all after a short delay in case IO fails
  const fallback = setTimeout(() => {
    els.forEach((el) => el.classList.add('is-visible'))
  }, 800)

  // MutationObserver to handle dynamically added .reveal nodes
  const mo = new MutationObserver((mutations) => {
    let added = []
    mutations.forEach((m) => {
      m.addedNodes && m.addedNodes.forEach((n) => {
        if (!(n instanceof HTMLElement)) return
        if (n.classList && n.classList.contains('reveal')) added.push(n)
        added = added.concat(Array.from(n.querySelectorAll?.('.reveal') || []))
      })
    })
    if (added.length) {
      if (observer) added.forEach((el) => observer.observe(el))
      else added.forEach((el) => el.classList.add('is-visible'))
      els = els.concat(added)
    }
  })
  mo.observe(document.body, { childList: true, subtree: true })

  // Periodic check: reveal any in-viewport nodes that may have been missed
  const interval = setInterval(() => {
    els.forEach((el) => {
      if (el.classList.contains('is-visible')) return
      const rect = el.getBoundingClientRect()
      const inView = rect.top < window.innerHeight * 0.85 && rect.bottom > 0
      if (inView) el.classList.add('is-visible')
    })
  }, 700)

  return () => {
    try { observer && observer.disconnect() } catch {}
    try { mo.disconnect() } catch {}
    try { clearTimeout(fallback) } catch {}
    try { clearInterval(interval) } catch {}
  }
}
