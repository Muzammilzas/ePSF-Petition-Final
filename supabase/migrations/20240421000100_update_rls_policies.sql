-- First, enable RLS on the table
ALTER TABLE timeshare_checklist_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON timeshare_checklist_submissions;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON timeshare_checklist_submissions;

-- Create policy to allow anonymous inserts
CREATE POLICY "Enable insert for anonymous users" 
ON timeshare_checklist_submissions
FOR INSERT 
TO anon
WITH CHECK (true);

-- Create policy to allow only authenticated users to read
CREATE POLICY "Enable read access for authenticated users only" 
ON timeshare_checklist_submissions
FOR SELECT 
TO authenticated
USING (true); 