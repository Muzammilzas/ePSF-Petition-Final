-- Create a function to get column information for a table
-- This function will be used to dynamically build select statements based on available columns

-- First, check if the function already exists and drop it if it does
DROP FUNCTION IF EXISTS get_table_columns(text);

-- Create the function
CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
RETURNS TABLE (
    column_name text,
    data_type text,
    is_nullable text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.column_name::text,
        c.data_type::text,
        c.is_nullable::text
    FROM 
        information_schema.columns c
    WHERE 
        c.table_name = get_table_columns.table_name
        AND c.table_schema = 'public'
    ORDER BY 
        c.ordinal_position;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_table_columns(text) TO authenticated;

-- Add a comment to the function
COMMENT ON FUNCTION get_table_columns(text) IS 'Returns column information for the specified table';

-- Test the function
SELECT * FROM get_table_columns('signatures');

-- Output a success message
SELECT 'get_table_columns function created successfully' AS result; 