DO $$ 
BEGIN
    -- Drop the contact_preference enum type if it exists
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contact_preference') THEN
        ALTER TABLE scam_reports 
        ALTER COLUMN preferred_contact TYPE TEXT;
        
        DROP TYPE contact_preference;
    END IF;
END $$; 