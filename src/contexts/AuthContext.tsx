
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole, phone?: string) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('9rib_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('9rib_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data - in real app this would come from API
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role,
      isVerified: Math.random() > 0.5,
      phone: role === 'artisan' ? '+212600000000' : undefined,
      cin: role === 'artisan' ? 'BK123456' : undefined,
      city: 'Casablanca'
    };
    
    setUser(mockUser);
    localStorage.setItem('9rib_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole, 
    phone?: string
  ): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role,
      phone,
      isVerified: false,
      city: 'Casablanca'
    };
    
    setUser(newUser);
    localStorage.setItem('9rib_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('9rib_user');
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('9rib_user', JSON.stringify(updatedUser));
    setIsLoading(false);
  };

  const value: AuthContextType = {
    user,
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
