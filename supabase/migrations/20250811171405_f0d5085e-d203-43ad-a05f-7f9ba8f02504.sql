-- Allow artisans to view projects assigned to them
CREATE POLICY IF NOT EXISTS "Artisans can view assigned projects"
ON public.projects
FOR SELECT
USING (auth.uid() = artisan_id);
