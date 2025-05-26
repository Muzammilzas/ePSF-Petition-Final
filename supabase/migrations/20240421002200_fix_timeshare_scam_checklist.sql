-- First, disable RLS temporarily to reset policies
ALTER TABLE IF EXISTS timeshare_scam_checklist DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON timeshare_scam_checklist;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON timeshare_scam_checklist;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON timeshare_scam_checklist;

-- Ensure table exists with correct structure
CREATE TABLE IF NOT EXISTS timeshare_scam_checklist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    newsletter_consent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    meta_details JSONB DEFAULT '{}'::jsonb
);

-- Reset ownership and permissions
ALTER TABLE timeshare_scam_checklist OWNER TO postgres;

-- Re-enable RLS
ALTER TABLE timeshare_scam_checklist ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant table permissions
GRANT ALL ON timeshare_scam_checklist TO postgres;
GRANT INSERT ON timeshare_scam_checklist TO anon;
GRANT ALL ON timeshare_scam_checklist TO authenticated;

-- Create a simple policy for anonymous inserts
CREATE POLICY "enable_anon_insert" ON timeshare_scam_checklist
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Create a policy for authenticated users to do everything
CREATE POLICY "enable_auth_all" ON timeshare_scam_checklist
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_timeshare_scam_checklist_email ON timeshare_scam_checklist(email);
CREATE INDEX IF NOT EXISTS idx_timeshare_scam_checklist_created_at ON timeshare_scam_checklist(created_at); 