-- Drop existing columns if they exist
ALTER TABLE timeshare_checklist_submissions
DROP COLUMN IF EXISTS created_date,
DROP COLUMN IF EXISTS created_time;

-- Add created_date and created_time columns
ALTER TABLE timeshare_checklist_submissions
ADD COLUMN created_date DATE GENERATED ALWAYS AS (timezone('America/New_York', created_at)::date) STORED,
ADD COLUMN created_time TIME GENERATED ALWAYS AS (timezone('America/New_York', created_at)::time) STORED;

-- Update existing records to populate the new columns
UPDATE timeshare_checklist_submissions
SET created_at = created_at
WHERE created_at IS NOT NULL;

-- Create indexes for the new columns
DROP INDEX IF EXISTS idx_timeshare_checklist_submissions_created_date;
DROP INDEX IF EXISTS idx_timeshare_checklist_submissions_created_time;
CREATE INDEX idx_timeshare_checklist_submissions_created_date ON timeshare_checklist_submissions(created_date);
CREATE INDEX idx_timeshare_checklist_submissions_created_time ON timeshare_checklist_submissions(created_time); 