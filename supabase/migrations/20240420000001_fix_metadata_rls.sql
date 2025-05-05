-- Enable RLS on metadata table if not already enabled
ALTER TABLE scam_report_metadata ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON scam_report_metadata;
DROP POLICY IF EXISTS "Enable insert access for all users" ON scam_report_metadata;

-- Create new policies
CREATE POLICY "Enable read access for authenticated users" ON scam_report_metadata
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for all users" ON scam_report_metadata
    FOR INSERT
    TO anon
    WITH CHECK (true); 