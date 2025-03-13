import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  forceRefreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(() => {
    // Initialize from localStorage if available
    const savedAdminStatus = localStorage.getItem('isAdmin');
    return savedAdminStatus === 'true';
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Force refresh auth state
  const forceRefreshAuth = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    // Check for active session on component mount
    const getSession = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user || null);
        
        // Check if user is admin
        if (session?.user) {
          // Use cached admin status initially
          const cachedAdminStatus = localStorage.getItem('isAdmin') === 'true';
          setIsAdmin(cachedAdminStatus);
          
          // Then verify in background
          checkAdminStatus(session.user.id).catch(console.error);
        } else {
          setIsAdmin(false);
          localStorage.removeItem('isAdmin');
        }
      } catch (error) {
        console.error('Unexpected error in getSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('Auth state changed:', _event, session?.user?.email);
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          // Use cached admin status initially
          const cachedAdminStatus = localStorage.getItem('isAdmin') === 'true';
          setIsAdmin(cachedAdminStatus);
          
          // Then verify in background
          checkAdminStatus(session.user.id).catch(console.error);
        } else {
          setIsAdmin(false);
          localStorage.removeItem('isAdmin');
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshTrigger]);

  // Function to check if user is an admin
  const checkAdminStatus = async (userId: string) => {
    try {
      console.log(`Checking admin status for user ID: ${userId}`);
      
      const { data: adminData } = await supabase
        .from('admins')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      const isUserAdmin = !!adminData;
      console.log('Admin status:', isUserAdmin);
      setIsAdmin(isUserAdmin);
      localStorage.setItem('isAdmin', isUserAdmin.toString());
      
      return isUserAdmin;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      console.log(`Signing in with email: ${email}`);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }
      
      console.log('Sign in successful:', data.user?.email);
      
      // Immediately check admin status
      if (data.user) {
        const { data: adminData } = await supabase
          .from('admins')
          .select('id')
          .eq('user_id', data.user.id)
          .single();

        const isUserAdmin = !!adminData;
        setIsAdmin(isUserAdmin);
        localStorage.setItem('isAdmin', isUserAdmin.toString());
        setSession(data.session);
        setUser(data.user);
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Clear admin status on sign out
      setIsAdmin(false);
      localStorage.removeItem('isAdmin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signOut,
        isAdmin,
        forceRefreshAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 