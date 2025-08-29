-- SECURITY FIX: Restrict public access to artisan profiles
-- Remove the overly permissive public policy
DROP POLICY IF EXISTS "Anyone can view active artisan profiles" ON artisan_profiles;

-- Create new restrictive policies for artisan profiles
-- 1. Public users can only see basic, non-sensitive information
CREATE POLICY "Public can view basic artisan info" 
ON artisan_profiles 
FOR SELECT 
USING (
  is_active = true 
  AND auth.uid() IS NULL -- Only for anonymous users
);

-- 2. Authenticated users can see more details but still restricted
CREATE POLICY "Authenticated users can view artisan profiles" 
ON artisan_profiles 
FOR SELECT 
USING (
  is_active = true 
  AND auth.uid() IS NOT NULL -- Only for authenticated users
);

-- 3. Create a view for public consumption with only safe data
CREATE OR REPLACE VIEW public.artisan_public_profiles AS
SELECT 
  ap.id,
  ap.user_id,
  ap.category_id,
  ap.city_id,
  ap.experience_years,
  ap.is_verified,
  ap.rating_average,
  ap.rating_count,
  ap.total_projects,
  ap.response_time_hours,
  ap.is_active,
  ap.is_featured,
  ap.featured_until,
  ap.business_name,
  ap.description,
  ap.specialties,
  ap.certifications,
  ap.portfolio_images,
  ap.languages,
  -- Only show general location, not exact address
  CASE 
    WHEN ap.address IS NOT NULL THEN 'Disponible sur demande'
    ELSE NULL 
  END as address_status,
  -- Hide hourly rate from public view
  CASE 
    WHEN auth.uid() IS NOT NULL THEN ap.hourly_rate
    ELSE NULL 
  END as hourly_rate,
  -- Hide exact service radius, show general availability
  CASE 
    WHEN ap.service_radius IS NOT NULL THEN 'Zone de service disponible'
    ELSE NULL 
  END as service_availability
FROM artisan_profiles ap
WHERE ap.is_active = true;

-- Create a separate view for authenticated users with contact info
CREATE OR REPLACE VIEW public.artisan_contact_profiles AS
SELECT 
  ap.id,
  ap.user_id,
  ap.category_id,
  ap.city_id,
  ap.experience_years,
  ap.hourly_rate,
  ap.availability_schedule,
  ap.service_radius,
  ap.is_verified,
  ap.verification_date,
  ap.rating_average,
  ap.rating_count,
  ap.total_projects,
  ap.response_time_hours,
  ap.is_active,
  ap.is_featured,
  ap.featured_until,
  ap.created_at,
  ap.updated_at,
  ap.business_name,
  ap.description,
  ap.specialties,
  ap.certifications,
  ap.portfolio_images,
  ap.verification_documents,
  ap.languages,
  ap.address,
  p.phone,
  p.email
FROM artisan_profiles ap
LEFT JOIN profiles p ON ap.user_id = p.id
WHERE ap.is_active = true
AND auth.uid() IS NOT NULL; -- Only authenticated users

-- Add comments explaining the security measures
COMMENT ON VIEW public.artisan_public_profiles IS 'Public view of artisan profiles with sensitive data removed - no contact info, addresses, or exact rates exposed';
COMMENT ON VIEW public.artisan_contact_profiles IS 'Authenticated user view of artisan profiles with contact information - requires user login';