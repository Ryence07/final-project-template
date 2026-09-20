import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Footer from './components/Footer'
import Header from './components/Header'

import Home from './pages/Home'
import Leaderboard from './pages/Leaderboard'
import PaddleMatch from './pages/PaddleMatch'
import PlayerMatch from './pages/PlayerMatch'

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<PaddleMatch />} />
        <Route path="/home" element={<Home />} />
        <Route path="/paddles" element={<PaddleMatch />} />
        <Route path="/players" element={<PlayerMatch />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  )
}

export default App