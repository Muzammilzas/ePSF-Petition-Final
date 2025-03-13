-- Check if the is_admin function exists
SELECT EXISTS (
  SELECT 1 
  FROM pg_proc 
  WHERE proname = 'is_admin'
) AS is_admin_function_exists;

-- Recreate the is_admin function with proper permissions
CREATE OR REPLACE FUNCTION is_admin(uid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  admin_exists BOOLEAN;
BEGIN
  -- This function runs with the permissions of the creator
  SELECT EXISTS (
    SELECT 1 FROM admins WHERE user_id = uid
  ) INTO admin_exists;
  
  RETURN admin_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if the admins table exists
SELECT EXISTS (
  SELECT 1 
  FROM information_schema.tables 
  WHERE table_name = 'admins'
) AS admins_table_exists;

-- Create the admins table if it doesn't exist
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable RLS temporarily
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Check if the admin user exists
SELECT * FROM admins WHERE email = 'info@epublicsf.org';

-- Get the user ID from auth.users
SELECT id FROM auth.users WHERE email = 'info@epublicsf.org';

-- Insert the admin user if not exists
-- IMPORTANT: Replace 'paste-actual-uuid-here' with the UUID from the previous query
INSERT INTO admins (user_id, email)
VALUES 
  ('paste-actual-uuid-here', 'info@epublicsf.org')
ON CONFLICT (email) DO UPDATE 
SET user_id = EXCLUDED.user_id;

-- Verify the admin was added
SELECT * FROM admins;

-- Test the is_admin function with the admin user
-- IMPORTANT: Replace 'paste-actual-uuid-here' with the same UUID
SELECT is_admin('paste-actual-uuid-here') AS is_admin_result;

-- Enable RLS with permissive policies
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all access for now
DROP POLICY IF EXISTS admin_public_access ON admins;
CREATE POLICY admin_public_access ON admins
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create similar policies for petitions and signatures if needed
DROP POLICY IF EXISTS public_access_petitions ON petitions;
CREATE POLICY public_access_petitions ON petitions
  FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS public_access_signatures ON signatures;
CREATE POLICY public_access_signatures ON signatures
  FOR ALL
  USING (true)
  WITH CHECK (true); 