import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    character_name: '',
    bio: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          username: data.username || '',
          character_name: data.character_name || '',
          bio: data.bio || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage('');

      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          character_name: formData.character_name,
          bio: formData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => ({ ...prev, ...formData }));
      setMessage('✅ Perfil actualizado correctamente!');
      
      // Actualizar metadata del usuario en auth
      await supabase.auth.updateUser({
        data: { 
          name: formData.character_name || formData.username 
        }
      });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('❌ Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando perfil...</div>;
  }

  return (
    <div className="profile-container">
      <div className="container">
        <div className="profile-header">
          <h2>Mi Perfil</h2>
          <p>Personaliza tu información de aventurero</p>
        </div>

        {message && (
          <div style={{
            background: message.includes('✅') ? 'rgba(46, 139, 87, 0.2)' : 'rgba(255, 107, 107, 0.2)',
            color: message.includes('✅') ? '#2E8B57' : '#ff6b6b',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        <div className="profile-content">
          <div className="profile-card">
            <form onSubmit={handleSave} className="profile-form">
              <div className="form-group">
                <label>Nombre de Usuario:</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Tu nombre único en el juego"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Nombre del Personaje:</label>
                <input
                  type="text"
                  value={formData.character_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, character_name: e.target.value }))}
                  placeholder="Nombre de tu personaje en la aventura"
                />
              </div>
              
              <div className="form-group">
                <label>Biografía:</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows="4"
                  placeholder="Cuenta tu historia..."
                  maxLength="500"
                />
                <small>{formData.bio.length}/500 caracteres</small>
              </div>
              
              <button type="submit" className="auth-button" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </form>
          </div>

          <div className="profile-info">
            <h3>Información de la Cuenta</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Miembro desde:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
            <p><strong>ID de Aventurero:</strong> {user.id.slice(0, 8)}...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;