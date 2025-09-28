import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Obtener el nombre a mostrar
  const getDisplayName = () => {
    return profile?.character_name || profile?.username || user?.email?.split('@')[0] || 'Aventurero'
  }

  // Obtener la inicial para el avatar
  const getAvatarInitial = () => {
    if (profile?.username) return profile.username.charAt(0).toUpperCase();
    if (profile?.character_name) return profile.character_name.charAt(0).toUpperCase();
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  if (!user) return null; // No mostrar navbar si no hay usuario

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <div className="nav-links">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Inicio
            </Link>
            <Link 
              to="/skill-tree" 
              className={`nav-link ${location.pathname === '/skill-tree' ? 'active' : ''}`}
            >
              Árbol de Habilidades
            </Link>
            <Link 
              to="/skill-tree-constructor" 
              className={`nav-link ${location.pathname === '/skill-tree-constructor' ? 'active' : ''}`}
            >
              Constructor de Árbol
            </Link>
            <Link 
              to="/map" 
              className={`nav-link ${location.pathname === '/map' ? 'active' : ''}`}
            >
              Mapa
            </Link>
          </div>

          <div className="user-menu" ref={dropdownRef}>
            <button 
              className="user-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="user-avatar">
                {getAvatarInitial()}
              </span>
              <span className="user-name">{getDisplayName()}</span>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showDropdown && (
              <div className="dropdown-menu">
                <Link 
                  to="/profile" 
                  className="dropdown-item"
                  onClick={() => setShowDropdown(false)}
                >
                  👤 Mi Perfil
                </Link>
                <div className="dropdown-divider"></div>
                <button 
                  onClick={handleLogout}
                  className="dropdown-item logout"
                >
                  🚪 Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar