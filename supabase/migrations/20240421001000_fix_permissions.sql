-- First, ensure the table exists and has the right structure
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

-- Disable RLS temporarily
ALTER TABLE timeshare_checklist_submissions DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname 
               FROM pg_policies 
               WHERE tablename = 'timeshare_checklist_submissions'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON timeshare_checklist_submissions', pol.policyname);
    END LOOP;
END $$;

-- Reset all permissions
REVOKE ALL ON timeshare_checklist_submissions FROM PUBLIC;
REVOKE ALL ON timeshare_checklist_submissions FROM anon;
REVOKE ALL ON timeshare_checklist_submissions FROM authenticated;

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant table permissions
GRANT ALL ON timeshare_checklist_submissions TO postgres;
GRANT ALL ON timeshare_checklist_submissions TO authenticated;
GRANT INSERT, SELECT ON timeshare_checklist_submissions TO anon;

-- Re-enable RLS
ALTER TABLE timeshare_checklist_submissions ENABLE ROW LEVEL SECURITY;

-- Create a simple policy for anonymous inserts
CREATE POLICY "enable_insert_for_everyone" ON timeshare_checklist_submissions
    FOR INSERT TO PUBLIC
    WITH CHECK (true);

-- Create a policy for authenticated users to read and delete
CREATE POLICY "enable_select_for_authenticated" ON timeshare_checklist_submissions
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "enable_delete_for_authenticated" ON timeshare_checklist_submissions
    FOR DELETE TO authenticated
    USING (true);

-- Grant sequence permissions if they exist
DO $$
BEGIN
    EXECUTE format(
        'GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon'
    );
    EXECUTE format(
        'GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated'
    );
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$; 