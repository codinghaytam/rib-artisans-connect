import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ArtisanProfile, Category, City } from '@/integrations/supabase/types';

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

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('artisan_profiles')
        .select(`
          *,
          profiles!inner (
            id,
            name,
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

      // Search by name or city
      if (filters.searchTerm) {
        // Use textSearch for better search functionality
        const searchQuery = `%${filters.searchTerm}%`;
        query = query.or(`profiles.name.ilike.${searchQuery},cities.name.ilike.${searchQuery},business_name.ilike.${searchQuery}`);
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
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisans();
  }, [
    filters.searchTerm,
    filters.categoryId,
    filters.cityId,
    filters.minRating,
    filters.isVerified,
    filters.isAvailable
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
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (fetchError) throw fetchError;
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export const useCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('cities')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (fetchError) throw fetchError;
        setCities(data);
      } catch (err) {
        console.error('Error fetching cities:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return { cities, loading, error };
};
