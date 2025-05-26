-- Drop existing table if it exists
DROP TABLE IF EXISTS spotting_exit_scams_submissions;

-- Create the table with correct structure
CREATE TABLE IF NOT EXISTS spotting_exit_scams_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    newsletter_consent BOOLEAN DEFAULT false,
    meta_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    created_date TEXT,
    created_time TEXT,
    synced_at TIMESTAMP WITH TIME ZONE
);

-- Set up RLS (Row Level Security)
ALTER TABLE spotting_exit_scams_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable insert for all users" 
    ON spotting_exit_scams_submissions FOR INSERT 
    TO authenticated, anon
    WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users only" 
    ON spotting_exit_scams_submissions FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Enable delete for authenticated users only" 
    ON spotting_exit_scams_submissions FOR DELETE 
    TO authenticated 
    USING (true);

-- Create an index on email for faster lookups
CREATE INDEX idx_spotting_exit_scams_submissions_email ON spotting_exit_scams_submissions(email);

-- Create an index on created_at for faster sorting
CREATE INDEX idx_spotting_exit_scams_submissions_created_at ON spotting_exit_scams_submissions(created_at);

-- Create indexes on created_date and created_time for faster sorting
CREATE INDEX idx_spotting_exit_scams_submissions_created_date ON spotting_exit_scams_submissions(created_date);
CREATE INDEX idx_spotting_exit_scams_submissions_created_time ON spotting_exit_scams_submissions(created_time);

-- Create index on synced_at for faster filtering
CREATE INDEX idx_spotting_exit_scams_submissions_synced_at ON spotting_exit_scams_submissions(synced_at); 