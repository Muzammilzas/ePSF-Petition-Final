-- Update signatures table to include additional fields for geolocation and metadata

-- First, explicitly create all required columns
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS zip_code TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS consent_to_collect_data BOOLEAN DEFAULT TRUE;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS location_city TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS location_region TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS location_country TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS location_latitude FLOAT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS location_longitude FLOAT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS browser TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS device_type TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS screen_resolution TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS timezone TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE IF EXISTS signatures ADD COLUMN IF NOT EXISTS submission_date TIMESTAMPTZ DEFAULT NOW();

-- Create an index on the petition_id column for faster queries
CREATE INDEX IF NOT EXISTS idx_signatures_petition_id ON signatures(petition_id);

-- Create an index on the email column for faster searches
CREATE INDEX IF NOT EXISTS idx_signatures_email ON signatures(email);

-- Create an index on the submission_date column for faster sorting
CREATE INDEX IF NOT EXISTS idx_signatures_submission_date ON signatures(submission_date);

-- Create a function to get geolocation data for reporting
CREATE OR REPLACE FUNCTION get_signature_locations()
RETURNS TABLE (
    location_city TEXT,
    location_region TEXT,
    location_country TEXT,
    signature_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.location_city,
        s.location_region,
        s.location_country,
        COUNT(*) as signature_count
    FROM 
        signatures s
    WHERE 
        s.location_city IS NOT NULL
    GROUP BY 
        s.location_city, s.location_region, s.location_country
    ORDER BY 
        signature_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Print the updated table structure
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