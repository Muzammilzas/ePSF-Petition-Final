-- Remove location columns
ALTER TABLE signatures
DROP COLUMN IF EXISTS location_city,
DROP COLUMN IF EXISTS location_region,
DROP COLUMN IF EXISTS location_country,
DROP COLUMN IF EXISTS location_latitude,
DROP COLUMN IF EXISTS location_longitude,
DROP COLUMN IF EXISTS ip_address;

-- Remove device columns
ALTER TABLE signatures
DROP COLUMN IF EXISTS browser,
DROP COLUMN IF EXISTS device_type,
DROP COLUMN IF EXISTS screen_resolution,
DROP COLUMN IF EXISTS language,
DROP COLUMN IF EXISTS timezone;

-- Note: This will permanently remove these columns and their data
-- Make sure you have a backup if you need this data in the future 