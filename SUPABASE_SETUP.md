# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `dance-battle`
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
6. Click "Create new project"

## 2. Get Project Credentials

1. Go to Settings → API
2. Copy the following:
   - Project URL (e.g., `https://your-project.supabase.co`)
   - Anon public key (starts with `eyJ...`)

## 3. Update App Configuration

Update `lib/supabase.ts` with your credentials:

```typescript
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key-here';
```

## 4. Set Up Database Schema

Run the following SQL in your Supabase SQL Editor:

```sql
-- Drop existing tables and views if they exist (to start fresh)
DROP VIEW IF EXISTS public.leaderboard CASCADE;
DROP TABLE IF EXISTS public.videos CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create users table (public profile data)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create videos table
CREATE TABLE public.videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  score DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leaderboard view
CREATE VIEW public.leaderboard AS
SELECT 
  v.id,
  v.user_id,
  v.id as video_id,
  v.score,
  ROW_NUMBER() OVER (ORDER BY v.score DESC) as rank,
  u.email,
  u.username,
  u.full_name,
  u.avatar_url,
  u.created_at as user_created_at,
  u.updated_at as user_updated_at,
  v.title as video_title,
  v.description as video_description,
  v.video_url,
  v.thumbnail_url,
  v.duration,
  v.likes_count,
  v.views_count,
  v.created_at as video_created_at,
  v.updated_at as video_updated_at
FROM public.videos v
JOIN public.users u ON v.user_id = u.id
ORDER BY v.score DESC;

-- Enable Row Level Security on TABLES only
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can read all users" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for videos table
CREATE POLICY "Videos can be read by everyone" ON public.videos
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own videos" ON public.videos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own videos" ON public.videos
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 5. Set Up Authentication

1. Go to Authentication → Settings
2. Configure the following:
   - Site URL: `exp://localhost:19000` (for development)
   - Redirect URLs: Add your app's redirect URLs
3. Enable email authentication
4. Configure email templates (optional)

## 6. Test the Setup

1. Start your app: `npm start`
2. Try registering a new user
3. Check the Supabase dashboard to see if the user was created
4. Verify the database tables have the correct structure

## 7. Production Setup

For production deployment:

1. Update Site URL to your production domain
2. Add production redirect URLs
3. Configure custom SMTP (optional)
4. Set up proper CORS policies
5. Enable email confirmations for production

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your app's URL is in the allowed origins
2. **RLS Policies**: Check that your Row Level Security policies are correct
3. **Database Connection**: Verify your project URL and API key are correct
4. **Authentication**: Ensure email authentication is enabled

### Useful Commands

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check RLS policies
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Reset database (careful!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

## Security Notes

- Never commit your Supabase keys to version control
- Use environment variables for production
- Regularly rotate your API keys
- Monitor your database for unusual activity
- Set up proper backup strategies


