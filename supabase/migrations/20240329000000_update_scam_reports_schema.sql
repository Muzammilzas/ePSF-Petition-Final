-- Set timezone to EST for all timestamps
ALTER DATABASE postgres SET timezone TO 'America/New_York';

-- Remove unnecessary columns from scam_reports
ALTER TABLE scam_reports
DROP COLUMN IF EXISTS updated_at,
DROP COLUMN IF EXISTS status,
DROP COLUMN IF EXISTS reviewed_at,
DROP COLUMN IF EXISTS reviewed_by;

-- Remove unnecessary columns from contact_methods
ALTER TABLE contact_methods
DROP COLUMN IF EXISTS created_at;

-- Remove unnecessary columns from scam_types
ALTER TABLE scam_types
DROP COLUMN IF EXISTS created_at;

-- Update created_at columns to use EST timezone
ALTER TABLE scam_reports
ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP AT TIME ZONE 'America/New_York';

-- Clean up existing data before adding constraints
UPDATE scam_reports 
SET scammer_website = NULL 
WHERE scammer_website = '' 
   OR scammer_website !~ '^(https?:\/\/)?[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$';

UPDATE scam_reports 
SET reporter_email = NULL 
WHERE reporter_email = '' 
   OR reporter_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';

-- Add check constraints for better data validation
ALTER TABLE scam_reports
ADD CONSTRAINT valid_email CHECK (
    reporter_email IS NULL OR 
    reporter_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
),
ADD CONSTRAINT valid_website CHECK (
    scammer_website IS NULL OR 
    scammer_website ~* '^(https?:\/\/)?[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$'
);

-- Update enum types to match form options
DROP TYPE IF EXISTS age_range_type CASCADE;
CREATE TYPE age_range_type AS ENUM ('Under 30', '30–45', '46–60', '61+');

-- Clean up age range data before conversion
UPDATE scam_reports 
SET reporter_age_range = NULL 
WHERE reporter_age_range NOT IN ('Under 30', '30–45', '46–60', '61+');

ALTER TABLE scam_reports
ALTER COLUMN reporter_age_range TYPE age_range_type USING 
    CASE 
        WHEN reporter_age_range IS NOT NULL THEN reporter_age_range::age_range_type 
        ELSE NULL 
    END;

-- Add indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_scam_reports_reporter_email ON scam_reports(reporter_email);
CREATE INDEX IF NOT EXISTS idx_scam_reports_scammer_email ON scam_reports(scammer_email);
CREATE INDEX IF NOT EXISTS idx_scam_reports_scammer_phone ON scam_reports(scammer_phone); 