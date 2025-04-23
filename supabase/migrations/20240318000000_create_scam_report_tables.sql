-- Create scam_reports table
CREATE TABLE IF NOT EXISTS scam_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reporter_name TEXT NOT NULL,
    reporter_email TEXT NOT NULL,
    reporter_phone TEXT,
    reporter_city TEXT NOT NULL,
    reporter_state TEXT NOT NULL,
    reporter_age_range TEXT,
    speak_with_team BOOLEAN DEFAULT FALSE,
    share_anonymously BOOLEAN DEFAULT FALSE,
    preferred_contact TEXT CHECK (preferred_contact IN ('Email', 'Phone', 'Either', 'None')),
    money_lost BOOLEAN DEFAULT FALSE,
    amount_lost DECIMAL,
    date_occurred DATE NOT NULL,
    scammer_name TEXT,
    company_name TEXT,
    scammer_phone TEXT,
    scammer_email TEXT,
    scammer_website TEXT,
    reported_elsewhere BOOLEAN DEFAULT FALSE,
    reported_to TEXT,
    want_updates BOOLEAN DEFAULT FALSE,
    evidence_file_url TEXT
);

-- Create scam_types table
CREATE TABLE IF NOT EXISTS scam_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES scam_reports(id) ON DELETE CASCADE,
    scam_type TEXT CHECK (scam_type IN ('fake_resale', 'upfront_fees', 'high_pressure', 'refund_exit', 'other')),
    claimed_sale_amount DECIMAL,
    amount DECIMAL,
    promised_services TEXT,
    tactics TEXT,
    limited_time_or_threat BOOLEAN,
    promised_refund TEXT,
    contacted_after_other_company BOOLEAN,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_methods table
CREATE TABLE IF NOT EXISTS contact_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES scam_reports(id) ON DELETE CASCADE,
    method TEXT CHECK (method IN ('phone', 'email', 'social_media', 'in_person')),
    phone_number TEXT,
    email_address TEXT,
    social_media_platform TEXT,
    social_media_profile TEXT,
    location TEXT,
    event_type TEXT,
    evidence_file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scam_report_metadata table
CREATE TABLE IF NOT EXISTS scam_report_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES scam_reports(id) ON DELETE CASCADE,
    browser TEXT,
    device_type TEXT,
    screen_resolution TEXT,
    user_agent TEXT,
    timezone TEXT,
    language TEXT,
    ip_address TEXT,
    city TEXT,
    region TEXT,
    country TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_scam_reports_created_at ON scam_reports(created_at);
CREATE INDEX IF NOT EXISTS idx_scam_types_report_id ON scam_types(report_id);
CREATE INDEX IF NOT EXISTS idx_contact_methods_report_id ON contact_methods(report_id);
CREATE INDEX IF NOT EXISTS idx_scam_report_metadata_report_id ON scam_report_metadata(report_id);

-- Enable Row Level Security (RLS)
ALTER TABLE scam_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE scam_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE scam_report_metadata ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON scam_reports;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON scam_reports;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON scam_types;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON scam_types;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON contact_methods;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON contact_methods;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON scam_report_metadata;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON scam_report_metadata;

-- Create new policies that allow anonymous access
CREATE POLICY "Enable anonymous insert" ON scam_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable anonymous read" ON scam_reports FOR SELECT USING (true);

CREATE POLICY "Enable anonymous insert" ON scam_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable anonymous read" ON scam_types FOR SELECT USING (true);

CREATE POLICY "Enable anonymous insert" ON contact_methods FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable anonymous read" ON contact_methods FOR SELECT USING (true);

CREATE POLICY "Enable anonymous insert" ON scam_report_metadata FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable anonymous read" ON scam_report_metadata FOR SELECT USING (true); 