-- Direct SQL script to add all potentially missing columns to the signatures table
-- Run this script in the Supabase SQL Editor to fix the "Could not find the 'browser' column" error

-- Add all potentially missing columns with IF NOT EXISTS to avoid errors
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS browser TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS device_type TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS screen_resolution TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS timezone TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS location_latitude FLOAT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS location_longitude FLOAT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS location_city TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS location_region TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS location_country TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS submission_date TIMESTAMPTZ DEFAULT NOW();

-- Verify the columns were added
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'signatures'
ORDER BY 
    ordinal_position;

-- Refresh the schema cache (helps with some clients)
NOTIFY pgrst, 'reload schema'; 