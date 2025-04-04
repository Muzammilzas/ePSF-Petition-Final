-- Create enum types for consistent values
CREATE TYPE contact_preference AS ENUM ('Email', 'Phone', 'Either', 'None');
CREATE TYPE age_range AS ENUM ('Under 30', '30–45', '46–60', '61+');
CREATE TYPE scam_type AS ENUM ('fake_resale', 'upfront_fees', 'high_pressure', 'refund_exit', 'other');
CREATE TYPE contact_method_type AS ENUM ('phone', 'email', 'social_media', 'in_person');

-- Create the main scam reports table
CREATE TABLE IF NOT EXISTS scam_reports (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Reporter Information
    reporter_name TEXT NOT NULL,
    reporter_email TEXT,
    reporter_phone TEXT,
    reporter_city TEXT NOT NULL,
    reporter_state TEXT NOT NULL,
    reporter_age_range age_range,
    speak_with_team BOOLEAN NOT NULL DEFAULT FALSE,
    share_anonymously BOOLEAN NOT NULL DEFAULT FALSE,
    preferred_contact contact_preference NOT NULL,
    
    -- Scam Details
    money_lost BOOLEAN NOT NULL DEFAULT FALSE,
    amount_lost DECIMAL(10,2),
    date_occurred DATE NOT NULL,
    scammer_name TEXT,
    company_name TEXT,
    scammer_phone TEXT,
    scammer_email TEXT,
    scammer_website TEXT,
    
    -- Additional Information
    reported_elsewhere BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to TEXT,
    want_updates BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Metadata
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the scam types table
CREATE TABLE IF NOT EXISTS scam_types (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT REFERENCES scam_reports(id) ON DELETE CASCADE,
    scam_type scam_type NOT NULL,
    claimed_sale_amount DECIMAL(10,2),
    amount DECIMAL(10,2),
    promised_services TEXT,
    tactics TEXT,
    limited_time_or_threat BOOLEAN,
    promised_refund TEXT,
    contacted_after_other_company BOOLEAN,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the contact methods table
CREATE TABLE IF NOT EXISTS contact_methods (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT REFERENCES scam_reports(id) ON DELETE CASCADE,
    method contact_method_type NOT NULL,
    phone_number TEXT,
    email_address TEXT,
    social_media_platform TEXT,
    social_media_profile TEXT,
    location TEXT,
    event_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the evidence files table
CREATE TABLE IF NOT EXISTS evidence_files (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT REFERENCES scam_reports(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_scam_reports_created_at ON scam_reports(created_at);
CREATE INDEX idx_scam_reports_date_occurred ON scam_reports(date_occurred);
CREATE INDEX idx_scam_types_report_id ON scam_types(report_id);
CREATE INDEX idx_contact_methods_report_id ON contact_methods(report_id);
CREATE INDEX idx_evidence_files_report_id ON evidence_files(report_id);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_scam_reports_updated_at
    BEFORE UPDATE ON scam_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add Row Level Security (RLS) policies
ALTER TABLE scam_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE scam_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_files ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Enable read access for authenticated users" ON scam_reports
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON scam_reports
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Repeat for other tables
CREATE POLICY "Enable read access for authenticated users" ON scam_types
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON scam_types
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON contact_methods
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON contact_methods
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON evidence_files
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON evidence_files
    FOR INSERT
    TO authenticated
    WITH CHECK (true); 