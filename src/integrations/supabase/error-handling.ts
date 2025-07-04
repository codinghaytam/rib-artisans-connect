import { useEffect, useState } from 'react';
import { isSupabaseConfigured } from './client';

// Custom hook to check if Supabase is properly configured
export const useSupabaseStatus = () => {
  const [isConfigured, setIsConfigured] = useState(isSupabaseConfigured);
  const [checkComplete, setCheckComplete] = useState(false);
  
  useEffect(() => {
    // Simple check to verify Supabase configuration
    setIsConfigured(isSupabaseConfigured);
    setCheckComplete(true);
  }, []);
  
  return { isConfigured, checkComplete };
};

// Helper function to handle common Supabase errors
export const handleSupabaseError = (error: unknown): string => {
  if (!error) return 'Une erreur inconnue est survenue';
  
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    
    // API key related errors
    if (errorMessage.includes('api key') || errorMessage.includes('apikey') || 
        errorMessage.includes('no api key') || errorMessage.includes('invalid api key')) {
      console.error('Supabase API key error:', error);
      return 'Erreur de configuration de la base de données. Veuillez contacter l\'administrateur.';
    }
    
    // Network related errors
    if (errorMessage.includes('network') || errorMessage.includes('fetch') || 
        errorMessage.includes('timeout') || errorMessage.includes('connection')) {
      console.error('Network error when accessing Supabase:', error);
      return 'Erreur de connexion au serveur. Veuillez vérifier votre connexion internet.';
    }
    
    // Authentication errors
    if (errorMessage.includes('auth') || errorMessage.includes('permission') || 
        errorMessage.includes('unauthorized') || errorMessage.includes('not allowed')) {
      console.error('Authentication error with Supabase:', error);
      return 'Erreur d\'authentification. Veuillez vous reconnecter.';
    }
    
    // Return the actual error message for other cases
    return `Erreur: ${error.message}`;
  }
  
  // Generic error message
  return 'Une erreur est survenue lors de la connexion à la base de données';
};
