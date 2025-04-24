-- First, let's fix the RLS policies for the admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN SELECT policyname 
               FROM pg_policies 
               WHERE schemaname = 'public' 
               AND tablename = 'admins'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.admins', pol.policyname);
    END LOOP;
END $$;

-- Create new policies
CREATE POLICY "enable_read_for_authenticated" ON public.admins
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "enable_insert_for_authenticated" ON public.admins
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "enable_update_for_self" ON public.admins
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Ensure proper indexes
CREATE INDEX IF NOT EXISTS admins_user_id_idx ON public.admins(user_id);
CREATE INDEX IF NOT EXISTS admins_email_idx ON public.admins(email);

-- Function to ensure admin user exists
CREATE OR REPLACE FUNCTION ensure_admin_user(admin_email text, admin_password text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id uuid;
BEGIN
    -- Check if user exists in auth.users
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = admin_email;
    
    IF v_user_id IS NULL THEN
        -- Create user if doesn't exist
        INSERT INTO auth.users (
            email,
            encrypted_password,
            email_confirmed_at,
            role,
            raw_app_meta_data,
            raw_user_meta_data
        )
        VALUES (
            admin_email,
            crypt(admin_password, gen_salt('bf')),
            NOW(),
            'authenticated',
            '{"provider":"email","providers":["email"]}',
            '{}'
        )
        RETURNING id INTO v_user_id;
    END IF;

    -- Ensure user is in admins table
    INSERT INTO public.admins (user_id, email)
    VALUES (v_user_id, admin_email)
    ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email;
END;
$$;

-- Reset and create admin users
SELECT ensure_admin_user('timeshare@epublicsf.org', 'Admin123!@#');
SELECT ensure_admin_user('testing@gmail.com', 'Testing123!@#');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.admins TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Verify admin users
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

-- Add additional admin-related policies for other tables
DO $$
BEGIN
    -- Drop existing policies first
    DROP POLICY IF EXISTS "admin_read_petitions" ON public.petitions;
    DROP POLICY IF EXISTS "admin_write_petitions" ON public.petitions;
    DROP POLICY IF EXISTS "admin_read_signatures" ON public.signatures;
    DROP POLICY IF EXISTS "admin_write_signatures" ON public.signatures;

    -- Petitions table policies
    CREATE POLICY "admin_read_petitions" ON public.petitions
        FOR SELECT
        TO authenticated
        USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

    CREATE POLICY "admin_write_petitions" ON public.petitions
        FOR ALL
        TO authenticated
        USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()))
        WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

    -- Signatures table policies
    CREATE POLICY "admin_read_signatures" ON public.signatures
        FOR SELECT
        TO authenticated
        USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

    CREATE POLICY "admin_write_signatures" ON public.signatures
        FOR ALL
        TO authenticated
        USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()))
        WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));
END $$; 