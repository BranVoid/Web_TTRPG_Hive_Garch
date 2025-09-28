import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './components/Pages/Home'
import SkillTree from './components/Pages/SkillTree'
import SkillTreeConstructor from './components/Pages/SkillTreeConstructor'
import Profile from './components/Pages/Profile'
import Map from './components/Pages/Map'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'

// Componente de carga muy simple
const Loading = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#1a1a2e',
    color: '#e94560',
    fontSize: '1.2rem'
  }}>
    <div>Cargando...</div>
  </div>
)

// Componente principal que maneja la lógica de rutas
function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/register" 
        element={!user ? <Register /> : <Navigate to="/" replace />} 
      />
      
      {/* Rutas protegidas - solo para usuarios autenticados */}
      {user ? (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/skill-tree" element={<SkillTree />} />
          <Route path="/skill-tree-constructor" element={<SkillTreeConstructor />} />
          <Route path="/map" element={<Map />} />
          <Route path="/profile" element={<Profile />} />
        </>
      ) : (
        // Redirigir al login si no está autenticado
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
      
      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  )
}

// Componente App principal
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app" style={{ minHeight: '100vh', backgroundColor: '#1a1a2e' }}>
          <Navbar />
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App