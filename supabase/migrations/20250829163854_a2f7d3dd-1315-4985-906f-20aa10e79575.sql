-- Fix the security definer view issue by recreating views without security definer
DROP VIEW IF EXISTS public.artisan_public_profiles;
DROP VIEW IF EXISTS public.artisan_contact_profiles;

-- Recreate views with explicit security invoker (default behavior)
CREATE VIEW public.artisan_public_profiles 
SECURITY INVOKER
AS
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
  -- Hide exact service radius, show general availability
  CASE 
    WHEN ap.service_radius IS NOT NULL THEN 'Zone de service disponible'
    ELSE NULL 
  END as service_availability
FROM artisan_profiles ap
WHERE ap.is_active = true;

-- Create view for authenticated users with contact info
CREATE VIEW public.artisan_contact_profiles 
SECURITY INVOKER
AS
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
WHERE ap.is_active = true;