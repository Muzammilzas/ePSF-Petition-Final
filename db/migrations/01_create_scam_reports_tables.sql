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
    amount_lost DECIMAL,
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
    claimed_sale_amount DECIMAL,
    amount DECIMAL,
    promised_services TEXT,
    tactics TEXT,
    limited_time_or_threat BOOLEAN,
    promised_refund TEXT,
    contacted_after_other_company BOOLEAN,
    description TEXT
);

-- Create contact_methods table
CREATE TABLE IF NOT EXISTS contact_methods (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES scam_reports(id) ON DELETE CASCADE,
    method TEXT NOT NULL,
    phone_number TEXT,
    email_address TEXT,
    evidence_file_url TEXT,
    social_media_platform TEXT,
    social_media_profile TEXT,
    location TEXT,
    event_type TEXT
);

-- Add indexes for better query performance
CREATE INDEX idx_scam_reports_created_at ON scam_reports(created_at);
CREATE INDEX idx_scam_reports_date_occurred ON scam_reports(date_occurred);
CREATE INDEX idx_scam_reports_money_lost ON scam_reports(money_lost);
CREATE INDEX idx_scam_types_report_id ON scam_types(report_id);
CREATE INDEX idx_contact_methods_report_id ON contact_methods(report_id); 