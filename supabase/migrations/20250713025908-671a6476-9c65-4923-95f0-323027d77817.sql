-- Create storage bucket for artisan images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('artisan-images', 'artisan-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- Create storage policies for public access to artisan images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'artisan-images');

CREATE POLICY "Allow uploads for authenticated users"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'artisan-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow updates for authenticated users"
ON storage.objects FOR UPDATE
USING (bucket_id = 'artisan-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow deletes for authenticated users"  
ON storage.objects FOR DELETE
USING (bucket_id = 'artisan-images' AND auth.role() = 'authenticated');

-- Update artisan profiles to use storage bucket URLs instead of external URLs
UPDATE public.artisan_profiles 
SET portfolio_images = ARRAY['artisan-images/plumbing-work-1.jpg']
WHERE id = '850e8400-e29b-41d4-a716-446655440001';

UPDATE public.artisan_profiles 
SET portfolio_images = ARRAY['artisan-images/electrical-work-1.jpg']
WHERE id = '850e8400-e29b-41d4-a716-446655440002';

UPDATE public.artisan_profiles 
SET portfolio_images = ARRAY['artisan-images/woodwork-1.jpg']
WHERE id = '850e8400-e29b-41d4-a716-446655440003';

UPDATE public.artisan_profiles 
SET portfolio_images = ARRAY['artisan-images/painting-work-1.jpg']
WHERE id = '850e8400-e29b-41d4-a716-446655440004';

UPDATE public.artisan_profiles 
SET portfolio_images = ARRAY['artisan-images/masonry-work-1.jpg']
WHERE id = '850e8400-e29b-41d4-a716-446655440005';

UPDATE public.artisan_profiles 
SET portfolio_images = ARRAY['artisan-images/tile-work-1.jpg']
WHERE id = '850e8400-e29b-41d4-a716-446655440006';

UPDATE public.artisan_profiles 
SET portfolio_images = ARRAY['artisan-images/garden-work-1.jpg']
WHERE id = '850e8400-e29b-41d4-a716-446655440007';

UPDATE public.artisan_profiles 
SET portfolio_images = ARRAY['artisan-images/hvac-work-1.jpg']
WHERE id = '850e8400-e29b-41d4-a716-446655440008';

UPDATE public.artisan_profiles 
SET portfolio_images = ARRAY['artisan-images/electrical-work-2.jpg']
WHERE id = '850e8400-e29b-41d4-a716-446655440009';

UPDATE public.artisan_profiles 
SET portfolio_images = ARRAY['artisan-images/woodwork-2.jpg']
WHERE id = '850e8400-e29b-41d4-a716-446655440010';