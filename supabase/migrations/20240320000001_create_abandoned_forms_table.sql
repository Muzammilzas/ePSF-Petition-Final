-- Create abandoned_forms table
CREATE TABLE IF NOT EXISTS public.abandoned_forms (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    session_id text NOT NULL,
    current_step text NOT NULL,
    form_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS abandoned_forms_session_id_idx ON public.abandoned_forms(session_id);
CREATE INDEX IF NOT EXISTS abandoned_forms_last_updated_at_idx ON public.abandoned_forms(last_updated_at DESC);

-- Enable Row Level Security
ALTER TABLE public.abandoned_forms ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable insert for authenticated users" ON public.abandoned_forms
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for users based on session_id" ON public.abandoned_forms
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Update the delete policy to only allow admins to delete
DROP POLICY IF EXISTS "Enable delete for users based on session_id" ON public.abandoned_forms;
CREATE POLICY "Enable delete for admins only" ON public.abandoned_forms
    FOR DELETE
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.admins
        WHERE admins.user_id = auth.uid()
    ));

CREATE POLICY "Enable select for admins" ON public.abandoned_forms
    FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.admins
        WHERE admins.user_id = auth.uid()
    ));

-- Create function to update last_updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update last_updated_at
CREATE TRIGGER update_abandoned_forms_last_updated_at
    BEFORE UPDATE ON public.abandoned_forms
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 