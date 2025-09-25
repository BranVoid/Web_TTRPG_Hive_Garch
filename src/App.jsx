import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './components/Pages/Home'
import SkillTree from './components/Pages/SkillTree'
import SkillTreeConstructor from './components/Pages/SkillTreeConstructor'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function AppContent() {
  const { user } = useAuth()

  return (
    <Router>
      <div className="app">
        {user && <Navbar />}
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/skill-tree" element={<ProtectedRoute><SkillTree /></ProtectedRoute>} />
          <Route path="/skill-tree-constructor" element={<ProtectedRoute><SkillTreeConstructor /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App