-- First, backup existing data
CREATE TABLE IF NOT EXISTS timeshare_checklist_submissions_backup AS 
SELECT * FROM timeshare_checklist_submissions;

-- Drop the existing table
DROP TABLE IF EXISTS timeshare_checklist_submissions;

-- Create the table with all necessary columns
CREATE TABLE timeshare_checklist_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    newsletter_consent BOOLEAN DEFAULT false,
    created_date VARCHAR(10) DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'America/New_York', 'MM/DD/YYYY'),
    created_time VARCHAR(12) DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'America/New_York', 'HH12:MI:SS AM'),
    meta_details JSONB DEFAULT jsonb_build_object(
        'user_info', jsonb_build_object(
            'name', '',
            'email', '',
            'download_time', '',
            'newsletter_consent', false
        ),
        'device', jsonb_build_object(
            'browser', '',
            'device_type', '',
            'screen_resolution', '',
            'user_agent', '',
            'timezone', '',
            'language', ''
        ),
        'location', jsonb_build_object(
            'city', '',
            'region', '',
            'country', '',
            'ip_address', ''
        )
    )
);

-- Create indexes
CREATE INDEX idx_timeshare_checklist_submissions_email ON timeshare_checklist_submissions(email);
CREATE INDEX idx_timeshare_checklist_submissions_created_date ON timeshare_checklist_submissions(created_date);
CREATE INDEX idx_timeshare_checklist_submissions_created_time ON timeshare_checklist_submissions(created_time);

-- Enable RLS
ALTER TABLE timeshare_checklist_submissions ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY "enable_insert_for_all" ON timeshare_checklist_submissions
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "enable_select_for_auth" ON timeshare_checklist_submissions
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "enable_delete_for_auth" ON timeshare_checklist_submissions
    FOR DELETE TO authenticated
    USING (true);

-- Grant basic permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON timeshare_checklist_submissions TO authenticated;
GRANT INSERT ON timeshare_checklist_submissions TO anon;

-- Restore data if backup exists
INSERT INTO timeshare_checklist_submissions 
SELECT * FROM timeshare_checklist_submissions_backup;

-- Clean up backup
DROP TABLE IF EXISTS timeshare_checklist_submissions_backup; 