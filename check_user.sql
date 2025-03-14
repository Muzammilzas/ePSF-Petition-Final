-- Check if user exists in auth.users
SELECT id, email, created_at
FROM auth.users
WHERE email = 'testing@gmail.com'; 