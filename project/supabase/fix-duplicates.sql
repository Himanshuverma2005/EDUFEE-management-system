-- Fix Duplicate Users Script
-- Run this in your Supabase SQL editor if you have duplicate user issues

-- First, let's see if there are any duplicate users
SELECT id, username, email, COUNT(*) 
FROM public.users 
GROUP BY id, username, email 
HAVING COUNT(*) > 1;

-- If duplicates exist, you can clean them up with:
-- DELETE FROM public.users 
-- WHERE id IN (
--     SELECT id 
--     FROM (
--         SELECT id, ROW_NUMBER() OVER (PARTITION BY id ORDER BY created_at) as rn
--         FROM public.users
--     ) t 
--     WHERE t.rn > 1
-- );

-- Also check for duplicate emails or usernames
SELECT username, COUNT(*) 
FROM public.users 
GROUP BY username 
HAVING COUNT(*) > 1;

SELECT email, COUNT(*) 
FROM public.users 
GROUP BY email 
HAVING COUNT(*) > 1; 