-- Migration script for Supabase SQL Editor
-- This script helps you migrate data from your old Supabase project to the new one

-- Step 1: First, you'll need to export data from your old project
-- Go to your old Supabase project SQL Editor and run these queries to export data:

/*
-- Export categories
SELECT 'INSERT INTO public.categories (id, name, description, emoji, icon, is_active, created_at, updated_at) VALUES' ||
  string_agg(
    '(''' || id || ''', ''' || name || ''', ' || 
    COALESCE('''' || description || '''', 'NULL') || ', ' ||
    COALESCE('''' || emoji || '''', 'NULL') || ', ' ||
    COALESCE('''' || icon || '''', 'NULL') || ', ' ||
    is_active || ', ''' || created_at || ''', ''' || updated_at || ''')',
    ', '
  ) || ';'
FROM public.categories;

-- Export cities  
SELECT 'INSERT INTO public.cities (id, name, region, is_active, created_at) VALUES' ||
  string_agg(
    '(''' || id || ''', ''' || name || ''', ' || 
    COALESCE('''' || region || '''', 'NULL') || ', ' ||
    is_active || ', ''' || created_at || ''')',
    ', '
  ) || ';'
FROM public.cities;

-- Export profiles
SELECT 'INSERT INTO public.profiles (id, email, name, role, phone, cin, city, avatar_url, is_verified, is_active, created_at, updated_at) VALUES' ||
  string_agg(
    '(''' || id || ''', ''' || email || ''', ''' || name || ''', ''' || role || ''', ' ||
    COALESCE('''' || phone || '''', 'NULL') || ', ' ||
    COALESCE('''' || cin || '''', 'NULL') || ', ' ||
    COALESCE('''' || city || '''', 'NULL') || ', ' ||
    COALESCE('''' || avatar_url || '''', 'NULL') || ', ' ||
    COALESCE(is_verified::text, 'NULL') || ', ' ||
    COALESCE(is_active::text, 'NULL') || ', ''' ||
    created_at || ''', ''' || updated_at || ''')',
    ', '
  ) || ';'
FROM public.profiles;

-- Export artisan_profiles
SELECT 'INSERT INTO public.artisan_profiles (id, user_id, category_id, city_id, business_name, description, experience_years, hourly_rate, rating_average, rating_count, total_projects, response_time_hours, is_active, is_verified, is_featured, featured_until, verification_date, specialties, languages, certifications, portfolio_images, verification_documents, availability_schedule, service_radius, address, created_at, updated_at) VALUES' ||
  string_agg(
    '(''' || id || ''', ''' || user_id || ''', ''' || category_id || ''', ' ||
    COALESCE('''' || city_id || '''', 'NULL') || ', ' ||
    COALESCE('''' || business_name || '''', 'NULL') || ', ' ||
    COALESCE('''' || description || '''', 'NULL') || ', ' ||
    COALESCE(experience_years::text, 'NULL') || ', ' ||
    COALESCE(hourly_rate::text, 'NULL') || ', ' ||
    COALESCE(rating_average::text, 'NULL') || ', ' ||
    COALESCE(rating_count::text, 'NULL') || ', ' ||
    COALESCE(total_projects::text, 'NULL') || ', ' ||
    COALESCE(response_time_hours::text, 'NULL') || ', ' ||
    COALESCE(is_active::text, 'NULL') || ', ' ||
    COALESCE(is_verified::text, 'NULL') || ', ' ||
    COALESCE(is_featured::text, 'NULL') || ', ' ||
    COALESCE('''' || featured_until || '''', 'NULL') || ', ' ||
    COALESCE('''' || verification_date || '''', 'NULL') || ', ' ||
    COALESCE('ARRAY[' || array_to_string(specialties, ',') || ']', 'NULL') || ', ' ||
    COALESCE('ARRAY[' || array_to_string(languages, ',') || ']', 'NULL') || ', ' ||
    COALESCE('ARRAY[' || array_to_string(certifications, ',') || ']', 'NULL') || ', ' ||
    COALESCE('ARRAY[' || array_to_string(portfolio_images, ',') || ']', 'NULL') || ', ' ||
    COALESCE('ARRAY[' || array_to_string(verification_documents, ',') || ']', 'NULL') || ', ' ||
    COALESCE('''' || availability_schedule || '''', 'NULL') || ', ' ||
    COALESCE(service_radius::text, 'NULL') || ', ' ||
    COALESCE('''' || address || '''', 'NULL') || ', ''' ||
    created_at || ''', ''' || updated_at || ''')',
    ', '
  ) || ';'
FROM public.artisan_profiles;
*/

-- Step 2: After exporting, paste the generated INSERT statements below and run them in your NEW project

-- Example of how to disable RLS temporarily for bulk inserts (if needed):
-- ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.cities DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.artisan_profiles DISABLE ROW LEVEL SECURITY;

-- Step 3: Paste your exported INSERT statements here:

-- INSERT INTO public.categories (id, name, description, emoji, icon, is_active, created_at, updated_at) VALUES
-- (your exported data will go here)

-- INSERT INTO public.cities (id, name, region, is_active, created_at) VALUES  
-- (your exported data will go here)

-- INSERT INTO public.profiles (id, email, name, role, phone, cin, city, avatar_url, is_verified, is_active, created_at, updated_at) VALUES
-- (your exported data will go here)

-- INSERT INTO public.artisan_profiles (...)  VALUES
-- (your exported data will go here)

-- Step 4: Re-enable RLS after migration (if you disabled it):
-- ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.artisan_profiles ENABLE ROW LEVEL SECURITY;

-- Step 5: Update sequences to prevent primary key conflicts
SELECT setval('profiles_id_seq', (SELECT MAX(id) FROM profiles));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('cities_id_seq', (SELECT MAX(id) FROM cities));
SELECT setval('artisan_profiles_id_seq', (SELECT MAX(id) FROM artisan_profiles));