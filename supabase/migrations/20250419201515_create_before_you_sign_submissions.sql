CREATE TABLE IF NOT EXISTS before_you_sign_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    newsletter_consent BOOLEAN DEFAULT false,
    meta_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Set up RLS (Row Level Security)
ALTER TABLE before_you_sign_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable insert for all users" 
    ON before_you_sign_submissions FOR INSERT 
    TO authenticated, anon
    WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users only" 
    ON before_you_sign_submissions FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Enable delete for authenticated users only" 
    ON before_you_sign_submissions FOR DELETE 
    TO authenticated 
    USING (true);

-- Create an index on email for faster lookups
CREATE INDEX idx_before_you_sign_submissions_email ON before_you_sign_submissions(email);

-- Create an index on created_at for faster sorting
CREATE INDEX idx_before_you_sign_submissions_created_at ON before_you_sign_submissions(created_at); 