-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for consistent values
CREATE TYPE contact_method_type AS ENUM ('Email', 'Phone', 'Either', 'None');
CREATE TYPE age_range_type AS ENUM ('Under 30', '30–45', '46–60', '61+');
CREATE TYPE scam_type_enum AS ENUM ('fake_resale', 'upfront_fees', 'high_pressure', 'refund_exit', 'other');
CREATE TYPE contact_method_enum AS ENUM ('phone', 'email', 'social_media', 'in_person');

-- Create scam_reports table
CREATE TABLE IF NOT EXISTS scam_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Reporter Information
    reporter_name TEXT NOT NULL,
    reporter_email TEXT,
    reporter_phone TEXT,
    reporter_city TEXT NOT NULL,
    reporter_state TEXT NOT NULL,
    reporter_age_range age_range_type,
    speak_with_team BOOLEAN NOT NULL DEFAULT FALSE,
    share_anonymously BOOLEAN NOT NULL DEFAULT FALSE,
    preferred_contact contact_method_type NOT NULL,
    
    -- Scam Details
    money_lost BOOLEAN NOT NULL DEFAULT FALSE,
    amount_lost DECIMAL(12,2),
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
    evidence_file_url TEXT,
    
    -- Metadata
    status TEXT DEFAULT 'pending',
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID,
    
    -- Validation
    CONSTRAINT valid_amount_lost CHECK (
        (money_lost = FALSE AND amount_lost IS NULL) OR 
        (money_lost = TRUE AND amount_lost >= 0)
    ),
    CONSTRAINT valid_contact_info CHECK (
        (preferred_contact = 'Email' AND reporter_email IS NOT NULL) OR
        (preferred_contact = 'Phone' AND reporter_phone IS NOT NULL) OR
        (preferred_contact = 'Either' AND reporter_email IS NOT NULL AND reporter_phone IS NOT NULL) OR
        (preferred_contact = 'None')
    )
);

-- Create scam_types table
CREATE TABLE IF NOT EXISTS scam_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES scam_reports(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    scam_type scam_type_enum NOT NULL,
    claimed_sale_amount DECIMAL(12,2),
    amount DECIMAL(12,2),
    promised_services TEXT,
    tactics TEXT,
    limited_time_or_threat BOOLEAN,
    promised_refund TEXT,
    contacted_after_other_company BOOLEAN,
    description TEXT,
    
    -- Validation
    CONSTRAINT valid_fake_resale CHECK (
        scam_type != 'fake_resale' OR 
        (scam_type = 'fake_resale' AND claimed_sale_amount IS NOT NULL)
    ),
    CONSTRAINT valid_upfront_fees CHECK (
        scam_type != 'upfront_fees' OR 
        (scam_type = 'upfront_fees' AND amount IS NOT NULL AND promised_services IS NOT NULL)
    ),
    CONSTRAINT valid_high_pressure CHECK (
        scam_type != 'high_pressure' OR 
        (scam_type = 'high_pressure' AND tactics IS NOT NULL AND limited_time_or_threat IS NOT NULL)
    ),
    CONSTRAINT valid_refund_exit CHECK (
        scam_type != 'refund_exit' OR 
        (scam_type = 'refund_exit' AND promised_refund IS NOT NULL AND contacted_after_other_company IS NOT NULL)
    ),
    CONSTRAINT valid_other CHECK (
        scam_type != 'other' OR 
        (scam_type = 'other' AND description IS NOT NULL)
    )
);

-- Create contact_methods table
CREATE TABLE IF NOT EXISTS contact_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES scam_reports(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    method contact_method_enum NOT NULL,
    phone_number TEXT,
    email_address TEXT,
    evidence_file_url TEXT,
    social_media_platform TEXT,
    social_media_profile TEXT,
    location TEXT,
    event_type TEXT,
    
    -- Validation
    CONSTRAINT valid_phone_method CHECK (
        method != 'phone' OR 
        (method = 'phone' AND phone_number IS NOT NULL)
    ),
    CONSTRAINT valid_email_method CHECK (
        method != 'email' OR 
        (method = 'email' AND email_address IS NOT NULL)
    ),
    CONSTRAINT valid_social_media_method CHECK (
        method != 'social_media' OR 
        (method = 'social_media' AND social_media_platform IS NOT NULL AND social_media_profile IS NOT NULL)
    ),
    CONSTRAINT valid_in_person_method CHECK (
        method != 'in_person' OR 
        (method = 'in_person' AND location IS NOT NULL AND event_type IS NOT NULL)
    )
);

-- Create indexes for better query performance
CREATE INDEX idx_scam_reports_created_at ON scam_reports(created_at);
CREATE INDEX idx_scam_reports_date_occurred ON scam_reports(date_occurred);
CREATE INDEX idx_scam_reports_money_lost ON scam_reports(money_lost);
CREATE INDEX idx_scam_reports_status ON scam_reports(status);
CREATE INDEX idx_scam_reports_city_state ON scam_reports(reporter_city, reporter_state);
CREATE INDEX idx_scam_reports_company ON scam_reports(company_name);
CREATE INDEX idx_scam_types_report_id ON scam_types(report_id);
CREATE INDEX idx_scam_types_type ON scam_types(scam_type);
CREATE INDEX idx_contact_methods_report_id ON contact_methods(report_id);
CREATE INDEX idx_contact_methods_method ON contact_methods(method);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_scam_reports_updated_at
    BEFORE UPDATE ON scam_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE scam_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE scam_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_methods ENABLE ROW LEVEL SECURITY;

-- Create policies for scam_reports
CREATE POLICY "Enable read access for authenticated users" ON scam_reports
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for all users" ON scam_reports
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Create policies for scam_types
CREATE POLICY "Enable read access for authenticated users" ON scam_types
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for all users" ON scam_types
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Create policies for contact_methods
CREATE POLICY "Enable read access for authenticated users" ON contact_methods
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for all users" ON contact_methods
    FOR INSERT
    TO anon
    WITH CHECK (true); 