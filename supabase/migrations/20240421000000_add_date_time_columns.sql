-- Drop existing column if it exists
ALTER TABLE timeshare_checklist_submissions
DROP COLUMN IF EXISTS created_date;

-- Add created_date column
ALTER TABLE timeshare_checklist_submissions
ADD COLUMN IF NOT EXISTS created_date VARCHAR(10) DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'America/New_York', 'MM/DD/YYYY');

-- Create index for created_date
DROP INDEX IF EXISTS idx_timeshare_checklist_submissions_created_date;
CREATE INDEX idx_timeshare_checklist_submissions_created_date ON timeshare_checklist_submissions(created_date); 