-- Remove preferred_contact column as we only use email
ALTER TABLE scam_reports 
    DROP COLUMN IF EXISTS preferred_contact;

-- Drop the contact_preference type if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contact_preference') THEN
        DROP TYPE contact_preference;
    END IF;
END $$; 