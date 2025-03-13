-- Temporarily disable RLS if it exists
ALTER TABLE IF EXISTS admins DISABLE ROW LEVEL SECURITY;

-- Drop and recreate admins table to ensure correct structure
DROP TABLE IF EXISTS admins;
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert the admin with the exact UUID
INSERT INTO admins (user_id, email)
VALUES ('5aacfe84-4f0b-4aea-adbf-cc0f2aac0db5', 'testing@gmail.com');

-- Enable RLS and create necessary policies
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY admin_access_policy ON admins
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Verify the admin was added
SELECT * FROM admins WHERE email = 'testing@gmail.com'; 