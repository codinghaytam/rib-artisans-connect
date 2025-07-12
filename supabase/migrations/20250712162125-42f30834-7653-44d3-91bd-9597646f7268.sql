-- Create artisan applications table to manage subscription requests
CREATE TABLE public.artisan_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  business_name TEXT,
  category_id UUID REFERENCES public.categories(id),
  city_id UUID REFERENCES public.cities(id),
  description TEXT,
  experience_years INTEGER,
  specialties TEXT[],
  status TEXT NOT NULL DEFAULT 'not_read' CHECK (status IN ('not_read', 'in_progress', 'validated', 'rejected')),
  admin_notes TEXT,
  payment_receipt_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.artisan_applications ENABLE ROW LEVEL SECURITY;

-- Allow applicants to create their own applications
CREATE POLICY "Users can create their own applications"
ON public.artisan_applications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow applicants to view their own applications
CREATE POLICY "Users can view their own applications"
ON public.artisan_applications
FOR SELECT
USING (auth.uid() = user_id);

-- Allow applicants to update their own applications (for payment receipt)
CREATE POLICY "Users can update their own applications"
ON public.artisan_applications
FOR UPDATE
USING (auth.uid() = user_id);

-- Allow admins to view all applications
CREATE POLICY "Admins can view all applications"
ON public.artisan_applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow admins to update all applications
CREATE POLICY "Admins can update all applications"
ON public.artisan_applications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_artisan_applications_updated_at
  BEFORE UPDATE ON public.artisan_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create notification trigger for new applications
CREATE OR REPLACE FUNCTION public.create_application_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create notification for admins
  INSERT INTO public.notifications (user_id, title, message, type, related_id)
  SELECT 
    p.id,
    'Nouvelle demande d''artisan',
    'Une nouvelle demande d''inscription d''artisan a été soumise par ' || NEW.name,
    'application',
    NEW.id
  FROM public.profiles p
  WHERE p.role = 'admin';
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_application_created
  AFTER INSERT ON public.artisan_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.create_application_notification();