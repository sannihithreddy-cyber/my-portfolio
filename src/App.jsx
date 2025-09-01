import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home.jsx'
import NotFound from '@/pages/NotFound.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

