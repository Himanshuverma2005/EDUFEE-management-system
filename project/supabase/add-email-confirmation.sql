-- Add email confirmation support to existing database
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
    END IF;
END $$;

-- Update existing users to have email_confirmed_at set if they have confirmed their email
UPDATE public.users 
SET email_confirmed_at = created_at 
WHERE email_confirmed_at IS NULL 
AND EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = public.users.id 
    AND auth.users.email_confirmed_at IS NOT NULL
);

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS on_auth_user_email_confirmed ON auth.users;

-- Create function to handle email confirmation
CREATE OR REPLACE FUNCTION public.handle_email_confirmation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
        UPDATE public.users 
        SET email_confirmed_at = NEW.email_confirmed_at, updated_at = NOW()
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for email confirmation
CREATE TRIGGER on_auth_user_email_confirmed
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_email_confirmation();

-- Update the handle_new_user function to include email_confirmed_at
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 