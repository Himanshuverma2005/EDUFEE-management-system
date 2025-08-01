-- Fix Database Trigger (Simplified Version)
-- Run this AFTER running add-missing-columns.sql

-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Add better error handling
    BEGIN
        INSERT INTO public.users (id, username, email, full_name, phone, role)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
            NEW.raw_user_meta_data->>'phone',
            COALESCE(NEW.raw_user_meta_data->>'role', 'user')
        )
        ON CONFLICT (id) DO NOTHING;
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

-- Test the trigger by checking if it exists
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created'; 