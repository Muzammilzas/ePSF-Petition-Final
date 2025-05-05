-- Drop all existing policies for the metadata table
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON scam_report_metadata;
DROP POLICY IF EXISTS "Enable insert access for all users" ON scam_report_metadata;
DROP POLICY IF EXISTS "Enable anonymous insert" ON scam_report_metadata;
DROP POLICY IF EXISTS "Enable anonymous read" ON scam_report_metadata;

-- Ensure RLS is enabled
ALTER TABLE scam_report_metadata ENABLE ROW LEVEL SECURITY;

-- Create new policies with consistent naming and proper permissions
CREATE POLICY "Enable anonymous insert" ON scam_report_metadata
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Enable anonymous read" ON scam_report_metadata
    FOR SELECT
    TO anon, authenticated
    USING (true); 