-- First, drop all existing policies
DO $$ 
BEGIN
    -- Get all policy names for the table
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'timeshare_checklist_submissions'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON timeshare_checklist_submissions', pol.policyname);
    END LOOP;
END $$;

-- Disable and re-enable RLS
ALTER TABLE timeshare_checklist_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE timeshare_checklist_submissions ENABLE ROW LEVEL SECURITY;

-- Create a single, simple policy that allows all operations
CREATE POLICY "allow_all" ON timeshare_checklist_submissions
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true); 