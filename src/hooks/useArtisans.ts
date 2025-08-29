import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/integrations/supabase/error-handling';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

// Define Category type from the database
export type Category = Database['public']['Tables']['categories']['Row'] & {
  count?: number; // Optional count field used in category listings
};

// Define City type from the database
export type City = Database['public']['Tables']['cities']['Row'];

// Define Profile type for the user profile data
export type Profile = {
  id: string;
  name: string;
  avatar_url?: string;
  phone?: string;
  email: string;
};

// Define ArtisanProfile type with nested relations and security-aware fields
export type ArtisanProfile = Database['public']['Tables']['artisan_profiles']['Row'] & {
  profiles?: Profile;
  categories?: Category;
  cities?: City;
  phone?: string; // Available only for authenticated users
  email?: string; // Available only for authenticated users
  address_status?: string; // Public status indicator
  service_availability?: string; // Public availability indicator
};

export interface ArtisanFilters {
  searchTerm?: string;
  categoryId?: string;
  cityId?: string;
  minRating?: number;
  isVerified?: boolean;
  isAvailable?: boolean;
}

export const useArtisans = (filters: ArtisanFilters = {}) => {
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useAuth();
  const MAX_RETRIES = 3;

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if Supabase is properly configured
      if (!isSupabaseConfigured) {
        throw new Error("Erreur de configuration de la base de données");
      }

      // Use secure views based on authentication status
      const tableName = user ? 'artisan_contact_profiles' : 'artisan_public_profiles';
      
      let query = supabase
        .from(tableName)
        .select(`
          *,
          profiles!user_id (
            id,
            name,
            avatar_url${user ? ',\n            phone,\n            email' : ''}
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
        `);

      // Apply filters
      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      if (filters.cityId) {
        query = query.eq('city_id', filters.cityId);
      }

      if (filters.minRating) {
        query = query.gte('rating_average', filters.minRating);
      }

      if (filters.isVerified !== undefined) {
        query = query.eq('is_verified', filters.isVerified);
      }

      // Search functionality - we need to handle cross-table search carefully
      if (filters.searchTerm) {
        const searchQuery = `%${filters.searchTerm}%`;
        
        // Get all artisan profiles, then filter the results with related data
        // This avoids the PostgREST cross-table OR limitation
        const allData = await query;
        
        if (!allData.error && allData.data) {
          const filtered = allData.data.filter((artisan: any) => {
            const searchFields = [
              artisan.business_name,
              artisan.description, 
              artisan.address,
              artisan.profiles?.name,
            ].filter(Boolean).join(' ').toLowerCase();
            
            return searchFields.includes(filters.searchTerm!.toLowerCase());
          });
          
          setArtisans(filtered as unknown as ArtisanProfile[]);
          setLoading(false);
          return;
        }
      }

      // Order by featured first, then by rating
      query = query.order('is_featured', { ascending: false })
                   .order('rating_average', { ascending: false });

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setArtisans(data as unknown as ArtisanProfile[]);
    } catch (err) {
      console.error('Error fetching artisans:', err);
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      
      // Retry logic for network errors
      if (retryCount < MAX_RETRIES && 
          (err instanceof Error && 
           (err.message.includes('network') || 
            err.message.includes('timeout') || 
            err.message.includes('fetch')))) {
        console.log(`Will retry fetch (${retryCount + 1}/${MAX_RETRIES})...`);
        setRetryCount(prev => prev + 1);
      }
      
      // Empty array on error
      setArtisans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    fetchArtisans();
    
    return () => {
      isMounted = false;
    };
  }, [
    filters.searchTerm,
    filters.categoryId,
    filters.cityId,
    filters.minRating,
    filters.isVerified,
    filters.isAvailable,
    retryCount, // Re-fetch when retry count changes
    user?.id // Re-fetch when authentication status changes
  ]);

  return {
    artisans,
    loading,
    error,
    refetch: fetchArtisans
  };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Check if Supabase is properly configured
    if (!isSupabaseConfigured) {
      console.error("Supabase configuration is missing");
      if (isMounted) {
        setError("Erreur de configuration de la base de données. Veuillez contacter l'administrateur.");
        setLoading(false);
      }
      return; // Exit early if not configured
    }

    const fetchCategories = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }
        
        const { data, error: fetchError } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (fetchError) throw fetchError;
        
        // Count artisans in each category
        if (isMounted) {
          const categoriesWithCounts = await Promise.all(
            data.map(async (category) => {
              const { count, error: countError } = await supabase
                .from('artisan_profiles')
                .select('*', { count: 'exact', head: true })
                .eq('category_id', category.id)
                .eq('is_active', true);
                
              if (countError) console.error('Error fetching count:', countError);
              return {
                ...category,
                count: count || 0
              };
            })
          );
          setCategories(categoriesWithCounts);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        if (isMounted) {
          const errorMessage = handleSupabaseError(err);
          setError(errorMessage);
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return { categories, loading, error };
};

export const useCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Check if Supabase is properly configured
    if (!isSupabaseConfigured) {
      console.error("Supabase configuration is missing");
      if (isMounted) {
        setError("Erreur de configuration de la base de données. Veuillez contacter l'administrateur.");
        setLoading(false);
      }
      return; // Exit early if not configured
    }

    const fetchCities = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }
        
        const { data, error: fetchError } = await supabase
          .from('cities')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (fetchError) throw fetchError;
        
        if (isMounted) {
          setCities(data);
        }
      } catch (err) {
        console.error('Error fetching cities:', err);
        if (isMounted) {
          const errorMessage = handleSupabaseError(err);
          setError(errorMessage);
          setCities([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCities();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return { cities, loading, error };
};
