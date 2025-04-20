CREATE TABLE IF NOT EXISTS where_scams_thrive_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    newsletter_consent BOOLEAN DEFAULT false,
    meta_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Set up RLS (Row Level Security)
ALTER TABLE where_scams_thrive_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable insert for authenticated users only" 
    ON where_scams_thrive_submissions FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users only" 
    ON where_scams_thrive_submissions FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Enable delete for authenticated users only" 
    ON where_scams_thrive_submissions FOR DELETE 
    TO authenticated 
    USING (true);

-- Create an index on email for faster lookups
CREATE INDEX idx_where_scams_thrive_submissions_email ON where_scams_thrive_submissions(email);

-- Create an index on created_at for faster sorting
CREATE INDEX idx_where_scams_thrive_submissions_created_at ON where_scams_thrive_submissions(created_at);
