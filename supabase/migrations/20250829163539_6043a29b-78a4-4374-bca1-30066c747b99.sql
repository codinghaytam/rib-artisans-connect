-- Create admin profile with correct role constraint
INSERT INTO public.profiles (
    id,
    email,
    name,
    role,
    is_active,
    created_at,
    updated_at
) 
SELECT 
    gen_random_uuid(),
    'admin@example.com',
    'Admin Demo',
    'admin',
    true,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE email = 'admin@example.com'
);