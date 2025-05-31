-- First, add the new columns
ALTER TABLE timeshare_scam_checklist
ADD COLUMN IF NOT EXISTS created_date TEXT,
ADD COLUMN IF NOT EXISTS created_time TEXT;

-- Update existing records to populate the new columns from created_at
UPDATE timeshare_scam_checklist
SET 
  created_date = to_char(created_at AT TIME ZONE 'America/New_York', 'MM/DD/YYYY'),
  created_time = to_char(created_at AT TIME ZONE 'America/New_York', 'HH12:MI:SS AM');

-- Drop the created_at column
ALTER TABLE timeshare_scam_checklist DROP COLUMN IF EXISTS created_at; 