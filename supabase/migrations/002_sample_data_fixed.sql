-- Sample Data for Illia.club MVP (Fixed Version)
-- Date: September 22, 2025
-- Description: Realistic sample data that doesn't require auth.users

-- Sample service providers for Medellín (no user_id required)
INSERT INTO service_providers (
  name, bio, city, languages, services, specialties,
  rate_hourly, rate_weekly, rate_monthly, currency,
  years_experience, whatsapp_number, email, status, verified_at, featured
) VALUES
  (
    'María Rodríguez',
    'Professional house cleaner with 10+ years experience serving the expat community in El Poblado. I speak fluent English and specialize in eco-friendly cleaning products. Available for weekly or bi-weekly service.',
    'medellin',
    ARRAY['spanish', 'english']::language[],
    ARRAY['cleaning']::service_category[],
    ARRAY['eco-friendly', 'pet-friendly', 'deep cleaning'],
    50000, 180000, 650000, 'COP',
    10, '+57 300 123 4567', 'maria.cleaning@email.com',
    'verified', NOW(), true
  ),
  (
    'Carlos Martínez',
    'Experienced chef offering meal prep and cooking services. Specialized in Colombian cuisine with international options. Perfect for busy professionals who want healthy, home-cooked meals.',
    'medellin',
    ARRAY['spanish', 'english']::language[],
    ARRAY['cooking', 'meal_prep']::service_category[],
    ARRAY['colombian cuisine', 'meal planning', 'vegan options'],
    60000, 220000, 800000, 'COP',
    8, '+57 310 234 5678', 'carlos.chef@email.com',
    'verified', NOW(), true
  ),
  (
    'Ana Gómez',
    'Reliable cleaning and organizing specialist. I help expats maintain tidy homes with flexible scheduling. Experience with Airbnb turnovers.',
    'medellin',
    ARRAY['spanish']::language[],
    ARRAY['cleaning']::service_category[],
    ARRAY['organization', 'airbnb cleaning', 'laundry service'],
    45000, 160000, 580000, 'COP',
    6, '+57 320 345 6789', 'ana.gomez@email.com',
    'verified', NOW(), false
  ),
  (
    'Laura Silva',
    'English-speaking nanny and babysitter. CPR certified with references from international families. Available for regular or occasional childcare.',
    'medellin',
    ARRAY['spanish', 'english', 'portuguese']::language[],
    ARRAY['childcare']::service_category[],
    ARRAY['infant care', 'homework help', 'meal preparation'],
    55000, 200000, 750000, 'COP',
    12, '+57 315 456 7890', 'laura.nanny@email.com',
    'verified', NOW(), false
  ),
  (
    'Diego Hernández',
    'Handyman services for expats. From small repairs to furniture assembly, I handle it all. English speaking with transparent pricing.',
    'medellin',
    ARRAY['spanish', 'english']::language[],
    ARRAY['handyman']::service_category[],
    ARRAY['electrical', 'plumbing', 'furniture assembly', 'painting'],
    70000, NULL, NULL, 'COP',
    15, '+57 301 567 8901', 'diego.handyman@email.com',
    'verified', NOW(), false
  );

-- Sample service providers for Florianópolis
INSERT INTO service_providers (
  name, bio, city, languages, services, specialties,
  rate_hourly, rate_weekly, rate_monthly, currency,
  years_experience, whatsapp_number, email, status, verified_at, featured
) VALUES
  (
    'Fernanda Santos',
    'Professional cleaner serving the expat community in Florianópolis. Trustworthy, punctual, and detail-oriented. I bring my own supplies.',
    'florianopolis',
    ARRAY['portuguese', 'english']::language[],
    ARRAY['cleaning']::service_category[],
    ARRAY['beach house cleaning', 'eco-friendly', 'post-construction'],
    80, 300, 1100, 'BRL',
    7, '+55 48 9123 4567', 'fernanda.clean@email.com',
    'verified', NOW(), true
  ),
  (
    'João Paulo',
    'Personal chef and meal prep specialist. Mediterranean and Brazilian fusion cuisine. Perfect for health-conscious expats.',
    'florianopolis',
    ARRAY['portuguese', 'english', 'spanish']::language[],
    ARRAY['cooking', 'meal_prep']::service_category[],
    ARRAY['mediterranean', 'keto friendly', 'seafood specialist'],
    100, 380, 1400, 'BRL',
    9, '+55 48 9234 5678', 'joao.chef@email.com',
    'verified', NOW(), true
  ),
  (
    'Beatriz Oliveira',
    'Experienced pet sitter and dog walker. Your pets will be in loving hands while you travel or work. Serving Lagoa and nearby areas.',
    'florianopolis',
    ARRAY['portuguese', 'english']::language[],
    ARRAY['pet_care']::service_category[],
    ARRAY['dog walking', 'pet sitting', 'pet grooming'],
    60, 220, 800, 'BRL',
    5, '+55 48 9345 6789', 'bea.pets@email.com',
    'verified', NOW(), false
  ),
  (
    'Roberto Costa',
    'Garden maintenance and landscaping. Transform your outdoor space into a tropical paradise. English speaking.',
    'florianopolis',
    ARRAY['portuguese', 'english']::language[],
    ARRAY['gardening']::service_category[],
    ARRAY['landscaping', 'pool maintenance', 'tropical plants'],
    75, NULL, 1000, 'BRL',
    11, '+55 48 9456 7890', 'roberto.garden@email.com',
    'verified', NOW(), false
  ),
  (
    'Lucia Mendes',
    'Reliable house cleaning with a personal touch. Specialized in vacation rentals and long-term residences. Flexible scheduling available.',
    'florianopolis',
    ARRAY['portuguese', 'spanish']::language[],
    ARRAY['cleaning']::service_category[],
    ARRAY['vacation rentals', 'deep cleaning', 'organization'],
    70, 250, 900, 'BRL',
    8, '+55 48 9567 8901', 'lucia.clean@email.com',
    'verified', NOW(), false
  );

