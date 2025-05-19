/*
  # Add metadata fields to posts table

  1. Changes
    - Add metadata columns to posts table:
      - meta_title (text)
      - meta_description (text)
      - focus_keyword (text)
      - tags (text[])
      - wordpress_status (text)
      - is_hidden (boolean)
*/

-- Add metadata columns
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS focus_keyword text,
ADD COLUMN IF NOT EXISTS tags text[],
ADD COLUMN IF NOT EXISTS wordpress_status text DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS is_hidden boolean DEFAULT false;

-- Update RLS policies to include new columns
DROP POLICY IF EXISTS "Users can read own posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;

CREATE POLICY "Users can read own posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);