-- Create admin demo account manually
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- First check if admin already exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@example.com') THEN
        -- Insert admin user in auth.users (manually setting UUID and confirmed status)
        admin_user_id := gen_random_uuid();
        
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            confirmation_sent_at,
            confirmation_token,
            recovery_sent_at,
            recovery_token,
            email_change_sent_at,
            email_change,
            email_change_token_new,
            email_change_token_current,
            phone_confirmed_at,
            phone_change_sent_at,
            phone_change_token,
            phone_change,
            confirmed_at,
            email_change_confirm_status,
            banned_until,
            invited_at,
            deleted_at,
            created_at,
            updated_at,
            phone,
            phone_change_token_new,
            phone_change_token_current,
            email_change_token_current_candidate,
            email_change_token_new_candidate,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            last_sign_in_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            admin_user_id,
            'authenticated',
            'authenticated',
            'admin@example.com',
            crypt('9Rib!Demo123', gen_salt('bf')),
            NOW(),
            NOW(),
            '',
            NULL,
            '',
            NULL,
            '',
            '',
            '',
            NULL,
            NULL,
            '',
            '',
            NOW(),
            0,
            NULL,
            NULL,
            NULL,
            NOW(),
            NOW(),
            NULL,
            '',
            '',
            '',
            '',
            '{"provider": "email", "providers": ["email"]}',
            '{"name": "Admin Demo", "role": "admin"}',
            false,
            NULL
        );
        
        -- Insert corresponding profile
        INSERT INTO public.profiles (
            id,
            email,
            name,
            role,
            is_active,
            created_at,
            updated_at
        ) VALUES (
            admin_user_id,
            'admin@example.com',
            'Admin Demo',
            'admin',
            true,
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Admin demo account created successfully';
    ELSE
        RAISE NOTICE 'Admin demo account already exists';
    END IF;
END $$;