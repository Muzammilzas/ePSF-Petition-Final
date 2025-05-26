-- Drop all existing policies
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "Enable insert for all users" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON timeshare_checklist_submissions;

-- Enable RLS
ALTER TABLE timeshare_checklist_submissions ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Enable anonymous insert" ON timeshare_checklist_submissions
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Enable authenticated read" ON timeshare_checklist_submissions
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable authenticated delete" ON timeshare_checklist_submissions
    FOR DELETE
    TO authenticated
    USING (true); 