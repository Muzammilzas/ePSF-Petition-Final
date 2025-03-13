# Setting Up Admin Access for admin@example.com

Follow these step-by-step instructions to set up admin access for the admin@example.com account.

## 1. Create the Admin User in Supabase Authentication

1. Log in to your Supabase dashboard
2. Go to "Authentication" > "Users"
3. Click "Invite user" or "Add user"
4. Enter the email "admin@example.com" and a secure password
5. Make note of the UUID assigned to this user (you'll need it in step 3)

## 2. Create the Admins Table

1. Go to the "SQL Editor" in your Supabase dashboard
2. Create a new query and paste the following SQL:

```sql
-- Create admins table if it doesn't exist
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS (Row Level Security) policies
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admins to view all admins
CREATE POLICY admin_read_policy ON admins
  FOR SELECT
  USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );

-- Create policy to allow admins to insert new admins
CREATE POLICY admin_insert_policy ON admins
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admins)
  );

-- Create policy to allow admins to update admins
CREATE POLICY admin_update_policy ON admins
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );

-- Create policy to allow admins to delete admins
CREATE POLICY admin_delete_policy ON admins
  FOR DELETE
  USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );
```

3. Run the query to create the admins table and set up the security policies

## 3. Add the Admin User to the Admins Table

1. Create a new query in the SQL Editor
2. Replace `YOUR_USER_UUID` with the actual UUID from step 1
3. Paste and run the following SQL:

```sql
-- Insert the admin user directly (bypassing RLS for the first admin)
INSERT INTO admins (user_id, email)
VALUES 
  ('YOUR_USER_UUID', 'admin@example.com')
ON CONFLICT (email) DO NOTHING;

-- Verify the admin was added
SELECT * FROM admins WHERE email = 'admin@example.com';
```

## 4. Add RLS Policies for Admin Access to Petitions and Signatures

Run the following SQL to give admins full access to manage petitions and signatures:

```sql
-- Petitions table policies
CREATE POLICY admin_read_petitions ON petitions
  FOR SELECT
  USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );

CREATE POLICY admin_insert_petitions ON petitions
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admins)
  );

CREATE POLICY admin_update_petitions ON petitions
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );

CREATE POLICY admin_delete_petitions ON petitions
  FOR DELETE
  USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );

-- Signatures table policies
CREATE POLICY admin_read_signatures ON signatures
  FOR SELECT
  USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );

CREATE POLICY admin_insert_signatures ON signatures
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admins)
  );

CREATE POLICY admin_update_signatures ON signatures
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );

CREATE POLICY admin_delete_signatures ON signatures
  FOR DELETE
  USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );
```

## 5. Test Admin Access

1. Go to your application and navigate to `/admin/login`
2. Log in with the admin@example.com account and the password you set
3. You should be redirected to the admin dashboard at `/admin/dashboard`
4. If you encounter any issues, check the browser console for error messages

## Troubleshooting

If you're having trouble logging in as an admin:

1. **Check the user UUID**: Make sure the UUID in the admins table matches the UUID in Supabase Authentication
2. **Check RLS policies**: Ensure the RLS policies are correctly set up
3. **Check browser console**: Look for any error messages in the browser console
4. **Check network requests**: Look at the network requests to see if there are any API errors
5. **Try direct SQL**: Run `SELECT * FROM admins;` to verify the admin user exists in the table

If you need to manually update the admin record:

```sql
UPDATE admins
SET user_id = 'CORRECT_UUID_FROM_AUTH'
WHERE email = 'admin@example.com';
``` 