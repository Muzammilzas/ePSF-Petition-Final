-- First, disable RLS temporarily to reset policies
ALTER TABLE timeshare_checklist_submissions DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "enable_insert_for_everyone" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "enable_select_for_authenticated" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "enable_delete_for_authenticated" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "enable_insert_for_anon" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "enable_all_for_authenticated" ON timeshare_checklist_submissions;

-- Re-enable RLS
ALTER TABLE timeshare_checklist_submissions ENABLE ROW LEVEL SECURITY;

-- Create a new, simpler policy for anonymous inserts
CREATE POLICY "enable_anon_insert" ON timeshare_checklist_submissions
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Create a policy for authenticated users to do everything
CREATE POLICY "enable_auth_all" ON timeshare_checklist_submissions
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Ensure proper permissions are set
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON timeshare_checklist_submissions TO anon;
GRANT ALL ON timeshare_checklist_submissions TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated; 