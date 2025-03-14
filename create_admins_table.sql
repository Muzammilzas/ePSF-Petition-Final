-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS (Row Level Security) policies
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admins to view all admins
CREATE POLICY admin_read_policy ON admins
  FOR SELECT
  USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );

-- Create policy to allow admins to insert new admins
CREATE POLICY admin_insert_policy ON admins
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admins)
  );

-- Create policy to allow admins to update admins
CREATE POLICY admin_update_policy ON admins
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );

-- Create policy to allow admins to delete admins
CREATE POLICY admin_delete_policy ON admins
  FOR DELETE
  USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );

-- Add RLS policies to petitions and signatures tables to allow admins full access

-- Petitions table policies
CREATE POLICY admin_read_petitions ON petitions
  FOR SELECT
  USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );

CREATE POLICY admin_insert_petitions ON petitions
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admins)
  );

CREATE POLICY admin_update_petitions ON petitions
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );

CREATE POLICY admin_delete_petitions ON petitions
  FOR DELETE
  USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );

-- Signatures table policies
CREATE POLICY admin_read_signatures ON signatures
  FOR SELECT
  USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );

CREATE POLICY admin_insert_signatures ON signatures
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admins)
  );

CREATE POLICY admin_update_signatures ON signatures
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );

CREATE POLICY admin_delete_signatures ON signatures
  FOR DELETE
  USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );

-- Create a function to add the first admin
CREATE OR REPLACE FUNCTION add_first_admin(admin_email TEXT, admin_user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO admins (user_id, email)
  VALUES (admin_user_id, admin_email);
END;
$$ LANGUAGE plpgsql; 