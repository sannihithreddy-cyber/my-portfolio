import { useEffect, useState } from 'react'

export default function StarBackground() {
  const [stars, setStars] = useState([])
  const [meteors, setMeteors] = useState([])

  useEffect(() => {
    function generateStars() {
      const numberOfStars = Math.floor((window.innerWidth * window.innerHeight) / 10000)
      const arr = []
      for (let i = 0; i < numberOfStars; i++) {
        arr.push({
          id: i,
          size: Math.random() * 3 + 1, // 1-4px
          x: Math.random() * 100,
          y: Math.random() * 100,
          opacity: Math.random() * 0.5 + 0.5, // 0.5-1
          duration: Math.random() * 4 + 2, // 2-6s
        })
      }
      setStars(arr)
    }

    function generateMeteors() {
      const count = 4
      const arr = []
      for (let i = 0; i < count; i++) {
        arr.push({
          id: i,
          size: Math.random() * 2 + 2,
          x: Math.random() * 100,
          y: Math.random() * 20,
          delay: Math.random() * 15,
          duration: Math.random() * 3 + 3,
        })
      }
      setMeteors(arr)
    }

    function handleResize() {
      generateStars()
    }

    generateStars()
    generateMeteors()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((s) => (
        <div
          key={`star-${s.id}`}
          className="star animate-pulse-subtle"
          style={{
            width: `${s.size}px`,
            height: `${s.size}px`,
            left: `${s.x}%`,
            top: `${s.y}%`,
            opacity: s.opacity,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
      {meteors.map((m) => (
        <div
          key={`meteor-${m.id}`}
          className="meteor animate-meteor"
          style={{
            width: `${m.size * 50}px`,
            height: `${m.size * 2}px`,
            left: `${m.x}%`,
            top: `${m.y}%`,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

