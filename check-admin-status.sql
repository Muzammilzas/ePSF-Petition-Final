-- Check current users and their admin status
SELECT 
    u.id as user_id,
    u.email,
    u.role,
    u.email_confirmed_at,
    u.last_sign_in_at,
    CASE WHEN a.id IS NOT NULL THEN true ELSE false END as is_admin
FROM auth.users u
LEFT JOIN public.admins a ON u.id = a.user_id
WHERE u.email IN ('timeshare@epublicsf.org', 'testing@gmail.com');

-- Check RLS policies
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'admins';

-- Fix admin access
DO $$
DECLARE
    user_id uuid;
BEGIN
    -- First, ensure the admins table exists and has the right structure
    CREATE TABLE IF NOT EXISTS public.admins (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
        email TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
    );

    -- Enable RLS
    ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

    -- Drop and recreate policies
    DROP POLICY IF EXISTS "Allow authenticated users to read admins" ON public.admins;
    DROP POLICY IF EXISTS "Allow admin access" ON public.admins;
    
    -- Create more permissive policies
    CREATE POLICY "Allow admin access" ON public.admins
        USING (true)
        WITH CHECK (true);

    -- For each email, ensure they are in auth.users and admins table
    -- timeshare@epublicsf.org
    SELECT id INTO user_id FROM auth.users WHERE email = 'timeshare@epublicsf.org';
    IF user_id IS NULL THEN
        INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, role)
        VALUES ('timeshare@epublicsf.org', crypt('Admin123!@#', gen_salt('bf')), NOW(), 'authenticated')
        RETURNING id INTO user_id;
    END IF;
    
    INSERT INTO public.admins (user_id, email)
    VALUES (user_id, 'timeshare@epublicsf.org')
    ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email;

    -- testing@gmail.com
    SELECT id INTO user_id FROM auth.users WHERE email = 'testing@gmail.com';
    IF user_id IS NULL THEN
        INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, role)
        VALUES ('testing@gmail.com', crypt('Testing123!@#', gen_salt('bf')), NOW(), 'authenticated')
        RETURNING id INTO user_id;
    END IF;
    
    INSERT INTO public.admins (user_id, email)
    VALUES (user_id, 'testing@gmail.com')
    ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email;

END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.admins TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Verify final state
SELECT 
    u.id as user_id,
    u.email,
    u.role,
    u.email_confirmed_at,
    u.last_sign_in_at,
    a.id as admin_id,
    a.email as admin_email
FROM auth.users u
JOIN public.admins a ON u.id = a.user_id
WHERE u.email IN ('timeshare@epublicsf.org', 'testing@gmail.com'); 