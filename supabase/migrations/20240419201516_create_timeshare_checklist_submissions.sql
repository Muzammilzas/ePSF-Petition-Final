-- Create the timeshare checklist submissions table
CREATE TABLE IF NOT EXISTS timeshare_checklist_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    newsletter_consent BOOLEAN DEFAULT false,
    meta_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    created_date TEXT,
    created_time TEXT
);

-- Set up RLS (Row Level Security)
ALTER TABLE timeshare_checklist_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable insert for all users" 
    ON timeshare_checklist_submissions FOR INSERT 
    TO authenticated, anon
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
CREATE INDEX idx_timeshare_checklist_submissions_email 
    ON timeshare_checklist_submissions(email);

-- Create an index on created_at for faster sorting
CREATE INDEX idx_timeshare_checklist_submissions_created_at 
    ON timeshare_checklist_submissions(created_at);

-- Create indexes on created_date and created_time for faster sorting
CREATE INDEX idx_timeshare_checklist_submissions_created_date 
    ON timeshare_checklist_submissions(created_date);
CREATE INDEX idx_timeshare_checklist_submissions_created_time 
    ON timeshare_checklist_submissions(created_time);

-- Add trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_timeshare_checklist_submissions_updated_at
    BEFORE UPDATE ON timeshare_checklist_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 