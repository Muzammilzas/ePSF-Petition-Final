-- Create or replace the is_admin function
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM admins
        WHERE user_id = uid
    );
END;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION is_admin(uuid) TO authenticated, anon;

-- Create a trigger to maintain admin status
CREATE OR REPLACE FUNCTION update_admin_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Clear any existing policies
    DROP POLICY IF EXISTS admin_policy ON admins;
    
    -- Create a new policy that allows all operations for admins
    CREATE POLICY admin_policy ON admins
        FOR ALL
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
        
    RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS admin_status_trigger ON admins;
CREATE TRIGGER admin_status_trigger
    AFTER INSERT OR UPDATE OR DELETE ON admins
    FOR EACH STATEMENT
    EXECUTE FUNCTION update_admin_status();

-- Test the function with your admin user
SELECT is_admin('5aacfe84-4f0b-4aea-adbf-cc0f2aac0db5'::uuid) as is_admin;

-- Create the admins table if it doesn't exist
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable RLS temporarily
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Check if the admin already exists
SELECT * FROM admins WHERE email = 'info@epublicsf.org';

-- Get the user ID if the user is already in the auth system
SELECT id FROM auth.users WHERE email = 'info@epublicsf.org';

-- Insert the admin user with the ID from the previous query
-- Replace 'user-id-from-previous-query' with the actual ID
INSERT INTO admins (user_id, email)
VALUES 
  ('user-id-from-previous-query', 'info@epublicsf.org')
ON CONFLICT (email) DO NOTHING;

-- Verify the admin was added
SELECT * FROM admins;

-- Enable RLS with a bypass policy
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows public access for now
DROP POLICY IF EXISTS admin_public_access ON admins;
CREATE POLICY admin_public_access ON admins
  FOR ALL
  USING (true)
  WITH CHECK (true); 