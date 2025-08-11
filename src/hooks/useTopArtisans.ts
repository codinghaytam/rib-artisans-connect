import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/integrations/supabase/error-handling';
import type { Database } from '@/integrations/supabase/types';

// Define Category type
export type Category = {
  id: string;
  name: string;
  emoji?: string | null;
  description?: string | null;
  icon?: string | null;
  is_active?: boolean | null;
};

// Define City type
export type City = {
  id: string;
  name: string;
  region?: string | null;
  is_active?: boolean | null;
};

// Define Profile type for user data
export type Profile = {
  id: string;
  name?: string;
  avatar_url?: string | null;
  phone?: string | null;
  email?: string | null;
};

// Define the complete ArtisanProfile type with nested relations
export type ArtisanProfile = Database['public']['Tables']['artisan_profiles']['Row'] & {
  profiles?: Profile;
  categories?: Category;
  cities?: City;
};

export const useTopArtisans = (limit: number = 4, useMockOnFailure: boolean = false) => {
  const [topArtisans, setTopArtisans] = useState<ArtisanProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [usedMockData, setUsedMockData] = useState(false);
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
                profiles!user_id (
                  id,
                  name,
                  avatar_url,
                  phone,
                  email
                ),
                categories!category_id (
                  id,
                  name,
                  emoji
                ),
                cities!city_id (
                  id,
                  name,
                  region
                )
              `)
              .eq('is_active', true)
              .eq('is_verified', true)
              .order('rating_average', { ascending: false })
              .order('rating_count', { ascending: false })
              .limit(limit);
              
            if (fetchError) {
              reject(fetchError);
            } else {
              resolve(data);
            }
          } catch (error) {
            reject(error);
          }
        });
        
        // Race the fetch against a timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('La requête a pris trop de temps')), 8000)
        );

        const data = await Promise.race([fetchWithTimeout, timeoutPromise]);

        if (isMounted) {
          setTopArtisans(data as unknown as ArtisanProfile[]);
        }

      } catch (err) {
        console.error('Error fetching top artisans:', err);
        if (isMounted) {
          // Use the error handling utility
          const errorMessage = err instanceof Error && err.message.includes('trop de temps')
            ? "Le temps de chargement a expiré. Veuillez réessayer plus tard."
            : handleSupabaseError(err);
            
          // Check if we should use mock data on failure
          if (useMockOnFailure && retryCount >= MAX_RETRIES) {
            console.log("Using mock data for top artisans after all retries failed");
            const mockData = getMockTopArtisans(limit);
            setTopArtisans(mockData);
            setUsedMockData(true);
            setError(null); // Clear error since we have fallback data
          } else {
            setError(errorMessage);
            console.error("Error in useTopArtisans:", err);
            // Empty array instead of mock data
            setTopArtisans([]);
          }
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
          // Try mock data if enabled, otherwise show error
          if (useMockOnFailure) {
            console.log("Using mock data for top artisans after timeout");
            const mockData = getMockTopArtisans(limit);
            setTopArtisans(mockData);
            setUsedMockData(true);
            setError(null);
          } else {
            setError("Le temps de chargement a expiré. Veuillez réessayer plus tard.");
          }
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
  }, [limit, retryCount, useMockOnFailure]);

  return { topArtisans, loading, error, usedMockData };
};

// Utility function to generate mock data for testing or fallback
export const getMockTopArtisans = (count: number = 4): ArtisanProfile[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-${i+1}`,
    user_id: `user-${i+1}`,
    category_id: `cat-${(i % 3) + 1}`,
    city_id: `city-${(i % 5) + 1}`,
    business_name: `Artisan Business ${i+1}`,
    description: `Expert artisan with high quality work and years of experience in the field.`,
    is_active: true,
    is_verified: true,
    is_featured: i === 0,
    experience_years: 5 + i,
    rating_average: 4 + (i % 2) * 0.5,
    rating_count: 10 + i * 5,
    total_projects: 20 + i * 8,
    
    // Required fields with null values
    availability_schedule: null,
    certifications: null,
    created_at: null,
    featured_until: null,
    languages: null,
    portfolio_images: null,
    response_time_hours: null,
    service_radius: null,
    specialties: null,
    updated_at: null,
    verification_date: null,
    verification_documents: null,
    
    // Nested relations
    profiles: {
      id: `user-${i+1}`,
      name: `Artisan Name ${i+1}`,
      avatar_url: null,
      phone: `+212 6${i}${i} ${i}${i}${i} ${i}${i}${i}`,
      email: `artisan${i+1}@example.com`
    },
    categories: {
      id: `cat-${(i % 3) + 1}`,
      name: ['Plomberie', 'Électricité', 'Menuiserie'][(i % 3)],
      emoji: ['🔧', '⚡', '🪚'][(i % 3)]
    },
    cities: {
      id: `city-${(i % 5) + 1}`,
      name: ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger'][(i % 5)],
      region: ['Casablanca-Settat', 'Rabat-Salé-Kénitra', 'Marrakech-Safi', 'Fès-Meknès', 'Tanger-Tétouan-Al Hoceima'][(i % 5)]
    }
  }) as ArtisanProfile);
};
