
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const VALID_ROLES = ['admin', 'profesional', 'cliente', 'professional', 'customer'];

  const formatUser = (user, profile) => {
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      full_name: profile?.full_name || user.user_metadata?.full_name || '',
      telefono: profile?.phone || user.user_metadata?.phone || '',
      role: profile?.role || user.user_metadata?.role || 'cliente',
      ...profile
    };
  };

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          const profile = await fetchProfile(session.user.id);
          setCurrentUser(formatUser(session.user, profile));
        }
      } catch (error) {
        console.error('Session init error:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      if (event === 'SIGNED_OUT' || !session) {
        setCurrentUser(null);
        setLoading(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const profile = await fetchProfile(session.user.id);
        setCurrentUser(formatUser(session.user, profile));
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, full_name, telefono, role) => {
    if (!VALID_ROLES.includes(role)) {
      return { success: false, error: "Rol de usuario inválido." };
    }

    try {
      // 1. Create Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name, phone: telefono, role }
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) return { success: false, error: "Este email ya está registrado" };
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        // 2. Insert into public.users
        const { error: dbError } = await supabase.from('users').insert([{
          id: authData.user.id,
          email: email,
          full_name: full_name,
          phone: telefono,
          role: role,
          created_at: new Date(),
          updated_at: new Date()
        }]);

        if (dbError) {
          console.error("DB Insert Error:", dbError);
          // If insert fails, we might still have the auth user. 
          // We can try to proceed but warn. Ideally we would rollback auth user but that requires admin rights.
        }
        
        const newUserProfile = { id: authData.user.id, email, full_name, phone: telefono, role };
        setCurrentUser(formatUser(authData.user, newUserProfile));
        return { success: true, data: authData.user };
      }
      
      // Fallback if session creation delayed
      return { success: false, error: "Registro iniciado. Por favor verifica tu correo." };
      
    } catch (error) {
      return { success: false, error: error.message || "Error de conexión" };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        if (error.message.includes('Invalid login')) return { success: false, error: "Contraseña incorrecta o usuario no encontrado" };
        return { success: false, error: error.message };
      }

      const profile = await fetchProfile(data.user.id);
      const user = formatUser(data.user, profile);
      setCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateUserProfile = async (updates) => {
    if (!currentUser) return;
    try {
      const dbUpdates = { ...updates };
      if (dbUpdates.telefono) {
        dbUpdates.phone = dbUpdates.telefono;
        delete dbUpdates.telefono;
      }

      const { error } = await supabase
        .from('users')
        .update(dbUpdates)
        .eq('id', currentUser.id);

      if (error) throw error;
      
      const newProfile = await fetchProfile(currentUser.id);
      setCurrentUser(formatUser({ id: currentUser.id, email: currentUser.email }, newProfile));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user: currentUser, 
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading: loading,
    userType: currentUser?.role,
    isAdmin: currentUser?.role === 'admin',
    isProfessional: currentUser?.role === 'profesional' || currentUser?.role === 'professional',
    isClient: currentUser?.role === 'cliente' || currentUser?.role === 'customer',
    signUp,
    signIn,
    signOut,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
