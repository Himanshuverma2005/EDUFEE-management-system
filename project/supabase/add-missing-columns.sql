-- Add Missing Columns to Users Table
-- Run this in your Supabase SQL editor

-- Add email_confirmed_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'email_confirmed_at'
    ) THEN
        ALTER TABLE public.users ADD COLUMN email_confirmed_at TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added email_confirmed_at column to users table';
    ELSE
        RAISE NOTICE 'email_confirmed_at column already exists';
    END IF;
END $$;

-- Check the current structure of the users table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position; 