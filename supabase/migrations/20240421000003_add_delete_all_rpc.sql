-- Drop existing function if it exists
drop function if exists public.delete_all_spotting_exit_scams_submissions();

-- Create a secure function to delete all records
create or replace function public.delete_all_spotting_exit_scams_submissions()
returns void
language plpgsql
security definer
as $$
declare
  v_count integer;
begin
  -- First count the records
  select count(*) into v_count from public.spotting_exit_scams_submissions;
  
  -- Then delete with a true condition
  delete from public.spotting_exit_scams_submissions
  where true = true;
  
  -- Return the number of deleted records through raise notice
  raise notice 'Deleted % records', v_count;
end;
$$;

-- Grant execute permission to authenticated users
grant execute on function public.delete_all_spotting_exit_scams_submissions() to authenticated;

-- Ensure the function is available through the API
comment on function public.delete_all_spotting_exit_scams_submissions() is 'Deletes all records from spotting_exit_scams_submissions'; 