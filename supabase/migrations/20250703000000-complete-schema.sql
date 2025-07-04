-- Complete Schema for RIB Artisans Connect
-- This migration creates all necessary tables and relationships for the artisan marketplace

-- Create categories table
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  emoji TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cities table for better location management
CREATE TABLE public.cities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  region TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create artisan profiles extension table
CREATE TABLE public.artisan_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id),
  city_id UUID REFERENCES public.cities(id),
  business_name TEXT,
  description TEXT,
  experience_years INTEGER DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  specialties TEXT[], -- Array of specialties
  certifications TEXT[], -- Array of certifications
  portfolio_images TEXT[], -- Array of image URLs
  availability_schedule JSONB, -- JSON object for weekly schedule
  service_radius INTEGER DEFAULT 20, -- Service radius in kilometers
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP WITH TIME ZONE,
  verification_documents TEXT[], -- Array of document URLs
  rating_average DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  total_projects INTEGER DEFAULT 0,
  response_time_hours INTEGER DEFAULT 24,
  languages TEXT[] DEFAULT ARRAY['Français', 'Arabe'],
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  artisan_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category_id UUID NOT NULL REFERENCES public.categories(id),
  city_id UUID REFERENCES public.cities(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  address TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  images TEXT[], -- Array of image URLs
  required_skills TEXT[], -- Array of required skills
  urgency TEXT CHECK (urgency IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  preferred_date DATE,
  flexible_timing BOOLEAN DEFAULT TRUE,
  status TEXT CHECK (status IN ('draft', 'published', 'assigned', 'in_progress', 'completed', 'cancelled')) DEFAULT 'draft',
  proposals_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create proposals table
CREATE TABLE public.proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  artisan_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  proposed_price DECIMAL(10,2) NOT NULL,
  estimated_duration TEXT, -- e.g., "2-3 days", "1 week"
  estimated_start_date DATE,
  additional_notes TEXT,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')) DEFAULT 'pending',
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, artisan_id)
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  work_quality_rating INTEGER CHECK (work_quality_rating >= 1 AND work_quality_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  timeliness_rating INTEGER CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
  would_recommend BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, reviewer_id, reviewee_id)
);

-- Create messages table for communication
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('text', 'image', 'document', 'system')) DEFAULT 'text',
  attachments TEXT[], -- Array of file URLs
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('proposal', 'project', 'review', 'message', 'system', 'promotion')) NOT NULL,
  related_id UUID, -- Can reference project_id, proposal_id, etc.
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorites table for clients to save artisans
CREATE TABLE public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  artisan_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_id, artisan_id)
);

-- Create project views table for analytics
CREATE TABLE public.project_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  viewer_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create artisan views table for analytics
CREATE TABLE public.artisan_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artisan_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  viewer_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact messages table
CREATE TABLE public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')) DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin settings table
CREATE TABLE public.admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO public.categories (name, description, icon, emoji) VALUES
('Maçonnerie', 'Construction, rénovation, murs', 'Building', '🧱'),
('Plomberie', 'Réparation, installation, dépannage', 'Wrench', '🔧'),
('Peinture', 'Intérieur, extérieur, décoration', 'Paintbrush', '🎨'),
('Électricité', 'Installation, réparation, dépannage', 'Zap', '⚡'),
('Menuiserie', 'Meubles, portes, fenêtres', 'Hammer', '🪚'),
('Carrelage', 'Pose, rénovation, zellige', 'Square', '⬜'),
('Couture', 'Vêtements, réparation, sur-mesure', 'Scissors', '✂️'),
('Ferronnerie', 'Portails, grilles, soudure', 'Wrench', '🔨'),
('Jardinage', 'Entretien, aménagement paysager', 'Leaf', '🌱'),
('Nettoyage', 'Ménage, nettoyage professionnel', 'Sparkles', '✨');