-- Pending providers (not yet verified)
INSERT INTO service_providers (
  name, bio, city, languages, services, specialties,
  rate_hourly, rate_weekly, rate_monthly, currency,
  years_experience, whatsapp_number, email, status
) VALUES
  (
    'Pedro Alves',
    'New to the platform. Offering general cleaning services in Medellín.',
    'medellin',
    ARRAY['spanish']::language[],
    ARRAY['cleaning']::service_category[],
    ARRAY['general cleaning'],
    40000, 150000, 550000, 'COP',
    3, '+57 305 678 9012', 'pedro@email.com',
    'pending'
  ),
  (
    'Isabella Rocha',
    'Cooking services in Florianópolis. Traditional Brazilian dishes.',
    'florianopolis',
    ARRAY['portuguese']::language[],
    ARRAY['cooking']::service_category[],
    ARRAY['brazilian cuisine'],
    85, 320, 1200, 'BRL',
    4, '+55 48 9678 9012', 'isabella@email.com',
    'pending'
  );

-- Function to safely add community threads after auth is set up
CREATE OR REPLACE FUNCTION add_sample_threads()
RETURNS void AS $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Get the first user from auth.users if exists
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;

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
      );

    -- Update some stats for realism
    UPDATE community_threads SET views_count = 127, replies_count = 2, is_pinned = false
    WHERE title LIKE 'Best areas in Medellín%';

    UPDATE community_threads SET views_count = 89, replies_count = 1
    WHERE title LIKE 'Reliable cleaning service%';

    UPDATE community_threads SET views_count = 234, replies_count = 0, is_pinned = true
    WHERE title LIKE 'Weekly expat meetup%';

    -- Add sample thread posts
    INSERT INTO thread_posts (
      thread_id, user_id, body
    )
    SELECT
      t.id,
      test_user_id,
      CASE
        WHEN t.title LIKE 'Best areas in Medellín%' THEN
          'I''ve been living in El Poblado with my family for 2 years. It''s very safe and has great restaurants, but can be pricey. For families, I''d also recommend looking at Envigado - it''s quieter, more affordable, and still very safe with good schools nearby.'
        WHEN t.title LIKE 'Reliable cleaning service%' THEN
          'I use María from this platform - she''s been cleaning my apartment for 6 months now. Very reliable and speaks good English. Current rate is 50,000 COP per visit for a 2BR.'
        ELSE NULL
      END as body
    FROM community_threads t
    WHERE t.title IN (
      'Best areas in Medellín for expats with families?',
      'Reliable cleaning service needed in El Poblado'
    )
    AND CASE
        WHEN t.title LIKE 'Best areas in Medellín%' THEN 'I''ve been living in El Poblado with my family for 2 years. It''s very safe and has great restaurants, but can be pricey. For families, I''d also recommend looking at Envigado - it''s quieter, more affordable, and still very safe with good schools nearby.'
        WHEN t.title LIKE 'Reliable cleaning service%' THEN 'I use María from this platform - she''s been cleaning my apartment for 6 months now. Very reliable and speaks good English. Current rate is 50,000 COP per visit for a 2BR.'
        ELSE NULL
      END IS NOT NULL;

    -- Add sample reviews (only if user exists)
    INSERT INTO reviews (
      provider_id, user_id, rating, comment, service_date
    )
    SELECT
      p.id,
      test_user_id,
      5,
      CASE
        WHEN p.name = 'María Rodríguez' THEN 'María is fantastic! Always on time, very thorough, and trustworthy. She even helps with organizing. Highly recommend!'
        WHEN p.name = 'Carlos Martínez' THEN 'Carlos meal prep service has been a game changer. Delicious, healthy meals delivered twice a week. Great variety and very accommodating with dietary restrictions.'
        WHEN p.name = 'Fernanda Santos' THEN 'Good service overall. Fernanda is reliable and does quality work. Only minor issue was scheduling conflicts a couple of times.'
      END,
      CURRENT_DATE - INTERVAL '7 days'
    FROM service_providers p
    WHERE p.name IN ('María Rodríguez', 'Carlos Martínez', 'Fernanda Santos')
    LIMIT 3;

    RAISE NOTICE 'Sample threads and related data added successfully';
  ELSE
    RAISE NOTICE 'No users found in auth.users. Skipping thread/review creation. Run this function after creating users.';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Try to add threads now (will skip if no users exist)
SELECT add_sample_threads();

-- Clean up the function
DROP FUNCTION IF EXISTS add_sample_threads();