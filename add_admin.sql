-- First, ensure the admins table exists with the correct structure
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Temporarily disable RLS to ensure we can add the admin
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Delete any existing entry for this email to avoid conflicts
DELETE FROM admins WHERE email = 'testing@gmail.com';

-- Insert the new admin
INSERT INTO admins (email)
VALUES ('testing@gmail.com');

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS admin_public_access ON admins;
DROP POLICY IF EXISTS "Allow public read access" ON admins;

-- Create a new policy that allows all operations for now
CREATE POLICY admin_public_access ON admins
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Verify the admin was added
SELECT * FROM admins WHERE email = 'testing@gmail.com'; 