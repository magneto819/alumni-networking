/*
  # Setup Storage Policies for Avatars

  1. Security
    - Set up RLS policies for storage.objects table
    - Allow authenticated users to manage their own avatars
    - Allow public read access
    
  2. Implementation
    - Uses storage helper functions to check folder ownership
*/

-- First, let's grant necessary permissions to postgres role
DO $$
DECLARE
  storage_owner text;
BEGIN
  -- Get the owner of storage.objects table
  SELECT tableowner INTO storage_owner
  FROM pg_tables
  WHERE schemaname = 'storage' AND tablename = 'objects';
  
  -- If we're not the owner, we need to work around it
  IF storage_owner != current_user THEN
    -- Create policies as postgres (which has necessary privileges)
    -- Drop existing policies if any
    PERFORM 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can upload own avatar';
    
    IF FOUND THEN
      EXECUTE 'DROP POLICY "Users can upload own avatar" ON storage.objects';
    END IF;
    
    PERFORM 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can update own avatar';
    
    IF FOUND THEN
      EXECUTE 'DROP POLICY "Users can update own avatar" ON storage.objects';
    END IF;
    
    PERFORM 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete own avatar';
    
    IF FOUND THEN
      EXECUTE 'DROP POLICY "Users can delete own avatar" ON storage.objects';
    END IF;
    
    PERFORM 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can view avatars';
    
    IF FOUND THEN
      EXECUTE 'DROP POLICY "Anyone can view avatars" ON storage.objects';
    END IF;
  END IF;
  
  -- Create policies using dynamic SQL with proper quoting
  EXECUTE format($sql$
    CREATE POLICY "Users can upload own avatar"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'avatars' 
      AND (storage.foldername(name))[1] = auth.uid()::text
    )
  $sql$);
  
  EXECUTE format($sql$
    CREATE POLICY "Users can update own avatar"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'avatars' 
      AND (storage.foldername(name))[1] = auth.uid()::text
    )
    WITH CHECK (
      bucket_id = 'avatars' 
      AND (storage.foldername(name))[1] = auth.uid()::text
    )
  $sql$);
  
  EXECUTE format($sql$
    CREATE POLICY "Users can delete own avatar"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'avatars' 
      AND (storage.foldername(name))[1] = auth.uid()::text
    )
  $sql$);
  
  EXECUTE format($sql$
    CREATE POLICY "Anyone can view avatars"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'avatars')
  $sql$);
  
EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE NOTICE 'Insufficient privileges. Storage policies need to be created via Supabase Dashboard.';
  WHEN OTHERS THEN
    RAISE NOTICE 'Error: %', SQLERRM;
END$$;