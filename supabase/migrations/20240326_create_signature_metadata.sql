-- Create signature_metadata table
CREATE TABLE IF NOT EXISTS signature_metadata (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    signature_id UUID NOT NULL REFERENCES signatures(id) ON DELETE CASCADE,
    metadata JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_signature_metadata_signature_id ON signature_metadata(signature_id);

-- Enable RLS
ALTER TABLE signature_metadata ENABLE ROW LEVEL SECURITY;

-- Create policies for signature_metadata
CREATE POLICY "Enable insert for authenticated users only" ON signature_metadata
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON signature_metadata
    FOR SELECT
    USING (true);

CREATE POLICY "Enable update for admins" ON signature_metadata
    FOR UPDATE
    USING (auth.uid() IN (SELECT user_id FROM admins));

CREATE POLICY "Enable delete for admins" ON signature_metadata
    FOR DELETE
    USING (auth.uid() IN (SELECT user_id FROM admins)); 