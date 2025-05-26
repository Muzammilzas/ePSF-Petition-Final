-- Drop existing policies
DROP POLICY IF EXISTS "enable_insert_for_everyone" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "enable_select_for_authenticated" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "enable_delete_for_authenticated" ON timeshare_checklist_submissions;

-- Ensure table exists with correct structure
CREATE TABLE IF NOT EXISTS timeshare_checklist_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    newsletter_consent BOOLEAN DEFAULT false,
    created_date VARCHAR(10) DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'America/New_York', 'MM/DD/YYYY'),
    created_time VARCHAR(12) DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'America/New_York', 'HH12:MI:SS AM'),
    meta_details JSONB DEFAULT '{}'::jsonb
);

-- Reset ownership and permissions
ALTER TABLE timeshare_checklist_submissions OWNER TO postgres;

-- Ensure RLS is enabled
ALTER TABLE timeshare_checklist_submissions ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant table permissions
GRANT ALL ON timeshare_checklist_submissions TO postgres;
GRANT INSERT ON timeshare_checklist_submissions TO anon;
GRANT ALL ON timeshare_checklist_submissions TO authenticated;

-- Create a simple policy for anonymous inserts
CREATE POLICY "enable_insert_for_anon" ON timeshare_checklist_submissions
    FOR INSERT TO anon
    WITH CHECK (true);

-- Create a policy for authenticated users
CREATE POLICY "enable_all_for_authenticated" ON timeshare_checklist_submissions
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated; 