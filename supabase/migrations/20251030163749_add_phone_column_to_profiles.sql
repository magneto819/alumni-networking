/*
  # Add Phone Column to Profiles Table

  1. Changes
    - Add `phone` column to profiles table
    - Column is optional (nullable)
    - Stores phone numbers as text for flexibility (international formats)
    
  2. Notes
    - Phone validation should be handled at application level
*/

-- Add phone column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone text;
  END IF;
END $$;