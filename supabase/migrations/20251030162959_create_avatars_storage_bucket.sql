/*
  # Create Avatars Storage Bucket

  1. Storage Setup
    - Create a public bucket named 'avatars' for storing user profile photos
    
  2. Security
    - Bucket is public for read access
    - Users can only manage their own avatars through folder structure
    
  3. Important Notes
    - File size limits are enforced at the application level
    - Supported formats: JPEG, PNG, WebP
    - Maximum file size: 2MB (enforced in app)
    - Files are stored in user-specific folders: avatars/{user_id}/avatar.jpg
*/

-- Create the avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 
  'avatars', 
  true,
  2097152, -- 2MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']::text[];