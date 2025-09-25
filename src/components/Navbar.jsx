import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <div className="nav-links">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Inicio
            </Link>
            <Link to="/skill-tree" className={`nav-link ${location.pathname === '/skill-tree' ? 'active' : ''}`}>
              Árbol de Habilidades
            </Link>
            <Link to="/skill-tree-constructor" className={`nav-link ${location.pathname === '/skill-tree-constructor' ? 'active' : ''}`}>
              Constructor de Árbol
            </Link>
            {user && (
              <button onClick={handleLogout} className="nav-link logout-btn">
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;