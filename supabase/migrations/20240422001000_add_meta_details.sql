-- First, drop existing policies
DROP POLICY IF EXISTS "enable_anon_insert" ON public.signatures;
DROP POLICY IF EXISTS "enable_insert_for_everyone" ON public.signatures;
DROP POLICY IF EXISTS "enable_select_for_authenticated" ON public.signatures;
DROP POLICY IF EXISTS "enable_delete_for_authenticated" ON public.signatures;
DROP POLICY IF EXISTS "enable_insert_for_anon" ON public.signatures;
DROP POLICY IF EXISTS "enable_all_for_authenticated" ON public.signatures;

-- Add meta_details column to signatures table
ALTER TABLE public.signatures
ADD COLUMN IF NOT EXISTS meta_details JSONB;

-- Copy existing metadata from signature_metadata table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'signature_metadata') THEN
    UPDATE public.signatures s
    SET meta_details = sm.metadata
    FROM public.signature_metadata sm
    WHERE s.id = sm.signature_id;
    
    -- Drop the old table since we've migrated the data
    DROP TABLE IF EXISTS public.signature_metadata;
  END IF;
END $$;

-- Recreate policies
CREATE POLICY "enable_anon_insert" ON public.signatures
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "enable_all_for_authenticated" ON public.signatures
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true); 