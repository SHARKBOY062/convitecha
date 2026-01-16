import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Confirmacao from './pages/Confirmacao'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/confirmacao" element={<Confirmacao />} />
    </Routes>
  )
}
