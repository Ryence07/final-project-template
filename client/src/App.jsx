import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import Footer from './components/Footer'
import Header from './components/Header'

import Home from './pages/Home'
import Leaderboard from './pages/Leaderboard'
import Login from './pages/Login'
import PaddleMatch from './pages/PaddleMatch'
import PlayerMatch from './pages/PlayerMatch'

import { isLoggedIn } from './api'


function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }

  return children
}


function App() {
  return (
    <BrowserRouter
      basename={import.meta.env.BASE_URL}
    >
      <Header />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/paddles"
          element={
            <ProtectedRoute>
              <PaddleMatch />
            </ProtectedRoute>
          }
        />

        <Route
          path="/players"
          element={
            <ProtectedRoute>
              <PlayerMatch />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

      <Footer />
    </BrowserRouter>
  )
}

export default App