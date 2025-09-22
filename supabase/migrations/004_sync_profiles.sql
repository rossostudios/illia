-- Sync Profiles with Auth Users
-- Date: September 22, 2025
-- Description: Create profiles for existing auth users and add sample community data

-- First, create profiles for any auth.users that don't have profiles yet
INSERT INTO profiles (id, email, full_name, tier, city, languages, created_at)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)) as full_name,
  'free'::user_tier,
  'medellin'::city,
  ARRAY['english']::language[],
  created_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- Now add sample community threads (will work since profiles exist)
DO $$
DECLARE
  test_user_id UUID;
  thread_id UUID;
BEGIN
  -- Get the first user with a profile
  SELECT id INTO test_user_id FROM profiles LIMIT 1;

  -- Only proceed if we have a user
  IF test_user_id IS NOT NULL THEN
    -- Sample community threads
    INSERT INTO community_threads (
      user_id, title, body, category, city_tag, tags
    ) VALUES
      (
        test_user_id,
        'Best areas in Medellín for expats with families?',
        'Hi everyone! Moving to Medellín next month with my wife and 2 kids (8 and 10). We''re looking for safe, family-friendly neighborhoods with good access to international schools. Budget is around $1500-2000/month for rent. Any recommendations?',
        'housing',
        'medellin',
        ARRAY['housing', 'families', 'schools', 'safety']
      ),
      (
        test_user_id,
        'Reliable cleaning service needed in El Poblado',
        'Can anyone recommend a trustworthy cleaner for a 2BR apartment in El Poblado? Need someone who speaks at least basic English and can come twice a week. What are typical rates?',
        'services',
        'medellin',
        ARRAY['cleaning', 'el-poblado', 'recommendations']
      ),
      (
        test_user_id,
        'Florianópolis visa run experiences?',
        'Has anyone done a visa run from Floripa to Argentina recently? How was the process? Any tips for making it smooth?',
        'visa',
        'florianopolis',
        ARRAY['visa', 'travel', 'argentina', 'immigration']
      ),
      (
        test_user_id,
        'Weekly expat meetup in Laureles',
        'Hey all! Starting a weekly casual meetup for expats in Laureles. Every Thursday at 7pm at Pergamino Coffee. Come join us for drinks and networking!',
        'social',
        'medellin',
        ARRAY['meetup', 'laureles', 'networking', 'social']
      ),
      (
        test_user_id,
        'Best meal prep services in Floripa?',
        'Looking for healthy meal prep options in Florianópolis. Preferably someone who can accommodate keto diet. Any recommendations?',
        'services',
        'florianopolis',
        ARRAY['meal-prep', 'food', 'keto', 'health']
      )
    ON CONFLICT DO NOTHING;

    -- Update some stats for realism
    UPDATE community_threads SET views_count = 127, replies_count = 2
    WHERE title LIKE 'Best areas in Medellín%';

    UPDATE community_threads SET views_count = 89, replies_count = 1
    WHERE title LIKE 'Reliable cleaning service%';

    UPDATE community_threads SET views_count = 234, replies_count = 0, is_pinned = true
    WHERE title LIKE 'Weekly expat meetup%';

    -- Add a sample thread post
    SELECT id INTO thread_id FROM community_threads WHERE title LIKE 'Best areas in Medellín%' LIMIT 1;

    IF thread_id IS NOT NULL THEN
      INSERT INTO thread_posts (thread_id, user_id, body)
      VALUES (
        thread_id,
        test_user_id,
        'I''ve been living in El Poblado with my family for 2 years. It''s very safe and has great restaurants, but can be pricey. For families, I''d also recommend looking at Envigado - it''s quieter, more affordable, and still very safe with good schools nearby.'
      )
      ON CONFLICT DO NOTHING;
    END IF;

    -- Add sample reviews for providers
    INSERT INTO reviews (provider_id, user_id, rating, comment, service_date)
    SELECT
      p.id,
      test_user_id,
      CASE
        WHEN p.name = 'María Rodríguez' THEN 5
        WHEN p.name = 'Carlos Martínez' THEN 5
        WHEN p.name = 'Fernanda Santos' THEN 4
        ELSE 5
      END as rating,
      CASE
        WHEN p.name = 'María Rodríguez' THEN 'María is fantastic! Always on time, very thorough, and trustworthy. She even helps with organizing. Highly recommend!'
        WHEN p.name = 'Carlos Martínez' THEN 'Carlos meal prep service has been a game changer. Delicious, healthy meals delivered twice a week. Great variety and very accommodating with dietary restrictions.'
        WHEN p.name = 'Fernanda Santos' THEN 'Good service overall. Fernanda is reliable and does quality work. Only minor issue was scheduling conflicts a couple of times.'
        ELSE 'Great service! Highly recommended.'
      END as comment,
      CURRENT_DATE - INTERVAL '7 days'
    FROM service_providers p
    WHERE p.name IN ('María Rodríguez', 'Carlos Martínez', 'Fernanda Santos')
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Sample data added successfully for user %', test_user_id;
  ELSE
    RAISE NOTICE 'No users found in profiles table. Please create a user first.';
  END IF;
END;
$$;