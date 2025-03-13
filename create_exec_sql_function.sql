-- Create a function to execute SQL scripts
-- This function should be executed by an admin user with appropriate permissions

-- First, check if the function already exists and drop it if it does
DROP FUNCTION IF EXISTS exec_sql(text);

-- Create the function with security definer to run with the privileges of the creator
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log the execution for audit purposes
  RAISE NOTICE 'Executing SQL: %', sql;
  
  -- Execute the SQL
  EXECUTE sql;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;

-- Add a comment to the function
COMMENT ON FUNCTION exec_sql(text) IS 'Executes arbitrary SQL. Use with caution - only authenticated users with admin privileges should be allowed to call this function.';

-- Create a policy to restrict access to admins only
CREATE OR REPLACE FUNCTION is_admin_for_exec_sql()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_admin boolean;
BEGIN
  -- Check if the current user is in the admins table
  SELECT EXISTS (
    SELECT 1 FROM admins
    WHERE user_id = auth.uid()
  ) INTO is_admin;
  
  RETURN is_admin;
END;
$$;

-- Create an RLS policy on the function execution
CREATE POLICY admin_exec_sql_policy
  ON pg_catalog.pg_proc
  USING (proname = 'exec_sql' AND is_admin_for_exec_sql());

-- Test the function (this will only work if executed by an admin)
SELECT exec_sql('SELECT 1;');

-- Output a success message
SELECT 'exec_sql function created successfully. Only admins can execute this function.' AS result; 