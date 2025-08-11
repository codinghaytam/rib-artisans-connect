import React, { useEffect, useState } from 'react';
import { validateSupabaseConnection } from '@/integrations/supabase/validate';
import { useToast } from '@/hooks/use-toast';

interface SupabaseStatusProviderProps {
  children: React.ReactNode;
}

/**
 * Component that checks Supabase connection status on mount
 * and provides a global context for connection status
 */
export const SupabaseStatusProvider: React.FC<SupabaseStatusProviderProps> = ({ children }) => {
  const [connectionChecked, setConnectionChecked] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { isValid, message } = await validateSupabaseConnection();
        
        if (!isValid) {
          console.error('Supabase connection error:', message);
          setIsConnected(false);
          
          // Show a toast only in development mode
          if (import.meta.env.DEV) {
            toast({
              title: "Problème de connexion à la base de données",
              description: "Vérifiez la configuration de Supabase et les clés API",
              variant: "destructive"
            });
          }
        } else {
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error checking Supabase connection:', error);
        setIsConnected(false);
      } finally {
        setConnectionChecked(true);
      }
    };

    checkConnection();
  }, [toast]);

  // Render children regardless of connection status
  // Individual components will handle their own error states
  return <>{children}</>;
};

export default SupabaseStatusProvider;
