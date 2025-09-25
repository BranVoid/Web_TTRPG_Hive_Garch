import React from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './components/Pages/Home'
import SkillTree from './components/Pages/SkillTree'
import SkillTreeConstructor from './components/Pages/SkillTreeConstructor'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="loading">Cargando...</div>
  }
  
  return user ? children : <Navigate to="/login" />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="loading">Cargando...</div>
  }
  
  return !user ? children : <Navigate to="/" />
}

function AppContent() {
  const { user } = useAuth()

  return (
    <Router>
      <div className="app">
        {user && <Navbar />}
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/skill-tree" element={
            <ProtectedRoute>
              <SkillTree />
            </ProtectedRoute>
          } />
          <Route path="/skill-tree-constructor" element={
            <ProtectedRoute>
              <SkillTreeConstructor />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
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