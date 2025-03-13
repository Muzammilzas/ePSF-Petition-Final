-- Create a function to create the signature_metadata table if it doesn't exist
CREATE OR REPLACE FUNCTION create_signature_metadata_table_if_not_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    -- Check if the signature_metadata table exists
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'signature_metadata'
    ) INTO table_exists;

    -- Create the table if it doesn't exist
    IF NOT table_exists THEN
        CREATE TABLE signature_metadata (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            signature_id UUID NOT NULL REFERENCES signatures(id) ON DELETE CASCADE,
            metadata JSONB NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Add indexes for better performance
        CREATE INDEX idx_signature_metadata_signature_id ON signature_metadata(signature_id);
        CREATE INDEX idx_signature_metadata_created_at ON signature_metadata(created_at);
        
        -- Enable Row Level Security
        ALTER TABLE signature_metadata ENABLE ROW LEVEL SECURITY;
        
        -- Create policies for public access
        CREATE POLICY insert_signature_metadata ON signature_metadata
            FOR INSERT TO authenticated, anon
            WITH CHECK (true);
            
        CREATE POLICY select_signature_metadata ON signature_metadata
            FOR SELECT TO authenticated, anon
            USING (true);
    END IF;
END;
$$;

-- Grant execute permission to authenticated users and anonymous users
GRANT EXECUTE ON FUNCTION create_signature_metadata_table_if_not_exists() TO authenticated, anon;

-- Comment on the function
COMMENT ON FUNCTION create_signature_metadata_table_if_not_exists() IS 'Creates the signature_metadata table if it doesn''t exist';

-- Create the table immediately
SELECT create_signature_metadata_table_if_not_exists();

-- Verify the table was created
SELECT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_name = 'signature_metadata'
) AS table_exists; 