import { supabase, isSupabaseConfigured } from './client';

/**
 * Check the Supabase configuration and connection
 * This function can be called on app startup to verify Supabase is working
 */
export const validateSupabaseConnection = async (): Promise<{
  isValid: boolean;
  message: string;
}> => {
  try {
    // First check if configuration exists
    if (!isSupabaseConfigured) {
      console.error('Supabase configuration is missing');
      return { 
        isValid: false, 
        message: 'Missing Supabase configuration. Please check your environment variables.'
      };
    }

    // Try a simple database query to validate the connection
    const { data, error } = await supabase.from('categories').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      if (error.message.includes('apikey') || error.message.includes('API key')) {
        return { 
          isValid: false, 
          message: 'Invalid API key or authorization issue' 
        };
      }
      return { 
        isValid: false, 
        message: `Failed to connect to Supabase: ${error.message}` 
      };
    }
    
    // If we got here, connection works
    return { 
      isValid: true, 
      message: 'Supabase connection validated successfully' 
    };
  } catch (err) {
    console.error('Exception validating Supabase connection:', err);
    return { 
      isValid: false, 
      message: err instanceof Error ? err.message : 'Unknown error validating Supabase connection'
    };
  }
};
