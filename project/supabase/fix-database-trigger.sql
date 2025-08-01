-- Fix Database Trigger Issues
-- Run this in your Supabase SQL editor

-- First, let's check if the trigger exists and drop it if there are issues
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Add better error handling
    BEGIN
        INSERT INTO public.users (id, username, email, full_name, phone, role, email_confirmed_at)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
            NEW.raw_user_meta_data->>'phone',
            COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
            CASE 
                WHEN NEW.email_confirmed_at IS NOT NULL THEN NEW.email_confirmed_at
                ELSE NULL
            END
        )
        ON CONFLICT (id) DO UPDATE SET
            email_confirmed_at = EXCLUDED.email_confirmed_at,
            updated_at = NOW();
    EXCEPTION WHEN OTHERS THEN
        -- Log the error but don't fail the trigger
        RAISE WARNING 'Error creating user profile: %', SQLERRM;
        RETURN NEW;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also, let's make sure the users table has the correct structure
-- Add any missing columns if they don't exist
DO $$ 
BEGIN
    -- Add email_confirmed_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'email_confirmed_at'
    ) THEN
        ALTER TABLE public.users ADD COLUMN email_confirmed_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add any other missing columns
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'phone'
    ) THEN
        ALTER TABLE public.users ADD COLUMN phone VARCHAR(20);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'role'
    ) THEN
        ALTER TABLE public.users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user';
    END IF;
END $$;

-- Check if there are any existing users without profiles and create them
INSERT INTO public.users (id, username, email, full_name, phone, role, email_confirmed_at)
SELECT 
    au.id,
    COALESCE(au.raw_user_meta_data->>'username', au.email),
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', 'User'),
    au.raw_user_meta_data->>'phone',
    COALESCE(au.raw_user_meta_data->>'role', 'user'),
    au.email_confirmed_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING; 