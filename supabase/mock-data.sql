-- Mock Data for RIB Artisans Connect
-- This file contains sample data to populate the database for testing

-- ⚠️  IMPORTANT: This script is for development/testing only
-- To use this script, you need to either:
-- 1. Create actual users through Supabase Auth first, OR
-- 2. Temporarily disable the foreign key constraint

-- Clear existing data (be careful in production!)
TRUNCATE TABLE public.artisan_profiles CASCADE;
TRUNCATE TABLE public.profiles CASCADE;
TRUNCATE TABLE public.categories CASCADE;
TRUNCATE TABLE public.cities CASCADE;

-- Insert categories
INSERT INTO public.categories (id, name, description, icon, emoji, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Plomberie', 'Services de plomberie générale', 'wrench', '🔧', true),
('550e8400-e29b-41d4-a716-446655440002', 'Électricité', 'Installation et réparation électrique', 'zap', '⚡', true),
('550e8400-e29b-41d4-a716-446655440003', 'Menuiserie', 'Travail du bois et ébénisterie', 'hammer', '🔨', true),
('550e8400-e29b-41d4-a716-446655440004', 'Peinture', 'Peinture intérieure et extérieure', 'paintbrush', '🎨', true),
('550e8400-e29b-41d4-a716-446655440005', 'Maçonnerie', 'Travaux de construction et rénovation', 'brick', '🧱', true),
('550e8400-e29b-41d4-a716-446655440006', 'Carrelage', 'Pose de carrelage et faïence', 'grid', '🏠', true),
('550e8400-e29b-41d4-a716-446655440007', 'Jardinage', 'Entretien et aménagement de jardin', 'leaf', '🌱', true),
('550e8400-e29b-41d4-a716-446655440008', 'Climatisation', 'Installation et maintenance climatisation', 'snowflake', '❄️', true);

-- Insert cities
INSERT INTO public.cities (id, name, region, is_active) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Casablanca', 'Grand Casablanca-Settat', true),
('650e8400-e29b-41d4-a716-446655440002', 'Rabat', 'Rabat-Salé-Kénitra', true),
('650e8400-e29b-41d4-a716-446655440003', 'Marrakech', 'Marrakech-Safi', true),
('650e8400-e29b-41d4-a716-446655440004', 'Fès', 'Fès-Meknès', true),
('650e8400-e29b-41d4-a716-446655440005', 'Tangier', 'Tanger-Tétouan-Al Hoceïma', true),
('650e8400-e29b-41d4-a716-446655440006', 'Agadir', 'Souss-Massa', true),
('650e8400-e29b-41d4-a716-446655440007', 'Meknès', 'Fès-Meknès', true),
('650e8400-e29b-41d4-a716-446655440008', 'Oujda', 'Oriental', true),
('650e8400-e29b-41d4-a716-446655440009', 'Kenitra', 'Rabat-Salé-Kénitra', true),
('650e8400-e29b-41d4-a716-446655440010', 'Tétouan', 'Tanger-Tétouan-Al Hoceïma', true);

-- Temporarily disable the foreign key constraint to insert mock data
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Insert user profiles
INSERT INTO public.profiles (id, email, name, role, phone, cin, city, is_verified, avatar_url) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'ahmed.benjelloun@email.com', 'Ahmed Benjelloun', 'artisan', '+212 661-234567', 'AB123456', 'Casablanca', true, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'),
('750e8400-e29b-41d4-a716-446655440002', 'fatima.elalami@email.com', 'Fatima El Alami', 'artisan', '+212 662-345678', 'FE789012', 'Rabat', true, 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'),
('750e8400-e29b-41d4-a716-446655440003', 'youssef.tazi@email.com', 'Youssef Tazi', 'artisan', '+212 663-456789', 'YT345678', 'Marrakech', true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'),
('750e8400-e29b-41d4-a716-446655440004', 'khadija.bennani@email.com', 'Khadija Bennani', 'artisan', '+212 664-567890', 'KB901234', 'Fès', false, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'),
('750e8400-e29b-41d4-a716-446655440005', 'hassan.alaoui@email.com', 'Hassan Alaoui', 'artisan', '+212 665-678901', 'HA567890', 'Tangier', true, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face'),
('750e8400-e29b-41d4-a716-446655440006', 'aicha.idrissi@email.com', 'Aicha Idrissi', 'artisan', '+212 666-789012', 'AI123456', 'Agadir', true, 'https://images.unsplash.com/photo-1559209172-b8e8f0af83bc?w=150&h=150&fit=crop&crop=face'),
('750e8400-e29b-41d4-a716-446655440007', 'mohamed.chakir@email.com', 'Mohamed Chakir', 'artisan', '+212 667-890123', 'MC789012', 'Meknès', true, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'),
('750e8400-e29b-41d4-a716-446655440008', 'zineb.fassi@email.com', 'Zineb Fassi', 'artisan', '+212 668-901234', 'ZF345678', 'Oujda', true, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face'),
('750e8400-e29b-41d4-a716-446655440009', 'omar.tazi@email.com', 'Omar Tazi', 'artisan', '+212 669-012345', 'OT901234', 'Kenitra', false, 'https://images.unsplash.com/photo-1519764622345-23439dd774f8?w=150&h=150&fit=crop&crop=face'),
('750e8400-e29b-41d4-a716-446655440010', 'najat.berrada@email.com', 'Najat Berrada', 'artisan', '+212 660-123456', 'NB567890', 'Tétouan', true, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face');

-- Insert artisan profiles
INSERT INTO public.artisan_profiles (
  id, user_id, category_id, city_id, business_name, description, experience_years, 
  hourly_rate, specialties, certifications, portfolio_images, service_radius,
  is_verified, rating_average, rating_count, total_projects, response_time_hours,
  languages, is_active, is_featured
) VALUES
(
  '850e8400-e29b-41d4-a716-446655440001',
  '750e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001', -- Plomberie
  '650e8400-e29b-41d4-a716-446655440001', -- Casablanca
  'Plomberie Benjelloun',
  'Expert en plomberie avec plus de 15 ans d''expérience. Spécialisé dans les installations sanitaires et le dépannage d''urgence.',
  15,
  45.00,
  ARRAY['Installation sanitaire', 'Dépannage urgence', 'Rénovation salle de bain'],
  ARRAY['Certification professionnelle ONEE', 'Formation sécurité'],
  ARRAY['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop'],
  30,
  true,
  4.8,
  45,
  127,
  12,
  ARRAY['Français', 'Arabe', 'Berbère'],
  true,
  true
),
(
  '850e8400-e29b-41d4-a716-446655440002',
  '750e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440002', -- Électricité
  '650e8400-e29b-41d4-a716-446655440002', -- Rabat
  'Électricité El Alami',
  'Électricienne certifiée spécialisée dans les installations résidentielles et commerciales. Service rapide et fiable.',
  12,
  40.00,
  ARRAY['Installation électrique', 'Tableaux électriques', 'Domotique'],
  ARRAY['Licence électricien', 'Certification basse tension'],
  ARRAY['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop'],
  25,
  true,
  4.9,
  32,
  89,
  8,
  ARRAY['Français', 'Arabe'],
  true,
  true
),
(
  '850e8400-e29b-41d4-a716-446655440003',
  '750e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440003', -- Menuiserie
  '650e8400-e29b-41d4-a716-446655440003', -- Marrakech
  'Menuiserie Traditionnelle Tazi',
  'Artisan menuisier spécialisé dans la menuiserie traditionnelle marocaine et moderne. Créations sur mesure.',
  18,
  35.00,
  ARRAY['Menuiserie traditionnelle', 'Meubles sur mesure', 'Restauration'],
  ARRAY['Maître artisan', 'Formation ébénisterie'],
  ARRAY['https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=400&h=300&fit=crop'],
  40,
  true,
  4.7,
  28,
  156,
  24,
  ARRAY['Français', 'Arabe', 'Berbère'],
  true,
  false
),
(
  '850e8400-e29b-41d4-a716-446655440004',
  '750e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440004', -- Peinture
  '650e8400-e29b-41d4-a716-446655440004', -- Fès
  'Peinture Déco Bennani',
  'Artiste peintre et décoratrice d''intérieur. Spécialisée dans les finitions haut de gamme et les techniques décoratives.',
  10,
  30.00,
  ARRAY['Peinture décorative', 'Enduits décoratifs', 'Tadelakt'],
  ARRAY['Formation arts décoratifs'],
  ARRAY['https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop'],
  20,
  false,
  4.6,
  19,
  67,
  16,
  ARRAY['Français', 'Arabe'],
  true,
  false
),
(
  '850e8400-e29b-41d4-a716-446655440005',
  '750e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440005', -- Maçonnerie
  '650e8400-e29b-41d4-a716-446655440005', -- Tangier
  'Maçonnerie Alaoui & Fils',
  'Entreprise familiale de maçonnerie générale. Construction, rénovation et extension de bâtiments.',
  22,
  50.00,
  ARRAY['Gros œuvre', 'Rénovation', 'Extensions'],
  ARRAY['Maître maçon', 'Certification sécurité chantier'],
  ARRAY['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop'],
  50,
  true,
  4.9,
  67,
  203,
  18,
  ARRAY['Français', 'Arabe', 'Espagnol'],
  true,
  true
),
(
  '850e8400-e29b-41d4-a716-446655440006',
  '750e8400-e29b-41d4-a716-446655440006',
  '550e8400-e29b-41d4-a716-446655440006', -- Carrelage
  '650e8400-e29b-41d4-a716-446655440006', -- Agadir
  'Carrelage Moderne Idrissi',
  'Spécialiste en pose de carrelage, faïence et revêtements modernes. Travail soigné et finitions parfaites.',
  8,
  25.00,
  ARRAY['Carrelage sol et mur', 'Faïence', 'Mosaïque'],
  ARRAY['Formation carreleur'],
  ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'],
  25,
  true,
  4.5,
  23,
  78,
  12,
  ARRAY['Français', 'Arabe', 'Berbère'],
  true,
  false
),
(
  '850e8400-e29b-41d4-a716-446655440007',
  '750e8400-e29b-41d4-a716-446655440007',
  '550e8400-e29b-41d4-a716-446655440007', -- Jardinage
  '650e8400-e29b-41d4-a716-446655440007', -- Meknès
  'Jardins Chakir',
  'Paysagiste et jardinier professionnel. Création et entretien d''espaces verts. Système d''arrosage automatique.',
  14,
  28.00,
  ARRAY['Aménagement paysager', 'Système arrosage', 'Entretien'],
  ARRAY['Formation paysagisme', 'Permis phytosanitaire'],
  ARRAY['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop'],
  35,
  true,
  4.8,
  41,
  134,
  24,
  ARRAY['Français', 'Arabe'],
  true,
  false
),
(
  '850e8400-e29b-41d4-a716-446655440008',
  '750e8400-e29b-41d4-a716-446655440008',
  '550e8400-e29b-41d4-a716-446655440008', -- Climatisation
  '650e8400-e29b-41d4-a716-446655440008', -- Oujda
  'Clim Confort Fassi',
  'Technicienne en climatisation et froid. Installation, maintenance et réparation de systèmes de climatisation.',
  7,
  38.00,
  ARRAY['Installation climatisation', 'Maintenance préventive', 'Réparation'],
  ARRAY['Certification frigoriste', 'Habilitation fluides frigorigènes'],
  ARRAY['https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop'],
  30,
  true,
  4.7,
  31,
  92,
  6,
  ARRAY['Français', 'Arabe'],
  true,
  true
),
(
  '850e8400-e29b-41d4-a716-446655440009',
  '750e8400-e29b-41d4-a716-446655440009',
  '550e8400-e29b-41d4-a716-446655440002', -- Électricité
  '650e8400-e29b-41d4-a716-446655440009', -- Kenitra
  'Électricité Tazi',
  'Électricien expérimenté en installation et rénovation électrique. Intervention rapide et devis gratuit.',
  11,
  42.00,
  ARRAY['Rénovation électrique', 'Mise aux normes', 'Éclairage'],
  ARRAY['Certification électricien'],
  ARRAY['https://images.unsplash.com/photo-1609010697446-11f2155278f0?w=400&h=300&fit=crop'],
  20,
  false,
  4.4,
  18,
  45,
  14,
  ARRAY['Français', 'Arabe'],
  true,
  false
),
(
  '850e8400-e29b-41d4-a716-446655440010',
  '750e8400-e29b-41d4-a716-446655440010',
  '550e8400-e29b-41d4-a716-446655440003', -- Menuiserie
  '650e8400-e29b-41d4-a716-446655440010', -- Tétouan
  'Menuiserie Berrada',
  'Menuiserie aluminium et PVC. Spécialisée dans les fenêtres, portes et vérandas sur mesure.',
  9,
  32.00,
  ARRAY['Menuiserie aluminium', 'Fenêtres PVC', 'Vérandas'],
  ARRAY['Formation menuiserie moderne'],
  ARRAY['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop'],
  25,
  true,
  4.6,
  25,
  73,
  20,
  ARRAY['Français', 'Arabe', 'Espagnol'],
  true,
  false
);

-- Re-add the foreign key constraint (optional - for production you might want this)
-- ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey 
--   FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update the updated_at timestamps
UPDATE public.categories SET updated_at = NOW();
UPDATE public.artisan_profiles SET updated_at = NOW();

-- Create some indexes for better performance
CREATE INDEX IF NOT EXISTS idx_artisan_profiles_category ON public.artisan_profiles(category_id);
CREATE INDEX IF NOT EXISTS idx_artisan_profiles_city ON public.artisan_profiles(city_id);
CREATE INDEX IF NOT EXISTS idx_artisan_profiles_rating ON public.artisan_profiles(rating_average DESC);
CREATE INDEX IF NOT EXISTS idx_artisan_profiles_verified ON public.artisan_profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_artisan_profiles_featured ON public.artisan_profiles(is_featured);
CREATE INDEX IF NOT EXISTS idx_artisan_profiles_active ON public.artisan_profiles(is_active);

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Public artisan profiles are viewable by everyone" ON public.artisan_profiles
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public categories are viewable by everyone" ON public.categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public cities are viewable by everyone" ON public.cities
  FOR SELECT USING (is_active = true);

-- Grant necessary permissions
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT SELECT ON public.artisan_profiles TO anon, authenticated;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.cities TO anon, authenticated;
