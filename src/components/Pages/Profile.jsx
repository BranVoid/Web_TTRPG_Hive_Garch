import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    character_name: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // Buscar perfil existente
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          username: data.username || '',
          bio: data.bio || '',
          character_name: data.character_name || ''
        });
      } else {
        // Crear perfil si no existe
        await createProfile();
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            email: user.email,
            username: user.email.split('@')[0],
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      setFormData({
        username: data.username || '',
        bio: data.bio || '',
        character_name: data.character_name || ''
      });
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          bio: formData.bio,
          character_name: formData.character_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      setProfile(prev => ({ ...prev, ...formData }));
      setEditing(false);
      alert('Perfil actualizado correctamente!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '2rem', color: '#e94560' }}>
            Cargando perfil...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="container">
        <div className="profile-header">
          <h2>Perfil de Usuario</h2>
          <p>Gestiona tu información personal y de personaje</p>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-info">
              <div className="profile-avatar">
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e94560, #0f3460)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  color: 'white',
                  margin: '0 auto 1rem'
                }}>
                  {formData.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                </div>
              </div>

              {!editing ? (
                <div className="profile-details">
                  <h3>{profile?.character_name || 'Sin nombre de personaje'}</h3>
                  <p><strong>Usuario:</strong> {profile?.username}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Bio:</strong> {profile?.bio || 'No hay biografía aún'}</p>
                  <p><strong>Miembro desde:</strong> {new Date(user?.created_at).toLocaleDateString()}</p>
                  
                  <button 
                    onClick={() => setEditing(true)}
                    className="auth-button"
                    style={{ marginTop: '1rem' }}
                  >
                    Editar Perfil
                  </button>
                </div>
              ) : (
                <form onSubmit={updateProfile} className="profile-form">
                  <div className="form-group">
                    <label>Nombre de Usuario:</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Nombre del Personaje:</label>
                    <input
                      type="text"
                      value={formData.character_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, character_name: e.target.value }))}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Biografía:</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows="4"
                      placeholder="Cuéntanos sobre tu personaje..."
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="auth-button" disabled={loading}>
                      {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setEditing(false)}
                      style={{
                        background: '#6c757d',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="profile-stats">
            <h3>Estadísticas</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-number">0</span>
                <span className="stat-label">Habilidades Adquiridas</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">1</span>
                <span className="stat-label">Días en La Colmena</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">0</span>
                <span className="stat-label">Aventuras Completadas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;