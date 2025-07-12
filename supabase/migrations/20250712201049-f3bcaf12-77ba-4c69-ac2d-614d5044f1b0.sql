-- Enable RLS on all tables that don't have it yet
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create security definer function for user role checking
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Categories policies (public read access)
CREATE POLICY "Anyone can view active categories" 
ON public.categories 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can manage categories" 
ON public.categories 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Cities policies (public read access)
CREATE POLICY "Anyone can view active cities" 
ON public.cities 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can manage cities" 
ON public.cities 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Artisan applications policies
CREATE POLICY "Users can view their own applications" 
ON public.artisan_applications 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own applications" 
ON public.artisan_applications 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own pending applications" 
ON public.artisan_applications 
FOR UPDATE 
USING (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can view all applications" 
ON public.artisan_applications 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update all applications" 
ON public.artisan_applications 
FOR UPDATE 
USING (public.get_current_user_role() = 'admin');

-- Contact messages policies
CREATE POLICY "Users can create contact messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own messages" 
ON public.contact_messages 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all messages" 
ON public.contact_messages 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update all messages" 
ON public.contact_messages 
FOR UPDATE 
USING (public.get_current_user_role() = 'admin');

-- Favorites policies
CREATE POLICY "Users can manage their own favorites" 
ON public.favorites 
FOR ALL 
USING (client_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view messages they sent or received" 
ON public.messages 
FOR SELECT 
USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Recipients can update read status" 
ON public.messages 
FOR UPDATE 
USING (recipient_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Proposals policies
CREATE POLICY "Artisans can create proposals" 
ON public.proposals 
FOR INSERT 
WITH CHECK (artisan_id = auth.uid());

CREATE POLICY "Artisans can view and update their own proposals" 
ON public.proposals 
FOR ALL 
USING (artisan_id = auth.uid());

CREATE POLICY "Project owners can view proposals for their projects" 
ON public.proposals 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = proposals.project_id 
    AND projects.client_id = auth.uid()
  )
);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create reviews for completed projects they participated in" 
ON public.reviews 
FOR INSERT 
WITH CHECK (
  reviewer_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = reviews.project_id 
    AND (projects.client_id = auth.uid() OR projects.artisan_id = auth.uid())
    AND projects.status = 'completed'
  )
);

CREATE POLICY "Reviewers can update their own reviews" 
ON public.reviews 
FOR UPDATE 
USING (reviewer_id = auth.uid());

-- Admin settings policies
CREATE POLICY "Only admins can manage settings" 
ON public.admin_settings 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Views tracking policies (for analytics)
CREATE POLICY "Anyone can create views" 
ON public.artisan_views 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can create project views" 
ON public.project_views 
FOR INSERT 
WITH CHECK (true);

-- Trigger to update profiles table when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, phone, cin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'cin'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();