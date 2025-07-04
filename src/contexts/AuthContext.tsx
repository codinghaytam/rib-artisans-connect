
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export type UserRole = 'client' | 'artisan';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  cin?: string;
  isVerified: boolean;
  avatar?: string;
  city?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, name: string, role: UserRole, phone?: string, cin?: string) => Promise<{ error?: string }>;
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

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile from profiles table
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile && !error) {
            // Create user profile object from the database record
            const userProfile: User = {
              id: profile.id,
              email: profile.email,
              name: profile.name || '',
              role: profile.role as UserRole,
              phone: profile.phone || undefined,
              isVerified: false, // Default value
              avatar: profile.avatar_url || undefined
            };
            
            // Check for optional/custom properties in the database
            if ('is_verified' in profile) {
              userProfile.isVerified = Boolean(profile.is_verified);
            }
            
            if ('cin' in profile) {
              userProfile.cin = profile.cin as string;
            }
            
            if ('city' in profile) {
              userProfile.city = profile.city as string;
            }
            
            setUser(userProfile);
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      // The onAuthStateChange will handle the rest
    });

    return () => subscription.unsubscribe();
  }, []);

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
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profile && !profileError) {
          // Create user profile object from the database record
          // Checking for required properties and using defaults where necessary
          const userProfile: User = {
            id: profile.id,
            email: profile.email,
            name: profile.name || '',
            role: profile.role as UserRole,
            phone: profile.phone || undefined,
            isVerified: false, // Default to false, will be updated below
            avatar: profile.avatar_url || undefined
          };
          
          // Check for optional/custom properties in the database
          // These may not be in the types.ts but could exist in the actual table
          if ('is_verified' in profile) {
            userProfile.isVerified = Boolean(profile.is_verified);
          }
          
          if ('cin' in profile) {
            userProfile.cin = profile.cin as string;
          }
          
          if ('city' in profile) {
            userProfile.city = profile.city as string;
          }
          
          setUser(userProfile);
          setSession(data.session);
          console.log("Login successful, user profile updated", userProfile);
        } else {
          console.error('Error fetching user profile:', profileError);
        }
      }
      
      setIsLoading(false);
      return {};
    } catch (error: any) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { error: error.message || 'An unexpected error occurred during login' };
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole, 
    phone?: string,
    cin?: string
  ): Promise<{ error?: string }> => {
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
            phone,
            cin
          }
        }
      });
  
      if (signUpError) {
        setIsLoading(false);
        return { error: signUpError.message };
      }
      
      // Auto login after successful registration
      if (authData.user) {
        console.log("User registered successfully, creating profile", authData.user);
        
        // Create user profile in the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: authData.user.id,
              email: email,
              name: name,
              role: role,
              phone: phone || null,
              cin: cin || null,
              is_active: true,
              is_verified: role === 'client', // Auto-verify clients, artisans need verification
            }
          ]);
  
        if (profileError) {
          console.error('Error creating profile:', profileError);
          setIsLoading(false);
          return { error: `Registration successful, but profile creation failed: ${profileError.message}` };
        }
  
        // Auto login
        console.log("Profile created successfully, auto-logging in");
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
  
        if (loginError) {
          setIsLoading(false);
          return { error: `Registration successful, but auto-login failed: ${loginError.message}` };
        }
        
        // Update local user state with the newly created user
        const userProfile = {
          id: authData.user.id,
          email: email,
          name: name,
          role: role,
          phone: phone,
          cin: cin,
          isVerified: role === 'client', // Auto-verify clients, artisans need verification
        };
        
        setUser(userProfile as User);
        setSession(loginData.session);
        console.log("Auto-login successful");
      }
      
      return {};
    } catch (error: any) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return { error: error.message || 'An unexpected error occurred during registration' };
    }

    return {};
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.phone) updateData.phone = data.phone;
    if (data.cin) updateData.cin = data.cin;
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
