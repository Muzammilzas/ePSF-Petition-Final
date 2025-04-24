-- Enable RLS
ALTER TABLE IF EXISTS public.admins ENABLE ROW LEVEL SECURITY;

-- Create admins table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create policy to allow authenticated users to read admins table
CREATE POLICY IF NOT EXISTS "Allow authenticated users to read admins" 
    ON public.admins
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Function to create admin user
CREATE OR REPLACE FUNCTION create_admin_user(email text, password text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Create user in auth.users
    INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, role)
    VALUES (email, crypt(password, gen_salt('bf')), NOW(), 'authenticated')
    RETURNING id INTO new_user_id;

    -- Add user to admins table
    INSERT INTO public.admins (user_id)
    VALUES (new_user_id);

    RETURN new_user_id;
END;
$$;

-- Create the admin user
SELECT create_admin_user('timeshare@epublicsf.org', 'your-secure-password-here');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.admins TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated; 