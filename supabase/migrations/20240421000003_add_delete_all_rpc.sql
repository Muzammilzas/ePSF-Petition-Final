-- Drop existing function if it exists
drop function if exists public.delete_all_spotting_exit_scams_submissions();

-- Create a secure function to delete all records
create or replace function public.delete_all_spotting_exit_scams_submissions()
returns integer
language plpgsql
security definer
as $$
declare
  v_count integer;
begin
  -- Start a transaction
  begin
    -- First count the records
    select count(*) into v_count from public.spotting_exit_scams_submissions;
    
    -- Then delete with a true condition
    delete from public.spotting_exit_scams_submissions;
    
    -- Return the number of deleted records
    return v_count;
  exception
    when others then
      -- Log the error and re-raise
      raise warning 'Error in delete_all_spotting_exit_scams_submissions: %', SQLERRM;
      raise;
  end;
end;
$$;

-- Grant execute permission to authenticated users
grant execute on function public.delete_all_spotting_exit_scams_submissions() to authenticated;

-- Ensure the function is available through the API
comment on function public.delete_all_spotting_exit_scams_submissions() is 'Deletes all records from spotting_exit_scams_submissions and returns the number of records deleted'; 