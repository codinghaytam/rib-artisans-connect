
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
/* eslint-disable react-refresh/only-export-components */

export type UserRole = 'client' | 'artisan' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  isVerified: boolean;
  avatar?: string;
  city?: string;
}

export interface AuthContextType {
  user: User | null;
  profile: User | null; // alias for user for backward compatibility
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, name: string, role: UserRole, phone?: string) => Promise<{ error?: string, needsEmailConfirmation?: boolean }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  type DBProfile = {
    id: string;
    email: string;
    role: string;
    phone?: string | null;
    is_verified?: boolean | null;
    avatar_url?: string | null;
    city?: string | null;
  };

  // Fetch profile from DB and merge into current user state (deferred)
  const fetchAndSetProfile = useCallback(async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id,email,role,phone,is_verified,avatar_url,city')
        .eq('id', userId)
        .maybeSingle<DBProfile>();

      if (error) {
        console.error('Profile fetch error:', error);
        return;
      }

      if (profile) {
        setUser((prev) => ({
          id: profile.id,
          email: profile.email,
          name: prev?.name || profile.email,
          role: (profile.role as UserRole) || 'client',
          phone: profile.phone ?? undefined,
          isVerified: Boolean(profile.is_verified ?? false),
          avatar: profile.avatar_url ?? undefined,
          city: profile.city ?? undefined,
        }));
      }
    } catch (e) {
      console.error('Unexpected error fetching profile:', e);
    }
  }, []);

useEffect(() => {
  // Listener FIRST — do not run async Supabase calls inside the callback
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, sess) => {
    console.log('Auth state changed:', event, sess);
    setSession(sess);

    const authUser = sess?.user ?? null;
    if (authUser) {
      const minimalUser: User = {
        id: authUser.id,
        email: authUser.email || '',
        name: (authUser.user_metadata?.name as string) || authUser.email || '',
        role: (authUser.user_metadata?.role as UserRole) || 'client',
        isVerified: Boolean(authUser.user_metadata?.is_verified),
      };
      setUser(minimalUser);
      // Defer DB fetch to avoid deadlocks
      setTimeout(() => fetchAndSetProfile(authUser.id), 0);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  });

  // THEN check for existing session to restore persisted auth
    supabase.auth.getSession().then(({ data: { session } }) => {
    console.log('Initial session:', session);
    setSession(session);
    const authUser = session?.user ?? null;
    if (authUser) {
      const minimalUser: User = {
        id: authUser.id,
        email: authUser.email || '',
        name: (authUser.user_metadata?.name as string) || authUser.email || '',
        role: (authUser.user_metadata?.role as UserRole) || 'client',
        isVerified: Boolean(authUser.user_metadata?.is_verified),
      };
      setUser(minimalUser);
      setTimeout(() => fetchAndSetProfile(authUser.id), 0);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  });

    return () => subscription.unsubscribe();
  }, [fetchAndSetProfile]);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setIsLoading(false);
        return { error: error.message };
      }
      
      // After successful login, fetch and update the user profile
      if (data.user) {
        // Fetch user profile from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id,email,role,phone,is_verified,avatar_url,city')
          .eq('id', data.user.id)
          .single<DBProfile>();
          
        if (profile && !profileError) {
          // Create user profile object from the database record
          // Checking for required properties and using defaults where necessary
          const userProfile: User = {
            id: profile.id,
            email: profile.email,
            name: (data.user.user_metadata?.name as string) || profile.email || '',
            role: profile.role as UserRole,
            phone: profile.phone ?? undefined,
            isVerified: Boolean(profile.is_verified ?? false),
            avatar: profile.avatar_url ?? undefined
          };
          userProfile.city = profile.city ?? undefined;
          
          setUser(userProfile);
          setSession(data.session);
          console.log("Login successful, user profile updated", userProfile);
        } else {
          console.error('Error fetching user profile:', profileError);
        }
      }
      
      setIsLoading(false);
      return {};
    } catch (error: unknown) {
      console.error('Login error:', error);
      setIsLoading(false);
      const msg = error instanceof Error ? error.message : 'An unexpected error occurred during login';
      return { error: msg };
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole, 
    phone?: string,
  // cin removed from schema
  ): Promise<{ error?: string, needsEmailConfirmation?: boolean }> => {
    setIsLoading(true);
    
    const redirectUrl = `${window.location.origin}/`;
    
    try {
      // Register the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            role,
            phone
          }
        }
      });
  
      if (signUpError) {
        setIsLoading(false);
        return { error: signUpError.message };
      }
      
      // Check if email confirmation is required
      if (authData.user && !authData.session) {
        console.log("User registered successfully, but email confirmation required");
        setIsLoading(false);
        return { needsEmailConfirmation: true };
      }
      
      // If we have a session, the user is confirmed and logged in
      if (authData.user && authData.session) {
        console.log("User registered and logged in successfully", authData.user);
        
        // Create user profile in the profiles table - This will be handled by the trigger
        // so we don't need to manually insert into profiles table
        console.log("User registered and logged in successfully", authData.user);
        
        // Update local user state with the newly created user
        const userProfile = {
          id: authData.user.id,
          email: email,
          name: name,
          role: role,
          phone: phone,
          // cin removed from schema
          isVerified: role === 'client', // Auto-verify clients, artisans need verification
        };
        
        setUser(userProfile as User);
        setSession(authData.session);
        console.log("Registration and login successful");
      }
      
      setIsLoading(false);
      return {};
    } catch (error: unknown) {
      console.error('Registration error:', error);
      setIsLoading(false);
      const msg = error instanceof Error ? error.message : 'An unexpected error occurred during registration';
      return { error: msg };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Sign out from Supabase (backend)
      await supabase.auth.signOut();
      
      // Clear local state explicitly
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    
    const updateData: Record<string, unknown> = {};
    if (data.phone) updateData.phone = data.phone;
    if (data.city) updateData.city = data.city;
    if (data.avatar) updateData.avatar_url = data.avatar;
    
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);
    
    if (!error) {
      setUser({ ...user, ...data });
    }
    
    setIsLoading(false);
  };

  const value: AuthContextType = {
    user,
    profile: user, // alias for user for backward compatibility
    session,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
