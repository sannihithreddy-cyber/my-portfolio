import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from '@/pages/Home.jsx'
import NotFound from '@/pages/NotFound.jsx'
import { useEffect } from 'react'
import { initReveal } from '@/lib/reveal.js'

function WithReveal({ children }) {
  const location = useLocation()
  useEffect(() => {
    const cleanup = initReveal()
    return cleanup
  }, [location.pathname])
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <WithReveal>
        <Routes>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </WithReveal>
    </BrowserRouter>
  )
}
