-- First, backup existing data if any exists
CREATE TABLE IF NOT EXISTS timeshare_checklist_submissions_backup AS 
SELECT * FROM timeshare_checklist_submissions;

-- Drop the existing table
DROP TABLE IF EXISTS timeshare_checklist_submissions;

-- Recreate the table with all necessary columns
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
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes
CREATE INDEX idx_timeshare_checklist_submissions_email ON timeshare_checklist_submissions(email);
CREATE INDEX idx_timeshare_checklist_submissions_created_at ON timeshare_checklist_submissions(created_at);
CREATE INDEX idx_timeshare_checklist_submissions_created_date ON timeshare_checklist_submissions(created_date);
CREATE INDEX idx_timeshare_checklist_submissions_created_time ON timeshare_checklist_submissions(created_time);

-- Enable RLS
ALTER TABLE timeshare_checklist_submissions ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "Enable insert for all users" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "Enable anonymous insert" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "Enable authenticated read" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "Enable authenticated delete" ON timeshare_checklist_submissions;

-- Create new policies with public access for inserts
CREATE POLICY "timeshare_submissions_insert_policy" ON timeshare_checklist_submissions
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "timeshare_submissions_select_policy" ON timeshare_checklist_submissions
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "timeshare_submissions_delete_policy" ON timeshare_checklist_submissions
    FOR DELETE TO authenticated
    USING (true);

-- Restore data if there was any
INSERT INTO timeshare_checklist_submissions 
SELECT * FROM timeshare_checklist_submissions_backup;

-- Drop the backup table
DROP TABLE IF EXISTS timeshare_checklist_submissions_backup; 