-- Insert major Moroccan cities
INSERT INTO public.cities (name, region) VALUES
('Casablanca', 'Casablanca-Settat'),
('Rabat', 'Rabat-Salé-Kénitra'),
('Fès', 'Fès-Meknès'),
('Marrakech', 'Marrakech-Safi'),
('Agadir', 'Souss-Massa'),
('Tanger', 'Tanger-Tétouan-Al Hoceïma'),
('Meknès', 'Fès-Meknès'),
('Oujda', 'Oriental'),
('Kénitra', 'Rabat-Salé-Kénitra'),
('Tétouan', 'Tanger-Tétouan-Al Hoceïma'),
('Safi', 'Marrakech-Safi'),
('Mohammedia', 'Casablanca-Settat'),
('El Jadida', 'Casablanca-Settat'),
('Béni Mellal', 'Béni Mellal-Khénifra'),
('Nador', 'Oriental');

-- Enable Row Level Security on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "Categories are viewable by everyone" 
  ON public.categories 
  FOR SELECT 
  USING (true);

-- RLS Policies for cities (public read)
CREATE POLICY "Cities are viewable by everyone" 
  ON public.cities 
  FOR SELECT 
  USING (true);

-- RLS Policies for artisan_profiles
CREATE POLICY "Artisan profiles are viewable by everyone" 
  ON public.artisan_profiles 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Artisans can manage their own profile" 
  ON public.artisan_profiles 
  FOR ALL 
  USING (auth.uid() = user_id);

-- RLS Policies for projects
CREATE POLICY "Published projects are viewable by everyone" 
  ON public.projects 
  FOR SELECT 
  USING (status IN ('published', 'assigned', 'in_progress', 'completed'));

CREATE POLICY "Clients can manage their own projects" 
  ON public.projects 
  FOR ALL 
  USING (auth.uid() = client_id);

CREATE POLICY "Assigned artisans can view their projects" 
  ON public.projects 
  FOR SELECT 
  USING (auth.uid() = artisan_id);

-- RLS Policies for proposals
CREATE POLICY "Proposals are viewable by project owner and proposal author" 
  ON public.proposals 
  FOR SELECT 
  USING (
    auth.uid() = artisan_id OR 
    auth.uid() = (SELECT client_id FROM public.projects WHERE id = project_id)
  );

CREATE POLICY "Artisans can create proposals" 
  ON public.proposals 
  FOR INSERT 
  WITH CHECK (auth.uid() = artisan_id);

CREATE POLICY "Artisans can update their own proposals" 
  ON public.proposals 
  FOR UPDATE 
  USING (auth.uid() = artisan_id);

-- RLS Policies for reviews
CREATE POLICY "Reviews are viewable by everyone" 
  ON public.reviews 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create reviews for their projects" 
  ON public.reviews 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_id 
      AND (client_id = auth.uid() OR artisan_id = auth.uid())
      AND status = 'completed'
    )
  );

