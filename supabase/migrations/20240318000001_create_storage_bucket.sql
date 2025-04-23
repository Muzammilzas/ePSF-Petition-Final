-- Create a storage bucket for scam evidence files
INSERT INTO storage.buckets (id, name, public)
VALUES ('scam-evidence', 'scam-evidence', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Give public access to all files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete their own files" ON storage.objects;

-- Create new policies for anonymous access
CREATE POLICY "Allow public access to scam evidence" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'scam-evidence');

CREATE POLICY "Allow anonymous uploads to scam evidence" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'scam-evidence');

CREATE POLICY "Allow anonymous updates to scam evidence" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'scam-evidence')
WITH CHECK (bucket_id = 'scam-evidence');

CREATE POLICY "Allow anonymous deletes from scam evidence" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'scam-evidence'); 