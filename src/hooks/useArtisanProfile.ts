import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/integrations/supabase/error-handling';
import { Database } from '@/integrations/supabase/types';
import { ArtisanProfile } from '@/hooks/useArtisans';

// Define Review type from the database
export type Review = Database['public']['Tables']['reviews']['Row'] & {
  reviewer?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  project?: {
    id: string;
    title: string;
  };
};

export const useArtisanProfile = (userId: string) => {
  const [artisan, setArtisan] = useState<ArtisanProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchArtisanProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Check if Supabase is properly configured
        if (!isSupabaseConfigured) {
          throw new Error("Erreur de configuration de la base de données");
        }

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
          .eq('user_id', userId)
          .eq('is_active', true)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        if (isMounted) {
          setArtisan(data as unknown as ArtisanProfile);
        }
      } catch (err) {
        console.error('Error fetching artisan profile:', err);
        if (isMounted) {
          const errorMessage = handleSupabaseError(err);
          setError(errorMessage);
          setArtisan(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchArtisanProfile();
    
    return () => {
      isMounted = false;
    };
  }, [userId]);

  return { artisan, loading, error };
};

export const useArtisanReviews = (userId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchReviews = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Check if Supabase is properly configured
        if (!isSupabaseConfigured) {
          throw new Error("Erreur de configuration de la base de données");
        }

        const { data, error: fetchError } = await supabase
          .from('reviews')
          .select(`
            *,
            reviewer:profiles!reviewer_id (
              id,
              name,
              avatar_url
            ),
            project:projects!project_id (
              id,
              title
            )
          `)
          .eq('reviewee_id', userId)
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        if (isMounted) {
          setReviews(data as unknown as Review[]);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        if (isMounted) {
          const errorMessage = handleSupabaseError(err);
          setError(errorMessage);
          setReviews([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReviews();
    
    return () => {
      isMounted = false;
    };
  }, [userId]);

  return { reviews, loading, error };
};