-- RLS Policies for messages
CREATE POLICY "Users can view their own messages" 
  ON public.messages 
  FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update read status of their received messages" 
  ON public.messages 
  FOR UPDATE 
  USING (auth.uid() = recipient_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for favorites
CREATE POLICY "Users can manage their own favorites" 
  ON public.favorites 
  FOR ALL 
  USING (auth.uid() = client_id);

-- RLS Policies for views (analytics)
CREATE POLICY "Users can view analytics for their own content" 
  ON public.project_views 
  FOR SELECT 
  USING (
    auth.uid() = viewer_id OR
    auth.uid() = (SELECT client_id FROM public.projects WHERE id = project_id)
  );

CREATE POLICY "Anyone can create project views" 
  ON public.project_views 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view analytics for their own profile" 
  ON public.artisan_views 
  FOR SELECT 
  USING (auth.uid() = viewer_id OR auth.uid() = artisan_id);

CREATE POLICY "Anyone can create artisan views" 
  ON public.artisan_views 
  FOR INSERT 
  WITH CHECK (true);

-- RLS Policies for contact messages
CREATE POLICY "Users can view their own contact messages" 
  ON public.contact_messages 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create contact messages" 
  ON public.contact_messages 
  FOR INSERT 
  WITH CHECK (true);

-- RLS Policies for admin settings (admin only)
CREATE POLICY "Admin settings are viewable by admins only" 
  ON public.admin_settings 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_artisan_profiles_user_id ON public.artisan_profiles(user_id);
CREATE INDEX idx_artisan_profiles_category_id ON public.artisan_profiles(category_id);
CREATE INDEX idx_artisan_profiles_city_id ON public.artisan_profiles(city_id);
CREATE INDEX idx_artisan_profiles_rating ON public.artisan_profiles(rating_average DESC);
CREATE INDEX idx_artisan_profiles_featured ON public.artisan_profiles(is_featured, created_at DESC);

CREATE INDEX idx_projects_client_id ON public.projects(client_id);
CREATE INDEX idx_projects_artisan_id ON public.projects(artisan_id);
CREATE INDEX idx_projects_category_id ON public.projects(category_id);
CREATE INDEX idx_projects_city_id ON public.projects(city_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);

CREATE INDEX idx_proposals_project_id ON public.proposals(project_id);
CREATE INDEX idx_proposals_artisan_id ON public.proposals(artisan_id);
CREATE INDEX idx_proposals_status ON public.proposals(status);

CREATE INDEX idx_reviews_reviewee_id ON public.reviews(reviewee_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_reviews_created_at ON public.reviews(created_at DESC);

CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_artisan_profiles_updated_at BEFORE UPDATE ON public.artisan_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON public.proposals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON public.admin_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update artisan rating when a new review is added
CREATE OR REPLACE FUNCTION public.update_artisan_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.artisan_profiles 
  SET 
    rating_average = (
      SELECT AVG(rating)::DECIMAL(3,2) 
      FROM public.reviews 
      WHERE reviewee_id = NEW.reviewee_id
    ),
    rating_count = (
      SELECT COUNT(*) 
      FROM public.reviews 
      WHERE reviewee_id = NEW.reviewee_id
    )
  WHERE user_id = NEW.reviewee_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update artisan rating
CREATE TRIGGER update_artisan_rating_trigger 
  AFTER INSERT ON public.reviews 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_artisan_rating();

-- Function to update project proposal count
CREATE OR REPLACE FUNCTION public.update_project_proposals_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.projects 
  SET proposals_count = (
    SELECT COUNT(*) 
    FROM public.proposals 
    WHERE project_id = NEW.project_id
  )
  WHERE id = NEW.project_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update proposal count
CREATE TRIGGER update_project_proposals_count_trigger 
  AFTER INSERT ON public.proposals 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_project_proposals_count();

-- Function to create notification when a new proposal is made
CREATE OR REPLACE FUNCTION public.create_proposal_notification()
RETURNS TRIGGER AS $$
DECLARE
  project_title TEXT;
  artisan_name TEXT;
BEGIN
  -- Get project title
  SELECT title INTO project_title FROM public.projects WHERE id = NEW.project_id;
  
  -- Get artisan name
  SELECT name INTO artisan_name FROM public.profiles WHERE id = NEW.artisan_id;
  
  -- Create notification for project owner
  INSERT INTO public.notifications (user_id, title, message, type, related_id)
  SELECT 
    client_id,
    'Nouvelle proposition reçue',
    artisan_name || ' a envoyé une proposition pour "' || project_title || '"',
    'proposal',
    NEW.id
  FROM public.projects 
  WHERE id = NEW.project_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create proposal notification
CREATE TRIGGER create_proposal_notification_trigger 
  AFTER INSERT ON public.proposals 
  FOR EACH ROW 
  EXECUTE FUNCTION public.create_proposal_notification();

-- Insert default admin settings
INSERT INTO public.admin_settings (key, value, description) VALUES
('commission_rate', '{"rate": 0.05, "description": "Platform commission rate (5%)"}', 'Commission rate charged to artisans'),
('featured_listing_price', '{"monthly": 199, "quarterly": 499, "yearly": 1599}', 'Pricing for featured listings in MAD'),
('verification_required', '{"artisans": true, "documents": ["cin", "business_license"]}', 'Verification requirements'),
('max_proposals_per_project', '{"limit": 20}', 'Maximum number of proposals per project'),
('project_expiry_days', '{"default": 30}', 'Default project expiry in days'),
('maintenance_mode', '{"enabled": false, "message": ""}', 'Maintenance mode settings');
