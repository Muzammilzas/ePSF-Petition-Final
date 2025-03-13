-- First, make sure the admins table exists
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- This is a special case for the first admin
-- We need to bypass the RLS policies since no admin exists yet
-- Insert the admin directly
INSERT INTO admins (user_id, email)
VALUES 
  -- Replace the UUID below with the actual UUID from Supabase Authentication
  ('REPLACE_WITH_ACTUAL_UUID', 'admin@example.com')
ON CONFLICT (email) DO NOTHING;

-- Verify the admin was added
SELECT * FROM admins WHERE email = 'admin@example.com'; 