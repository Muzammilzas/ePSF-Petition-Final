-- Disable RLS temporarily
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS admin_public_access ON admins;
DROP POLICY IF EXISTS "Allow public read access" ON admins;
DROP POLICY IF EXISTS admin_select_policy ON admins;
DROP POLICY IF EXISTS admin_full_access ON admins;

-- Recreate the admins table with correct structure
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clear existing data and insert the admin
DELETE FROM admins WHERE email = 'testing@gmail.com';
INSERT INTO admins (user_id, email)
VALUES ('5aacfe84-4f0b-4aea-adbf-cc0f2aac0db5', 'testing@gmail.com');

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY admin_select_policy ON admins
    FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY admin_modify_policy ON admins
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Verify the admin was added and policies are in place
SELECT * FROM admins WHERE email = 'testing@gmail.com';
SELECT * FROM pg_policies WHERE tablename = 'admins'; 