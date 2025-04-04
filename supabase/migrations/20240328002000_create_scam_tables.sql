-- Create scam_reports table
CREATE TABLE IF NOT EXISTS scam_reports (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reporter_name TEXT NOT NULL,
    reporter_email TEXT,
    reporter_phone TEXT,
    reporter_city TEXT NOT NULL,
    reporter_state TEXT NOT NULL,
    reporter_age_range TEXT,
    speak_with_team BOOLEAN NOT NULL DEFAULT FALSE,
    share_anonymously BOOLEAN NOT NULL DEFAULT FALSE,
    preferred_contact TEXT NOT NULL,
    money_lost BOOLEAN NOT NULL DEFAULT FALSE,
    amount_lost DECIMAL(10,2),
    date_occurred DATE NOT NULL,
    scammer_name TEXT,
    company_name TEXT,
    scammer_phone TEXT,
    scammer_email TEXT,
    scammer_website TEXT,
    reported_elsewhere BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to TEXT,
    want_updates BOOLEAN NOT NULL DEFAULT FALSE,
    evidence_file_url TEXT
);

-- Create scam_types table
CREATE TABLE IF NOT EXISTS scam_types (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES scam_reports(id) ON DELETE CASCADE,
    scam_type TEXT NOT NULL,
    claimed_sale_amount DECIMAL(10,2),
    amount DECIMAL(10,2),
    promised_services TEXT,
    tactics TEXT,
    limited_time_or_threat BOOLEAN,
    promised_refund TEXT,
    contacted_after_other_company BOOLEAN,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create contact_methods table
CREATE TABLE IF NOT EXISTS contact_methods (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES scam_reports(id) ON DELETE CASCADE,
    method TEXT NOT NULL,
    phone_number TEXT,
    email_address TEXT,
    social_media_platform TEXT,
    social_media_profile TEXT,
    location TEXT,
    event_type TEXT,
    evidence_file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_scam_reports_created_at ON scam_reports(created_at);
CREATE INDEX IF NOT EXISTS idx_scam_reports_date_occurred ON scam_reports(date_occurred);
CREATE INDEX IF NOT EXISTS idx_scam_types_report_id ON scam_types(report_id);
CREATE INDEX IF NOT EXISTS idx_contact_methods_report_id ON contact_methods(report_id);

-- Enable Row Level Security (RLS)
ALTER TABLE scam_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE scam_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_methods ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON scam_reports;
    DROP POLICY IF EXISTS "Enable insert access for all users" ON scam_reports;
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON scam_types;
    DROP POLICY IF EXISTS "Enable insert access for all users" ON scam_types;
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON contact_methods;
    DROP POLICY IF EXISTS "Enable insert access for all users" ON contact_methods;
END $$;

-- Create new policies
CREATE POLICY "Enable read access for authenticated users" ON scam_reports
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for all users" ON scam_reports
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON scam_types
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for all users" ON scam_types
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON contact_methods
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for all users" ON contact_methods
    FOR INSERT
    TO anon
    WITH CHECK (true); 