-- Check the current structure of the petitions table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'petitions';

-- Check the current structure of the signatures table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'signatures';

-- Add missing columns to petitions table if they don't exist
DO $$
BEGIN
    -- Check if title column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'petitions' AND column_name = 'title') THEN
        ALTER TABLE petitions ADD COLUMN title TEXT;
    END IF;

    -- Check if story column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'petitions' AND column_name = 'story') THEN
        ALTER TABLE petitions ADD COLUMN story TEXT;
    END IF;

    -- Check if assessed_value column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'petitions' AND column_name = 'assessed_value') THEN
        ALTER TABLE petitions ADD COLUMN assessed_value NUMERIC;
    END IF;
END $$;

-- Check the updated structure of the petitions table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'petitions';

-- Sample query to check data in petitions table
SELECT * FROM petitions LIMIT 5;

-- Sample query to check data in signatures table
SELECT * FROM signatures LIMIT 5; 