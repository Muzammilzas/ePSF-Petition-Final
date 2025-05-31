-- Add timeshare_name column to signatures table
ALTER TABLE public.signatures 
ADD COLUMN IF NOT EXISTS timeshare_name TEXT;

-- Update RLS policies to include the new column
ALTER TABLE public.signatures DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "enable_insert_for_everyone" ON signatures;
DROP POLICY IF EXISTS "enable_select_for_authenticated" ON signatures;
DROP POLICY IF EXISTS "enable_delete_for_authenticated" ON signatures;
DROP POLICY IF EXISTS "enable_insert_for_anon" ON signatures;
DROP POLICY IF EXISTS "enable_all_for_authenticated" ON signatures;

-- Re-enable RLS
ALTER TABLE public.signatures ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "enable_anon_insert" ON signatures
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "enable_auth_all" ON signatures
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Ensure proper permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON signatures TO anon;
GRANT ALL ON signatures TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated; 