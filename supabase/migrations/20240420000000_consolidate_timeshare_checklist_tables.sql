-- First, create a temporary table to store the consolidated data
CREATE TABLE temp_timeshare_checklist AS
SELECT 
    t.id,
    t.full_name,
    t.email,
    t.newsletter_consent,
    t.created_at,
    jsonb_build_object(
        'user_info', jsonb_object_agg(
            CASE WHEN m.meta_type = 'user_info' THEN m.meta_key END,
            CASE WHEN m.meta_type = 'user_info' THEN m.meta_value END
        ) FILTER (WHERE m.meta_type = 'user_info'),
        'device', jsonb_object_agg(
            CASE WHEN m.meta_type = 'device' THEN m.meta_key END,
            CASE WHEN m.meta_type = 'device' THEN m.meta_value END
        ) FILTER (WHERE m.meta_type = 'device'),
        'location', jsonb_object_agg(
            CASE WHEN m.meta_type = 'location' THEN m.meta_key END,
            CASE WHEN m.meta_type = 'location' THEN m.meta_value END
        ) FILTER (WHERE m.meta_type = 'location')
    ) as meta_details
FROM timeshare_scam_checklist t
LEFT JOIN timeshare_scam_checklist_meta m ON t.id = m.checklist_id
GROUP BY t.id, t.full_name, t.email, t.newsletter_consent, t.created_at;

-- Drop the old tables
DROP TABLE IF EXISTS timeshare_scam_checklist_meta;
DROP TABLE IF EXISTS timeshare_scam_checklist;

-- Create the new consolidated table
CREATE TABLE timeshare_scam_checklist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    newsletter_consent BOOLEAN DEFAULT false,
    meta_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Copy data from temporary table
INSERT INTO timeshare_scam_checklist (id, full_name, email, newsletter_consent, meta_details, created_at)
SELECT id, full_name, email, newsletter_consent, meta_details, created_at
FROM temp_timeshare_checklist;

-- Drop temporary table
DROP TABLE temp_timeshare_checklist;

-- Set up RLS (Row Level Security)
ALTER TABLE timeshare_scam_checklist ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create indexes
CREATE INDEX idx_timeshare_scam_checklist_email ON timeshare_scam_checklist(email);
CREATE INDEX idx_timeshare_scam_checklist_created_at ON timeshare_scam_checklist(created_at);
CREATE INDEX idx_timeshare_scam_checklist_meta_details ON timeshare_scam_checklist USING gin(meta_details); 