-- Create function to ensure an artisan profile exists for artisan users
CREATE OR REPLACE FUNCTION public.ensure_artisan_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'artisan' THEN
    INSERT INTO public.artisan_profiles (user_id, is_active)
    SELECT NEW.id, true
    WHERE NOT EXISTS (
      SELECT 1 FROM public.artisan_profiles ap WHERE ap.user_id = NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger after insert on profiles
DROP TRIGGER IF EXISTS trg_profiles_after_insert_ensure_artisan ON public.profiles;
CREATE TRIGGER trg_profiles_after_insert_ensure_artisan
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.ensure_artisan_profile();

-- Create trigger after role updates on profiles
DROP TRIGGER IF EXISTS trg_profiles_after_update_ensure_artisan ON public.profiles;
CREATE TRIGGER trg_profiles_after_update_ensure_artisan
AFTER UPDATE OF role ON public.profiles
FOR EACH ROW
WHEN (NEW.role = 'artisan' AND (OLD.role IS DISTINCT FROM NEW.role))
EXECUTE FUNCTION public.ensure_artisan_profile();

-- Ensure one artisan profile per user
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'artisan_profiles_user_id_unique'
  ) THEN
    ALTER TABLE public.artisan_profiles
    ADD CONSTRAINT artisan_profiles_user_id_unique UNIQUE (user_id);
  END IF;
END $$;

-- Backfill: create artisan profiles for existing artisan users without one
INSERT INTO public.artisan_profiles (user_id, is_active)
SELECT p.id, true
FROM public.profiles p
LEFT JOIN public.artisan_profiles ap ON ap.user_id = p.id
WHERE p.role = 'artisan' AND ap.user_id IS NULL;
