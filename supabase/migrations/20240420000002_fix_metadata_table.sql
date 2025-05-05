-- Create the metadata table if it doesn't exist
CREATE TABLE IF NOT EXISTS scam_report_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES scam_reports(id) ON DELETE CASCADE,
    browser TEXT,
    device_type TEXT,
    screen_resolution TEXT,
    user_agent TEXT,
    timezone TEXT,
    language TEXT,
    ip_address TEXT,
    city TEXT,
    region TEXT,
    country TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'America/New_York')
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_scam_report_metadata_report_id 
    ON scam_report_metadata(report_id);

-- Enable RLS
ALTER TABLE scam_report_metadata ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON scam_report_metadata;
DROP POLICY IF EXISTS "Enable insert access for all users" ON scam_report_metadata;
DROP POLICY IF EXISTS "Enable anonymous insert" ON scam_report_metadata;
DROP POLICY IF EXISTS "Enable anonymous read" ON scam_report_metadata;

-- Create new policies that match the other tables
CREATE POLICY "Enable read access for authenticated users" ON scam_report_metadata
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for all users" ON scam_report_metadata
    FOR INSERT
    TO anon
    WITH CHECK (true); 