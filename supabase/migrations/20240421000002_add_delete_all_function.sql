-- Drop the function if it exists
DROP FUNCTION IF EXISTS public.delete_all_spotting_exit_scams_submissions();

-- Create or replace the function to delete all records
CREATE OR REPLACE FUNCTION public.delete_all_spotting_exit_scams_submissions()
RETURNS void AS $$
BEGIN
    DELETE FROM public.spotting_exit_scams_submissions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_all_spotting_exit_scams_submissions() TO authenticated;

-- Grant execute permission to anon users (if needed)
GRANT EXECUTE ON FUNCTION public.delete_all_spotting_exit_scams_submissions() TO anon; 