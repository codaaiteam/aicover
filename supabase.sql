-- Create extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.videos;
DROP TABLE IF EXISTS public.users;

-- Create a secure schema
CREATE SCHEMA IF NOT EXISTS auth;

-- Create users table
CREATE TABLE IF NOT EXISTS auth.users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  clerk_user_id TEXT UNIQUE NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS auth.orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL REFERENCES auth.users(email),
  amount NUMERIC NOT NULL,
  credits INTEGER NOT NULL,
  payment_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create videos table
CREATE TABLE IF NOT EXISTS auth.videos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL REFERENCES auth.users(email),
  title TEXT,
  description TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_videos_user_email ON auth.videos(user_email);
CREATE INDEX idx_users_clerk_id ON auth.users(clerk_user_id);

-- Insert test user with credits
INSERT INTO auth.users (
    email,
    clerk_user_id,
    credits
) VALUES (
    'test@example.com',  
    'user_2XhWHXnXXXXXXXXXXXXXXXXXX',  
    100  
) ON CONFLICT (email) DO UPDATE SET credits = 100;

-- Insert test video
INSERT INTO auth.videos (
    user_email,
    title,
    description,
    url,
    thumbnail_url,
    duration,
    created_at
) VALUES (
    'test@example.com',  
    'Test Video',
    'This is a test video',
    'https://example.com/video.mp4',
    'https://example.com/thumbnail.jpg',
    3600,
    now()
);

-- Insert latest video
INSERT INTO auth.videos (
    user_email,
    title,
    description,
    url,
    thumbnail_url,
    duration,
    created_at
) VALUES (
    'test@example.com',  
    'Latest Video',
    'This is the latest video',
    'https://example.com/latest-video.mp4',
    'https://example.com/latest-thumbnail.jpg',
    3600,
    now()
);

-- Create RLS policies
CREATE POLICY "Users can read their own data"
  ON auth.users
  FOR SELECT
  USING (auth.uid() = clerk_user_id);

CREATE POLICY "Users can update their own data"
  ON auth.users
  FOR UPDATE
  USING (auth.uid() = clerk_user_id);

CREATE POLICY "Users can read their own orders"
  ON auth.orders
  FOR SELECT
  USING (email = (SELECT email FROM auth.users WHERE clerk_user_id = auth.uid()));

CREATE POLICY "System can insert orders"
  ON auth.orders
  FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Users can read their own videos"
  ON auth.videos
  FOR SELECT
  USING (user_email = (SELECT email FROM auth.users WHERE clerk_user_id = auth.uid()));

CREATE POLICY "Users can insert their own videos"
  ON auth.videos
  FOR INSERT
  WITH CHECK (user_email = (SELECT email FROM auth.users WHERE clerk_user_id = auth.uid()));

CREATE POLICY "Users can update their own videos"
  ON auth.videos
  FOR UPDATE
  USING (user_email = (SELECT email FROM auth.users WHERE clerk_user_id = auth.uid()));

CREATE POLICY "Users can delete their own videos"
  ON auth.videos
  FOR DELETE
  USING (user_email = (SELECT email FROM auth.users WHERE clerk_user_id = auth.uid()));
