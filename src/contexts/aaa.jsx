import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (!name.trim()) {
      setError('El nombre es requerido');
      setLoading(false);
      return;
    }

    try {
      // Registrar usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            name: name.trim(),
            username: name.trim().toLowerCase().replace(/\s+/g, '_')
          },
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Crear perfil en la tabla profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email: email.trim(),
              username: name.trim().toLowerCase().replace(/\s+/g, '_'),
              character_name: name.trim(),
              created_at: new Date().toISOString()
            }
          ]);

        if (profileError) {
          console.error('Error creando perfil:', profileError);
          // No lanzamos error aquí porque el usuario ya fue creado en auth
        }
      }

      // Mostrar mensaje de éxito
      alert('¡Registro exitoso! Por favor, verifica tu correo electrónico para activar tu cuenta.');
      navigate('/login');
      
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Error al registrar la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Crear Cuenta</h2>
        <p style={{ textAlign: 'center', color: '#cccccc', marginBottom: '1.5rem' }}>
          Únete a La Colmena de Garch
        </p>
        
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="name">
            <span style={{ color: '#e94560' }}>*</span> Nombre de Usuario:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Aventurero123"
            required
            disabled={loading}
            maxLength={50}
          />
          <small style={{ color: '#888', fontSize: '0.8rem' }}>
            Este será tu nombre público en el juego
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="email">
            <span style={{ color: '#e94560' }}>*</span> Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            <span style={{ color: '#e94560' }}>*</span> Contraseña:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
            disabled={loading}
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">
            <span style={{ color: '#e94560' }}>*</span> Confirmar Contraseña:
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite tu contraseña"
            required
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="auth-button" 
          disabled={loading}
        >
          {loading ? 'Creando Cuenta...' : 'Unirse a la Aventura'}
        </button>

        <div className="auth-switch">
          <p>
            ¿Ya tienes una cuenta? {' '}
            <Link to="/login">Iniciar Sesión</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;