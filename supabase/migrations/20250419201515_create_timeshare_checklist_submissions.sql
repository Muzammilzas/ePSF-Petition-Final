CREATE TABLE IF NOT EXISTS timeshare_checklist_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    newsletter_consent BOOLEAN DEFAULT false,
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
            'latitude', null,
            'longitude', null,
            'ip_address', ''
        )
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Set up RLS (Row Level Security)
ALTER TABLE timeshare_checklist_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable insert for authenticated users only" 
    ON timeshare_checklist_submissions FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users only" 
    ON timeshare_checklist_submissions FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Enable delete for authenticated users only" 
    ON timeshare_checklist_submissions FOR DELETE 
    TO authenticated 
    USING (true);

-- Create an index on email for faster lookups
CREATE INDEX idx_timeshare_checklist_submissions_email ON timeshare_checklist_submissions(email);

-- Create an index on created_at for faster sorting
CREATE INDEX idx_timeshare_checklist_submissions_created_at ON timeshare_checklist_submissions(created_at); 