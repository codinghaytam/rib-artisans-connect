import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/integrations/supabase/error-handling';
import type { ArtisanProfile } from '@/integrations/supabase/types';

export const useTopArtisans = (limit: number = 4) => {
  const [topArtisans, setTopArtisans] = useState<ArtisanProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    let isMounted = true; // To prevent setting state after unmount
    
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured) {
      console.error("Supabase configuration is missing");
      if (isMounted) {
        setError("Erreur de configuration de la base de données. Veuillez contacter l'administrateur.");
        setLoading(false);
      }
      return; // Exit early if not configured
    }
    
    const fetchTopArtisans = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        // Wrap in a timeout promise to handle network timeouts better
        const fetchWithTimeout = new Promise<any>(async (resolve, reject) => {
          try {
            const { data, error: fetchError } = await supabase
              .from('artisan_profiles')
              .select(`
                *,
                profiles!inner (
                  id,
                  full_name,
                  avatar_url,
                  phone,
                  email
                ),
                categories!inner (
                  id,
                  name,
                  emoji
                ),
                cities (
                  id,
                  name,
                  region
                )
              `)
              .eq('is_active', true);
              
            if (fetchError) {
              reject(fetchError);
              console.error('Error fetching top artisans:', fetchError);
            } else {
              resolve(data);
            }
          } catch (error) {
            reject(error);
          }
        });

        
      } catch (err) {
        console.error('Error fetching top artisans:', err);
        if (isMounted) {
          // Use the error handling utility
          const errorMessage = err instanceof Error && err.message.includes('trop de temps')
            ? "Le temps de chargement a expiré. Veuillez réessayer plus tard."
            : handleSupabaseError(err);
            
          setError(errorMessage);
          console.error("Error in useTopArtisans:", err);
          // Empty array instead of mock data
          setTopArtisans([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Set a timeout for long-running requests
    const timeoutId = setTimeout(() => {
      if (loading && isMounted) {
        console.warn("Top artisans fetch timeout");
        
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying fetch (${retryCount + 1}/${MAX_RETRIES})...`);
          setRetryCount(prev => prev + 1);
          // Don't set error or loading false, let it retry
        } else {
          setError("Le temps de chargement a expiré. Veuillez réessayer plus tard.");
          setLoading(false);
        }
      }
    }, 5000); // 5 seconds timeout before retry
    
    // Only fetch if we're under the retry limit or if we changed the limit parameter
    if (retryCount <= MAX_RETRIES) {
      fetchTopArtisans();
    }
    
    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [limit, retryCount]);

  return { topArtisans, loading, error };
};
