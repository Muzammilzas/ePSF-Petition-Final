-- Create a function to add the browser column if it doesn't exist
CREATE OR REPLACE FUNCTION add_browser_column_if_not_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    -- Check if the browser column exists
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'signatures'
        AND column_name = 'browser'
    ) INTO column_exists;

    -- Add the column if it doesn't exist
    IF NOT column_exists THEN
        EXECUTE 'ALTER TABLE signatures ADD COLUMN browser TEXT';
    END IF;
    
    -- Check if other columns exist and add them if they don't
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'signatures'
        AND column_name = 'device_type'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        EXECUTE 'ALTER TABLE signatures ADD COLUMN device_type TEXT';
    END IF;
    
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'signatures'
        AND column_name = 'screen_resolution'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        EXECUTE 'ALTER TABLE signatures ADD COLUMN screen_resolution TEXT';
    END IF;
    
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'signatures'
        AND column_name = 'timezone'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        EXECUTE 'ALTER TABLE signatures ADD COLUMN timezone TEXT';
    END IF;
    
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'signatures'
        AND column_name = 'language'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        EXECUTE 'ALTER TABLE signatures ADD COLUMN language TEXT';
    END IF;
    
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'signatures'
        AND column_name = 'user_agent'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        EXECUTE 'ALTER TABLE signatures ADD COLUMN user_agent TEXT';
    END IF;
    
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'signatures'
        AND column_name = 'location_latitude'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        EXECUTE 'ALTER TABLE signatures ADD COLUMN location_latitude FLOAT';
    END IF;
    
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'signatures'
        AND column_name = 'location_longitude'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        EXECUTE 'ALTER TABLE signatures ADD COLUMN location_longitude FLOAT';
    END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION add_browser_column_if_not_exists() TO authenticated;

-- Comment on the function
COMMENT ON FUNCTION add_browser_column_if_not_exists() IS 'Adds the browser column to the signatures table if it''s not exists';

-- Test the function
SELECT add_browser_column_if_not_exists(); 