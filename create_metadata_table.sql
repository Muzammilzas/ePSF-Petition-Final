-- First, disable RLS temporarily to avoid any permission issues during recreation
ALTER TABLE IF EXISTS signature_metadata DISABLE ROW LEVEL SECURITY;

-- Drop existing table and related objects
DROP TABLE IF EXISTS signature_metadata CASCADE;

-- Create the signature_metadata table with explicit reference
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

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON signature_metadata;
DROP POLICY IF EXISTS "Enable insert access for all users" ON signature_metadata;

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users" ON signature_metadata
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for all users" ON signature_metadata
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON signature_metadata TO postgres;
GRANT SELECT ON signature_metadata TO authenticated;
GRANT INSERT ON signature_metadata TO anon, authenticated;

-- Force a schema cache refresh
NOTIFY pgrst, 'reload schema';

-- Additional step to ensure the schema is refreshed
SELECT schema_version.update();
SELECT graphql.rebuild_schema();
SELECT graphql.refresh_schema(); 