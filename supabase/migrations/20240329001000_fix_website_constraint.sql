-- Drop the existing website constraint
ALTER TABLE scam_reports DROP CONSTRAINT IF EXISTS valid_website;

-- Make website field nullable
ALTER TABLE scam_reports ALTER COLUMN scammer_website DROP NOT NULL;

-- Add a new constraint that allows NULL or valid URLs
CREATE OR REPLACE FUNCTION is_valid_url(url TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- NULL is valid
  IF url IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Empty string is treated as NULL
  IF url = '' THEN
    RETURN TRUE;
  END IF;
  
  -- Basic URL validation
  RETURN url ~* '^https?://[^\s/$.?#].[^\s]*$';
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Add the new constraint
ALTER TABLE scam_reports
  ADD CONSTRAINT valid_website
  CHECK (is_valid_url(scammer_website)); 