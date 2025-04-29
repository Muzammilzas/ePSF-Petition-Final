-- Create website_analytics table
CREATE TABLE IF NOT EXISTS website_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ip_address TEXT NOT NULL,
    location TEXT,
    device TEXT,
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    referrer TEXT,
    page_url TEXT,
    session_duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_website_analytics_visited_at ON website_analytics(visited_at);
CREATE INDEX IF NOT EXISTS idx_website_analytics_ip_address ON website_analytics(ip_address);

-- Add RLS policies
ALTER TABLE website_analytics ENABLE ROW LEVEL SECURITY;

-- Allow admins to read analytics data
CREATE POLICY "Allow admins to read analytics data"
    ON website_analytics
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.user_id = auth.uid()
        )
    );

-- Allow anyone to insert analytics data
CREATE POLICY "Allow anyone to insert analytics data"
    ON website_analytics
    FOR INSERT
    TO public
    WITH CHECK (true); 