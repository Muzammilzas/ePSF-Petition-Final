-- Drop existing table if it exists
DROP TABLE IF EXISTS signature_metadata;

-- Create the signature_metadata table
CREATE TABLE signature_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    signature_id UUID NOT NULL REFERENCES signatures(id) ON DELETE CASCADE,
    metadata JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on signature_id for faster lookups
CREATE INDEX idx_signature_metadata_signature_id ON signature_metadata(signature_id);

-- Enable RLS
ALTER TABLE signature_metadata ENABLE ROW LEVEL SECURITY;

-- Create policies for access control
CREATE POLICY "Enable read access for authenticated users"
    ON signature_metadata
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for all users"
    ON signature_metadata
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON signature_metadata TO postgres;
GRANT SELECT ON signature_metadata TO authenticated;
GRANT INSERT ON signature_metadata TO anon, authenticated;

-- Refresh the schema cache
SELECT graphql.refresh_schema();

-- Verify the table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'signature_metadata'; 