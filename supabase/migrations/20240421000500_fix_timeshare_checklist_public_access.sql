-- Drop all existing policies
DROP POLICY IF EXISTS "timeshare_submissions_insert_policy" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "timeshare_submissions_select_policy" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "timeshare_submissions_delete_policy" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "Enable insert for all users" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "Enable anonymous insert" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "Enable authenticated read" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "Enable authenticated delete" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "public_insert_policy" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "authenticated_select_policy" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "authenticated_delete_policy" ON timeshare_checklist_submissions;

-- Disable and re-enable RLS to ensure clean state
ALTER TABLE timeshare_checklist_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE timeshare_checklist_submissions ENABLE ROW LEVEL SECURITY;

-- Create a single policy for public inserts that allows both authenticated and anonymous users
CREATE POLICY "public_insert_policy" ON timeshare_checklist_submissions
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Create a policy for authenticated reads
CREATE POLICY "authenticated_select_policy" ON timeshare_checklist_submissions
    FOR SELECT
    TO authenticated
    USING (true);

-- Create a policy for authenticated deletes
CREATE POLICY "authenticated_delete_policy" ON timeshare_checklist_submissions
    FOR DELETE
    TO authenticated
    USING (true); 