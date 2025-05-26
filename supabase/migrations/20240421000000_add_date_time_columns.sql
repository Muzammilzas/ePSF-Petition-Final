-- Drop existing columns if they exist
ALTER TABLE timeshare_checklist_submissions
DROP COLUMN IF EXISTS created_date,
DROP COLUMN IF EXISTS created_time;

-- Add created_date and created_time columns
ALTER TABLE timeshare_checklist_submissions
ADD COLUMN IF NOT EXISTS created_date VARCHAR(10) DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'America/New_York', 'MM/DD/YYYY'),
ADD COLUMN IF NOT EXISTS created_time VARCHAR(12) DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'America/New_York', 'HH12:MI:SS AM');

-- Create indexes for created_date and created_time
DROP INDEX IF EXISTS idx_timeshare_checklist_submissions_created_date;
DROP INDEX IF EXISTS idx_timeshare_checklist_submissions_created_time;

CREATE INDEX idx_timeshare_checklist_submissions_created_date ON timeshare_checklist_submissions(created_date);
CREATE INDEX idx_timeshare_checklist_submissions_created_time ON timeshare_checklist_submissions(created_time); 