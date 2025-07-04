import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/integrations/supabase/error-handling';
import type { Database } from '@/integrations/supabase/types';

export type Category = Database['public']['Tables']['categories']['Row'] & {
  count?: number;
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
        
        // Fetch categories from Supabase
        const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');
        
        if (categoriesError) throw categoriesError;

        // For each category, count the number of artisans in that category
        const categoriesWithCounts = await Promise.all(
          categoriesData.map(async (category) => {
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
