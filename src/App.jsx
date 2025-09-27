import React from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './components/Pages/Home'
import SkillTree from './components/Pages/SkillTree'
import SkillTreeConstructor from './components/Pages/SkillTreeConstructor'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Profile from './components/Pages/Profile'
import Map from './components/Pages/Map'

// Estilos básicos inline como respaldo
const appStyles = {
  minHeight: '100vh',
  backgroundColor: '#1a1a2e',
  color: '#e6e6e6'
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#1a1a2e',
        color: '#e94560'
      }}>
        Cargando...
      </div>
    )
  }
  
  return user ? children : <Navigate to="/login" />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#1a1a2e',
        color: '#e94560'
      }}>
        Cargando...
      </div>
    )
  }
  
  return !user ? children : <Navigate to="/" />
}

function AppContent() {
  const { user } = useAuth()

  return (
    <Router>
      <div style={appStyles}>
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
          <Route path="/map" element={
            <ProtectedRoute>
              <Map />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="*" element={
            <Navigate to="/" />
          } />
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