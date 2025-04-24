-- Enable RLS
ALTER TABLE IF EXISTS public.admins ENABLE ROW LEVEL SECURITY;

-- Add email column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'admins' 
        AND column_name = 'email'
    ) THEN
        ALTER TABLE public.admins ADD COLUMN email TEXT;
    END IF;
END $$;

-- Update existing records with email from auth.users
UPDATE public.admins a
SET email = u.email
FROM auth.users u
WHERE a.user_id = u.id
AND a.email IS NULL;

-- Make email column NOT NULL after updating existing records
ALTER TABLE public.admins ALTER COLUMN email SET NOT NULL;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow authenticated users to read admins" ON public.admins;

-- Create policy
CREATE POLICY "Allow authenticated users to read admins" 
    ON public.admins
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Function to create admin user if not exists
CREATE OR REPLACE FUNCTION create_admin_user_if_not_exists(email text, password text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    existing_user_id uuid;
    new_user_id uuid;
BEGIN
    -- Check if user already exists
    SELECT id INTO existing_user_id
    FROM auth.users
    WHERE auth.users.email = create_admin_user_if_not_exists.email;
    
    IF existing_user_id IS NOT NULL THEN
        -- User exists, make sure they're in admins table
        INSERT INTO public.admins (user_id, email)
        VALUES (existing_user_id, create_admin_user_if_not_exists.email)
        ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email;
        
        RETURN existing_user_id;
    ELSE
        -- Create new user
        INSERT INTO auth.users (
            email,
            encrypted_password,
            email_confirmed_at,
            role,
            raw_app_meta_data,
            raw_user_meta_data
        )
        VALUES (
            email,
            crypt(password, gen_salt('bf')),
            NOW(),
            'authenticated',
            '{"provider":"email","providers":["email"]}',
            '{}'
        )
        RETURNING id INTO new_user_id;

        -- Add to admins table
        INSERT INTO public.admins (user_id, email)
        VALUES (new_user_id, email);

        RETURN new_user_id;
    END IF;
END;
$$;

-- Create or update admin users
SELECT create_admin_user_if_not_exists('timeshare@epublicsf.org', 'Admin123!@#');
SELECT create_admin_user_if_not_exists('testing@gmail.com', 'Testing123!@#');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.admins TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Verify admin users
SELECT 
    u.email,
    u.id as user_id,
    a.id as admin_id,
    a.email as admin_email,
    u.created_at,
    u.last_sign_in_at
FROM auth.users u
JOIN public.admins a ON u.id = a.user_id
WHERE u.email IN ('timeshare@epublicsf.org', 'testing@gmail.com'); 