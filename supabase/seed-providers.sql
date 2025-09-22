-- ============================================
-- Seed sample providers for Illia platform
-- Run this in Supabase SQL Editor
-- ============================================

-- First, ensure the status column exists
ALTER TABLE providers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Clear existing test data (optional - comment out if you want to keep existing data)
-- DELETE FROM providers WHERE email LIKE '%@example.com';

-- Insert Medellín providers
INSERT INTO providers (
  name, email, phone, whatsapp, bio, city, neighborhood,
  services, languages, specialties, years_experience,
  rate_monthly, availability, status, verified, active, rating
) VALUES
-- Medellín Providers
('Maria Rodriguez', 'maria.r@example.com', '+57 300 123 4567', '+57 300 123 4567',
 'Professional house cleaner with 10+ years serving the expat community. I specialize in eco-friendly products and have excellent references from El Poblado residents.',
 'medellin', 'El Poblado',
 ARRAY['cleaning', 'deep-clean'], ARRAY['es', 'en'],
 ARRAY['eco-friendly', 'pet-friendly', 'references-available'],
 10, 800000, 'Monday-Friday mornings', 'verified', true, true, 4.8),

('Carlos Martinez', 'carlos.m@example.com', '+57 301 234 5678', '+57 301 234 5678',
 'Expert chef specializing in Colombian and international cuisine. I offer meal prep, cooking classes, and special diet accommodations.',
 'medellin', 'Laureles',
 ARRAY['cooking', 'meal-prep'], ARRAY['es', 'en', 'pt'],
 ARRAY['vegan-options', 'meal-planning', 'cooking-classes'],
 12, 1200000, 'Flexible schedule', 'verified', true, true, 4.9),

('Ana Sofia Gomez', 'ana.gomez@example.com', '+57 302 345 6789', '+57 302 345 6789',
 'Reliable cleaning and organization specialist. Great with pets and children. I bring my own supplies.',
 'medellin', 'Envigado',
 ARRAY['cleaning', 'organization'], ARRAY['es'],
 ARRAY['child-friendly', 'pet-friendly', 'supplies-included'],
 5, 600000, 'Weekdays and weekends', 'verified', true, true, 4.6),

('Luis Reyes', 'luis.reyes@example.com', '+57 303 456 7890', '+57 303 456 7890',
 'Professional cleaning and home maintenance. I speak English and can help with minor repairs.',
 'medellin', 'El Poblado',
 ARRAY['cleaning', 'deep-clean'], ARRAY['es', 'en'],
 ARRAY['maintenance', 'handyman-services', 'english-speaker'],
 8, 900000, 'Monday-Saturday', 'verified', true, true, 4.7),

('Patricia Herrera', 'patricia.h@example.com', '+57 304 567 8901', '+57 304 567 8901',
 'Colombian cuisine expert and meal prep specialist. I can accommodate special diets and teach cooking.',
 'medellin', 'Laureles',
 ARRAY['cooking', 'meal-prep'], ARRAY['es', 'en'],
 ARRAY['colombian-cuisine', 'baking', 'diet-specialist'],
 15, 1000000, 'Flexible hours', 'verified', true, true, 4.9),

-- Florianópolis Providers
('Julia Santos', 'julia.s@example.com', '+55 48 99123 4567', '+55 48 99123 4567',
 'Professional cleaner serving expat community in Florianópolis. Eco-friendly products and flexible schedule.',
 'florianopolis', 'Lagoa da Conceição',
 ARRAY['cleaning', 'organization'], ARRAY['pt', 'en', 'es'],
 ARRAY['eco-friendly', 'beach-house-specialist', 'flexible-hours'],
 7, 800, 'Monday-Friday', 'verified', true, true, 4.9),

('Pedro Oliveira', 'pedro.o@example.com', '+55 48 99234 5678', '+55 48 99234 5678',
 'Brazilian and international cuisine chef. Meal prep, catering, and cooking classes available.',
 'florianopolis', 'Campeche',
 ARRAY['cooking', 'meal-prep'], ARRAY['pt', 'en'],
 ARRAY['brazilian-cuisine', 'seafood-specialist', 'catering'],
 10, 1000, 'All week', 'verified', true, true, 4.8),

('Fernanda Costa', 'fernanda.c@example.com', '+55 48 99345 6789', '+55 48 99345 6789',
 'House cleaning and laundry services. Experience with vacation rentals and Airbnb properties.',
 'florianopolis', 'Canasvieiras',
 ARRAY['cleaning', 'laundry'], ARRAY['pt', 'es'],
 ARRAY['airbnb-specialist', 'vacation-rental', 'laundry-service'],
 6, 700, 'Flexible schedule', 'verified', true, true, 4.7)

ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  whatsapp = EXCLUDED.whatsapp,
  bio = EXCLUDED.bio,
  city = EXCLUDED.city,
  neighborhood = EXCLUDED.neighborhood,
  services = EXCLUDED.services,
  languages = EXCLUDED.languages,
  specialties = EXCLUDED.specialties,
  years_experience = EXCLUDED.years_experience,
  rate_monthly = EXCLUDED.rate_monthly,
  availability = EXCLUDED.availability,
  status = EXCLUDED.status,
  verified = EXCLUDED.verified,
  active = EXCLUDED.active,
  rating = EXCLUDED.rating,
  updated_at = NOW();

-- Verify the data was inserted
SELECT
  name,
  city,
  neighborhood,
  services,
  languages,
  rate_monthly,
  rating,
  status
FROM providers
WHERE active = true
ORDER BY city, rating DESC;

-- Show summary
DO $$
DECLARE
  medellin_count INTEGER;
  floripa_count INTEGER;
  total_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO medellin_count FROM providers WHERE city = 'medellin' AND active = true;
  SELECT COUNT(*) INTO floripa_count FROM providers WHERE city = 'florianopolis' AND active = true;
  SELECT COUNT(*) INTO total_count FROM providers WHERE active = true;

  RAISE NOTICE '✅ Seed data complete!';
  RAISE NOTICE 'Active providers in Medellín: %', medellin_count;
  RAISE NOTICE 'Active providers in Florianópolis: %', floripa_count;
  RAISE NOTICE 'Total active providers: %', total_count;
END $$;