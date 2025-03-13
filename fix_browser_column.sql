-- Fix the missing browser column in the signatures table

-- First, check if the browser column exists
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'signatures'
        AND column_name = 'browser'
    ) INTO column_exists;

    -- Output the result
    RAISE NOTICE 'Browser column exists: %', column_exists;

    -- Add the column if it doesn't exist
    IF NOT column_exists THEN
        RAISE NOTICE 'Adding browser column to signatures table';
        ALTER TABLE signatures ADD COLUMN browser TEXT;
    ELSE
        RAISE NOTICE 'Browser column already exists, no action needed';
    END IF;
END $$;

-- Add other potentially missing columns
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS device_type TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS screen_resolution TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS timezone TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- Verify the column was added
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'signatures'
    AND column_name IN ('browser', 'device_type', 'screen_resolution', 'timezone', 'language', 'user_agent')
ORDER BY 
    ordinal_position; 