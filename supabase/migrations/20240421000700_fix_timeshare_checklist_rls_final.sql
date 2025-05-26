-- First, disable RLS to ensure we can modify everything
ALTER TABLE timeshare_checklist_submissions DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DO $$ 
BEGIN
    EXECUTE (
        SELECT string_agg('DROP POLICY IF EXISTS ' || quote_ident(policyname) || ' ON timeshare_checklist_submissions;', E'\n')
        FROM pg_policies 
        WHERE tablename = 'timeshare_checklist_submissions'
    );
END $$;

-- Re-enable RLS
ALTER TABLE timeshare_checklist_submissions ENABLE ROW LEVEL SECURITY;

-- Create a single policy for anonymous inserts
CREATE POLICY "enable_anonymous_insert" ON timeshare_checklist_submissions
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Create a policy for authenticated reads
CREATE POLICY "enable_authenticated_read" ON timeshare_checklist_submissions
    FOR SELECT
    TO authenticated
    USING (true);

-- Create a policy for authenticated deletes
CREATE POLICY "enable_authenticated_delete" ON timeshare_checklist_submissions
    FOR DELETE
    TO authenticated
    USING (true);

-- Grant necessary permissions
GRANT INSERT ON timeshare_checklist_submissions TO anon;
GRANT ALL ON timeshare_checklist_submissions TO authenticated; 