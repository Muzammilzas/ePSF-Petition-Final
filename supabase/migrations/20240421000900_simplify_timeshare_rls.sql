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

-- Re-enable RLS
ALTER TABLE timeshare_checklist_submissions ENABLE ROW LEVEL SECURITY;

-- Create a single, simple policy for inserts
CREATE POLICY "allow_anonymous_inserts" ON timeshare_checklist_submissions
    FOR INSERT
    WITH CHECK (true);

-- Ensure proper permissions
REVOKE ALL ON timeshare_checklist_submissions FROM anon, authenticated;
GRANT INSERT ON timeshare_checklist_submissions TO anon;
GRANT ALL ON timeshare_checklist_submissions TO authenticated; 