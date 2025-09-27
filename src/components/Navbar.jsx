import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

          {user && (
            <div className="user-menu" ref={dropdownRef}>
              <button 
                className="user-button"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span style={{
                  display: 'inline-block',
                  width: '35px',
                  height: '35px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e94560, #0f3460)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  marginRight: '10px'
                }}>
                  {user.email?.charAt(0)?.toUpperCase()}
                </span>
                {user.email}
                <span style={{ marginLeft: '10px' }}>▼</span>
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
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar