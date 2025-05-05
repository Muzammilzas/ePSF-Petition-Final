-- Drop existing website constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.constraint_column_usage 
        WHERE constraint_name = 'valid_website'
    ) THEN
        ALTER TABLE scam_reports DROP CONSTRAINT IF EXISTS valid_website;
    END IF;
END $$;

-- Make website field nullable and remove any validation constraints
ALTER TABLE scam_reports 
    ALTER COLUMN scammer_website DROP NOT NULL,
    ALTER COLUMN scammer_website TYPE TEXT;

-- Make date_occurred nullable for now (we'll validate it in the application)
ALTER TABLE scam_reports 
    ALTER COLUMN date_occurred DROP NOT NULL;

-- Make preferred_contact optional
ALTER TABLE scam_reports 
    ALTER COLUMN preferred_contact DROP NOT NULL;

-- Drop any existing check constraints that might be causing issues
ALTER TABLE scam_reports 
    DROP CONSTRAINT IF EXISTS valid_contact_info,
    DROP CONSTRAINT IF EXISTS valid_amount_lost;

-- Add simpler constraints
ALTER TABLE scam_reports
    ADD CONSTRAINT valid_amount_lost 
    CHECK (amount_lost IS NULL OR amount_lost >= 0);

-- Update existing rows that might have NULL values
UPDATE scam_reports 
SET 
    scammer_website = '' WHERE scammer_website IS NULL,
    scammer_name = '' WHERE scammer_name IS NULL,
    company_name = '' WHERE company_name IS NULL,
    scammer_phone = '' WHERE scammer_phone IS NULL,
    scammer_email = '' WHERE scammer_email IS NULL; 