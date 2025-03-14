-- Direct SQL script to create the signature_metadata table
-- Run this script in the Supabase SQL Editor to create a table for storing signature metadata

-- Create the signature_metadata table if it doesn't exist
CREATE TABLE IF NOT EXISTS signature_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    signature_id UUID NOT NULL REFERENCES signatures(id) ON DELETE CASCADE,
    metadata JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_signature_metadata_signature_id ON signature_metadata(signature_id);
CREATE INDEX IF NOT EXISTS idx_signature_metadata_created_at ON signature_metadata(created_at);

-- Enable Row Level Security
ALTER TABLE signature_metadata ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (if they don't exist)
DO $$
BEGIN
    -- Check if the insert policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'signature_metadata' AND policyname = 'insert_signature_metadata'
    ) THEN
        CREATE POLICY insert_signature_metadata ON signature_metadata
            FOR INSERT TO authenticated, anon
            WITH CHECK (true);
    END IF;
    
    -- Check if the select policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'signature_metadata' AND policyname = 'select_signature_metadata'
    ) THEN
        CREATE POLICY select_signature_metadata ON signature_metadata
            FOR SELECT TO authenticated, anon
            USING (true);
    END IF;
END $$;

-- Verify the table was created
SELECT 
    table_name, 
    column_name, 
    data_type
FROM 
    information_schema.columns
WHERE 
    table_name = 'signature_metadata'
ORDER BY 
    ordinal_position; 