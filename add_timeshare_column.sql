-- Add timeshare_name column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'signatures'
        AND column_name = 'timeshare_name'
    ) THEN
        ALTER TABLE signatures
        ADD COLUMN timeshare_name TEXT;
    END IF;
END $$; 