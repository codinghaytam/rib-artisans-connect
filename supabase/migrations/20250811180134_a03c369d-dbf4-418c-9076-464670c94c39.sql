-- Allow direct artisan reviews by making project_id optional
ALTER TABLE reviews ALTER COLUMN project_id DROP NOT NULL;

-- Update RLS policy to allow reviews without projects
DROP POLICY IF EXISTS "Users can create reviews for completed projects they participat" ON reviews;

CREATE POLICY "Users can create reviews for artisans or completed projects" 
ON reviews 
FOR INSERT 
WITH CHECK (
  reviewer_id = auth.uid() AND 
  (
    -- Direct artisan review (no project required)
    project_id IS NULL OR
    -- Project-based review (existing logic)
    (
      project_id IS NOT NULL AND
      EXISTS (
        SELECT 1
        FROM projects
        WHERE projects.id = reviews.project_id 
        AND (projects.client_id = auth.uid() OR projects.artisan_id = auth.uid()) 
        AND projects.status = 'completed'
      )
    )
  )
);

-- Add index for better performance on reviewee_id queries
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);

-- Add index for better performance on project_id queries (nullable)
CREATE INDEX IF NOT EXISTS idx_reviews_project_id ON reviews(project_id) WHERE project_id IS NOT NULL;