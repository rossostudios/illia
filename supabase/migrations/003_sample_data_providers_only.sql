-- Sample Data for Service Providers Only
-- Date: September 22, 2025
-- Description: Add sample providers without requiring auth

-- Sample service providers for Medellín
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
  ),
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
  )
ON CONFLICT DO NOTHING;