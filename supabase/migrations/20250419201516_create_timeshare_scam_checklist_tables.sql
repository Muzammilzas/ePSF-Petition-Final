-- Create the main timeshare scam checklist table
CREATE TABLE IF NOT EXISTS timeshare_scam_checklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    newsletter_consent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create the meta details table
CREATE TABLE IF NOT EXISTS timeshare_scam_checklist_meta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_id UUID NOT NULL REFERENCES timeshare_scam_checklist(id) ON DELETE CASCADE,
    meta_type TEXT NOT NULL, -- 'user_info', 'device', or 'location'
    meta_key TEXT NOT NULL,
    meta_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Set up RLS (Row Level Security)
ALTER TABLE timeshare_scam_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeshare_scam_checklist_meta ENABLE ROW LEVEL SECURITY;

-- Create policies for timeshare_scam_checklist
CREATE POLICY "Enable insert for authenticated users only" 
    ON timeshare_scam_checklist FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users only" 
    ON timeshare_scam_checklist FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Enable delete for authenticated users only" 
    ON timeshare_scam_checklist FOR DELETE 
    TO authenticated 
    USING (true);

-- Create policies for timeshare_scam_checklist_meta
CREATE POLICY "Enable insert for authenticated users only" 
    ON timeshare_scam_checklist_meta FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users only" 
    ON timeshare_scam_checklist_meta FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Enable delete for authenticated users only" 
    ON timeshare_scam_checklist_meta FOR DELETE 
    TO authenticated 
    USING (true);

-- Create indexes for better performance
CREATE INDEX idx_timeshare_scam_checklist_email ON timeshare_scam_checklist(email);
CREATE INDEX idx_timeshare_scam_checklist_created_at ON timeshare_scam_checklist(created_at);
CREATE INDEX idx_timeshare_scam_checklist_meta_checklist_id ON timeshare_scam_checklist_meta(checklist_id);
CREATE INDEX idx_timeshare_scam_checklist_meta_type_key ON timeshare_scam_checklist_meta(meta_type, meta_key); 