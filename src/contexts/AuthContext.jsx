import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Función para crear perfil (separada para evitar dependencias circulares)
  const createUserProfile = async (userId, userData) => {
    try {
      console.log('Creando perfil para usuario:', userId)
      
      const baseUsername = userData.user_metadata?.name || 
                          userData.email?.split('@')[0] || 
                          'aventurero'
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email: userData.email,
            username: baseUsername.toLowerCase().replace(/\s+/g, '_'),
            character_name: userData.user_metadata?.name || baseUsername,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single()

      if (createError) {
        // Si es error de duplicado, ignorar (ya existe)
        if (createError.code === '23505') {
          console.log('Perfil ya existe, obteniendo...')
          // Obtener el perfil existente
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()
          return existingProfile
        }
        console.error('Error creando perfil:', createError)
        return null
      }
      
      console.log('Perfil creado exitosamente:', newProfile)
      return newProfile
    } catch (error) {
      console.error('Error en createUserProfile:', error)
      return null
    }
  }

  // Función para cargar el perfil del usuario
  const loadUserProfile = async (userId, userData) => {
    try {
      console.log('Cargando perfil para usuario:', userId)
      
      // Primero intentar obtener el perfil existente
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        // Si el perfil no existe, crear uno nuevo
        if (profileError.code === 'PGRST116') {
          console.log('Perfil no encontrado, creando uno nuevo...')
          const newProfile = await createUserProfile(userId, userData)
          return newProfile
        } else {
          console.error('Error cargando perfil:', profileError)
          return null
        }
      }
      
      console.log('Perfil encontrado:', existingProfile)
      return existingProfile
    } catch (error) {
      console.error('Error en loadUserProfile:', error)
      return null
    }
  }

  useEffect(() => {
    let mounted = true

    // Verificar sesión existente al cargar
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error obteniendo sesión:', error)
          if (mounted) {
            setUser(null)
            setProfile(null)
            setLoading(false)
          }
          return
        }

        if (session?.user && mounted) {
          setUser(session.user)
          
          // Cargar perfil después de establecer el usuario
          const userProfile = await loadUserProfile(session.user.id, session.user)
          if (mounted && userProfile) {
            setProfile(userProfile)
          }
        } else if (mounted) {
          setUser(null)
          setProfile(null)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        if (mounted) {
          setUser(null)
          setProfile(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    checkAuth()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        
        if (!mounted) return

        if (session?.user) {
          setUser(session.user)
          
          // Pequeño delay para asegurar que el estado se actualice
          setTimeout(async () => {
            if (!mounted) return
            const userProfile = await loadUserProfile(session.user.id, session.user)
            if (mounted && userProfile) {
              setProfile(userProfile)
            }
            if (mounted) {
              setLoading(false)
            }
          }, 100)
        } else {
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, []) // Removí las dependencias problemáticas

  // Función para actualizar el perfil
  const updateProfile = async (profileData) => {
    if (!user) {
      throw new Error('No hay usuario autenticado')
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      
      setProfile(data)
      return data
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const signOut = async () => {
  try {
    console.log('Iniciando proceso de logout...');
    
    // 1. Primero intentar logout con Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.warn('Error en logout de Supabase:', error);
      // No lanzar error aquí, continuar con limpieza local
    }
    
    // 2. Limpieza AGRESIVA del localStorage (importante)
    const keysToRemove = [
      'supabase.auth.token',
      'sb-avdjghnvciojwvmyknjo-auth-token',
      'sb-avdjghnvciojwvmyknjo-auth-token.expires_at'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log('Eliminado:', key);
    });
    
    // 3. Limpiar también por patrones por si hay otras claves
    Object.keys(localStorage).forEach(key => {
      if (key.includes('supabase') || key.includes('auth') || key.startsWith('sb-')) {
        localStorage.removeItem(key);
        console.log('Eliminado por patrón:', key);
      }
    });
    
    // 4. Limpiar sessionStorage también
    sessionStorage.clear();
    
    // 5. Actualizar estado local inmediatamente
    setUser(null);
    setProfile(null);
    setLoading(false);
    
    console.log('Logout completado - estado local limpiado');
    
  } catch (error) {
    console.error('Error crítico durante logout:', error);
    // Limpieza de emergencia
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    setProfile(null);
    setLoading(false);
  }
};

  const value = {
    user,
    profile,
    loading,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}