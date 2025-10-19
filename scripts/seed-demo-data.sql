-- Demo data for Dance Battle app
-- Run this in your Supabase SQL editor after setting up the database

-- Insert demo users
INSERT INTO public.users (id, email, username, full_name, avatar_url) VALUES
  ('11111111-1111-1111-1111-111111111111', 'alex@example.com', 'dance_pro', 'Alex Johnson', 'https://picsum.photos/100/100?random=1'),
  ('22222222-2222-2222-2222-222222222222', 'sarah@example.com', 'ballet_queen', 'Sarah Williams', 'https://picsum.photos/100/100?random=2'),
  ('33333333-3333-3333-3333-333333333333', 'mike@example.com', 'street_king', 'Mike Rodriguez', 'https://picsum.photos/100/100?random=3'),
  ('44444444-4444-4444-4444-444444444444', 'elena@example.com', 'salsa_fire', 'Elena Martinez', 'https://picsum.photos/100/100?random=4'),
  ('55555555-5555-5555-5555-555555555555', 'jake@example.com', 'break_master', 'Jake Thompson', 'https://picsum.photos/100/100?random=5');

-- Insert demo videos
INSERT INTO public.videos (id, user_id, title, description, video_url, thumbnail_url, duration, likes_count, views_count, score) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Amazing Hip Hop Dance', 'Incredible hip hop performance with smooth moves', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'https://picsum.photos/400/600?random=1', 120, 1250, 15420, 95.5),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Contemporary Ballet', 'Elegant contemporary ballet performance', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 'https://picsum.photos/400/600?random=2', 95, 980, 12300, 92.3),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'Street Dance Battle', 'Intense street dance battle performance', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'https://picsum.photos/400/600?random=3', 180, 2100, 25600, 98.7),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 'Latin Salsa Fusion', 'Passionate salsa with modern fusion elements', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 'https://picsum.photos/400/600?random=4', 150, 1750, 18900, 94.1),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', 'Breakdance Showcase', 'Incredible breakdancing skills and power moves', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 'https://picsum.photos/400/600?random=5', 200, 3200, 42100, 97.8);

-- Additional demo videos for more content
INSERT INTO public.videos (id, user_id, title, description, video_url, thumbnail_url, duration, likes_count, views_count, score) VALUES
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '11111111-1111-1111-1111-111111111111', 'Urban Dance Fusion', 'Modern urban dance with contemporary elements', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 'https://picsum.photos/400/600?random=6', 140, 890, 11200, 91.2),
  ('gggggggg-gggg-gggg-gggg-gggggggggggg', '22222222-2222-2222-2222-222222222222', 'Classical Ballet Solo', 'Beautiful classical ballet performance', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', 'https://picsum.photos/400/600?random=7', 110, 1450, 18700, 93.8),
  ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '33333333-3333-3333-3333-333333333333', 'Krump Battle', 'High-energy krump dance battle', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', 'https://picsum.photos/400/600?random=8', 160, 2200, 28900, 96.4),
  ('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '44444444-4444-4444-4444-444444444444', 'Bachata Sensual', 'Romantic bachata dance performance', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', 'https://picsum.photos/400/600?random=9', 130, 1680, 20300, 94.7),
  ('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '55555555-5555-5555-5555-555555555555', 'Popping & Locking', 'Masterful popping and locking techniques', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', 'https://picsum.photos/400/600?random=10', 170, 2800, 35600, 98.1);

-- Verify the data
SELECT 
  u.username,
  u.full_name,
  COUNT(v.id) as video_count,
  AVG(v.score) as avg_score,
  SUM(v.likes_count) as total_likes
FROM public.users u
LEFT JOIN public.videos v ON u.id = v.user_id
GROUP BY u.id, u.username, u.full_name
ORDER BY avg_score DESC;

-- Check leaderboard
SELECT 
  rank,
  username,
  full_name,
  title,
  score,
  likes_count,
  views_count
FROM public.leaderboard
ORDER BY rank
LIMIT 10;



