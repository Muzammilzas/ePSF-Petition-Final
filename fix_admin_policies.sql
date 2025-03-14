-- First, let's check and fix the admins table
DO $$
BEGIN
    -- Disable RLS temporarily
    ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

    -- Drop existing policies
    DROP POLICY IF EXISTS admin_access_policy ON admins;
    DROP POLICY IF EXISTS admin_select_policy ON admins;
    DROP POLICY IF EXISTS admin_insert_policy ON admins;

    -- Verify and update the admin entry
    DELETE FROM admins WHERE email = 'testing@gmail.com';
    
    INSERT INTO admins (user_id, email)
    VALUES ('5aacfe84-4f0b-4aea-adbf-cc0f2aac0db5', 'testing@gmail.com');

    -- Enable RLS
    ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

    -- Create specific policies for different operations
    -- Allow anyone to check if an email exists in admins (needed for login)
    CREATE POLICY admin_select_policy ON admins
        FOR SELECT
        TO authenticated, anon
        USING (true);

    -- Allow full access to authenticated users who are admins
    CREATE POLICY admin_full_access ON admins
        FOR ALL
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);

END $$;

-- Verify the policies
SELECT * FROM pg_policies WHERE tablename = 'admins';

-- Verify the admin entry
SELECT 
    a.*,
    u.email as auth_email,
    u.id as auth_user_id
FROM admins a
LEFT JOIN auth.users u ON u.id = a.user_id
WHERE a.email = 'testing@gmail.com'; 