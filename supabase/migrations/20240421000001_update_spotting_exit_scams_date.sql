-- Drop existing columns if they exist
ALTER TABLE spotting_exit_scams_submissions
DROP COLUMN IF EXISTS created_date,
DROP COLUMN IF EXISTS created_time,
DROP COLUMN IF EXISTS created_at;

-- Add created_date column with default value
ALTER TABLE spotting_exit_scams_submissions
ADD COLUMN IF NOT EXISTS created_date VARCHAR(10) DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'America/New_York', 'MM/DD/YYYY') NOT NULL;

-- Create index for created_date
DROP INDEX IF EXISTS idx_spotting_exit_scams_submissions_created_date;
CREATE INDEX idx_spotting_exit_scams_submissions_created_date ON spotting_exit_scams_submissions(created_date); 