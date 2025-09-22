-- Seed data for Illia.club
-- This creates sample service providers for testing

-- Insert sample service providers for Medellín
INSERT INTO public.service_providers (name, email, phone, whatsapp, bio, city, neighborhood, services, languages, specialties, years_experience, rate_monthly, availability, status, featured, rating_avg, reviews_count)
VALUES
-- Medellín Providers
('Maria Rodriguez', 'maria.r@email.com', '+57 300 123 4567', '+57 300 123 4567',
 'Professional house cleaner with 10+ years of experience serving the expat community in El Poblado. I use eco-friendly products and speak conversational English. Reliable, thorough, and pet-friendly!',
 'medellin', 'El Poblado', ARRAY['cleaning', 'deep-clean', 'organization'], ARRAY['es', 'en'],
 ARRAY['eco-friendly', 'pet-friendly', 'english-speaker'], 8, 80000, 'Monday-Friday mornings', 'verified', true, 4.8, 24),

('Carlos Martinez', 'carlos.m@email.com', '+57 301 234 5678', '+57 301 234 5678',
 'Expert chef specializing in Colombian cuisine and international dishes. I offer meal prep services and cooking classes. Perfect for busy professionals who want healthy, delicious home-cooked meals.',
 'medellin', 'Laureles', ARRAY['cooking', 'meal-prep'], ARRAY['es', 'en', 'pt'],
 ARRAY['vegan-options', 'meal-planning', 'colombian-cuisine'], 12, 120000, 'Flexible schedule', 'verified', true, 4.9, 18),

('Ana Sofia Gomez', 'ana.gomez@email.com', '+57 302 345 6789', '+57 302 345 6789',
 'Dedicated cleaner and organizer. I help expats settle into their new homes with deep cleaning and organization services. Great with pets and children!',
 'medellin', 'Envigado', ARRAY['cleaning', 'organization', 'laundry'], ARRAY['es'],
 ARRAY['pet-friendly', 'child-friendly', 'deep-cleaning'], 5, 60000, 'Weekdays and weekends', 'verified', false, 4.6, 12),

('Luis Fernando Reyes', 'luis.reyes@email.com', '+57 303 456 7890', '+57 303 456 7890',
 'Professional home services including cleaning, minor repairs, and maintenance. Trusted by the Poblado expat community for 6 years. English speaking.',
 'medellin', 'El Poblado', ARRAY['cleaning', 'maintenance'], ARRAY['es', 'en'],
 ARRAY['english-speaker', 'handyman-services'], 6, 90000, 'Monday-Saturday', 'verified', false, 4.7, 15),

('Patricia Herrera', 'patricia.h@email.com', '+57 304 567 8901', '+57 304 567 8901',
 'Experienced cook offering authentic Colombian meals and international cuisine. Meal prep specialist with options for special diets. Weekly menu planning available.',
 'medellin', 'Laureles', ARRAY['cooking', 'meal-prep', 'catering'], ARRAY['es', 'en'],
 ARRAY['dietary-restrictions', 'event-catering', 'weekly-menus'], 10, 100000, 'Flexible', 'verified', true, 4.9, 20),

('Diego Alvarez', 'diego.a@email.com', '+57 305 678 9012', '+57 305 678 9012',
 'Reliable cleaning service for homes and Airbnbs. Quick, efficient, and detail-oriented. Same-day service available.',
 'medellin', 'El Poblado', ARRAY['cleaning', 'deep-clean'], ARRAY['es', 'en'],
 ARRAY['airbnb-cleaning', 'same-day-service'], 4, 70000, 'Daily availability', 'verified', false, 4.5, 8),

('Valentina Castro', 'valentina.c@email.com', '+57 306 789 0123', '+57 306 789 0123',
 'Home organizer and cleaner specializing in minimalist living. I help expats declutter and maintain beautiful, functional spaces.',
 'medellin', 'Envigado', ARRAY['organization', 'cleaning'], ARRAY['es', 'en'],
 ARRAY['minimalist', 'decluttering', 'space-planning'], 3, 75000, 'Tuesday-Saturday', 'verified', false, 4.7, 10),

('Roberto Jimenez', 'roberto.j@email.com', '+57 307 890 1234', '+57 307 890 1234',
 'Professional chef with restaurant experience. Offering personal chef services, dinner parties, and cooking lessons. Specializing in fusion cuisine.',
 'medellin', 'El Poblado', ARRAY['cooking', 'catering', 'cooking-classes'], ARRAY['es', 'en', 'fr'],
 ARRAY['fine-dining', 'fusion-cuisine', 'dinner-parties'], 15, 150000, 'By appointment', 'verified', true, 5.0, 30),

('Isabella Moreno', 'isabella.m@email.com', '+57 308 901 2345', '+57 308 901 2345',
 'Eco-conscious cleaning service using only natural products. Perfect for families with allergies or environmental concerns.',
 'medellin', 'Laureles', ARRAY['cleaning', 'deep-clean'], ARRAY['es', 'en'],
 ARRAY['eco-friendly', 'allergy-friendly', 'natural-products'], 7, 85000, 'Monday-Friday', 'verified', false, 4.8, 14),

('Alejandro Ruiz', 'alejandro.r@email.com', '+57 309 012 3456', '+57 309 012 3456',
 'Complete home services: cleaning, laundry, and light cooking. One-stop solution for busy professionals.',
 'medellin', 'El Poblado', ARRAY['cleaning', 'laundry', 'cooking'], ARRAY['es'],
 ARRAY['all-inclusive', 'time-saver'], 6, 110000, 'Full-time availability', 'verified', false, 4.6, 11),

-- Florianópolis Providers
('Julia Santos', 'julia.s@email.com', '+55 48 99123 4567', '+55 48 99123 4567',
 'Professional cleaning and organization services in Lagoa and surrounding areas. Fluent in English and Spanish. Specialized in beach home maintenance.',
 'florianopolis', 'Lagoa', ARRAY['cleaning', 'organization'], ARRAY['pt', 'en', 'es'],
 ARRAY['beach-homes', 'english-speaker', 'spanish-speaker'], 9, 80000, 'Flexible schedule', 'verified', true, 4.9, 22),

('Pedro Oliveira', 'pedro.o@email.com', '+55 48 99234 5678', '+55 48 99234 5678',
 'Personal chef specializing in Brazilian cuisine and healthy meal prep. Vegetarian and vegan options available. Serving the expat community for 8 years.',
 'florianopolis', 'Campeche', ARRAY['cooking', 'meal-prep'], ARRAY['pt', 'en'],
 ARRAY['brazilian-cuisine', 'vegetarian', 'vegan'], 8, 100000, 'Monday-Saturday', 'verified', true, 4.8, 19),

('Mariana Costa', 'mariana.c@email.com', '+55 48 99345 6789', '+55 48 99345 6789',
 'Reliable house cleaning with attention to detail. Experience with vacation rentals and long-term residents. Pet-friendly service.',
 'florianopolis', 'Centro', ARRAY['cleaning', 'laundry'], ARRAY['pt', 'en'],
 ARRAY['pet-friendly', 'vacation-rentals'], 5, 70000, 'Daily except Sundays', 'verified', false, 4.7, 13),

('Ricardo Ferreira', 'ricardo.f@email.com', '+55 48 99456 7890', '+55 48 99456 7890',
 'Home services including cleaning, basic maintenance, and garden care. Trusted by the Lagoa expat community.',
 'florianopolis', 'Lagoa', ARRAY['cleaning', 'maintenance', 'gardening'], ARRAY['pt', 'es'],
 ARRAY['garden-care', 'handyman', 'spanish-speaker'], 10, 90000, 'Monday-Friday', 'verified', false, 4.6, 9),

('Beatriz Almeida', 'beatriz.a@email.com', '+55 48 99567 8901', '+55 48 99567 8901',
 'Professional organizer and cleaning specialist. I help create peaceful, organized living spaces. Experience with minimalist and sustainable living.',
 'florianopolis', 'Campeche', ARRAY['organization', 'cleaning', 'deep-clean'], ARRAY['pt', 'en'],
 ARRAY['minimalist', 'sustainable-living', 'english-speaker'], 4, 75000, 'Tuesday-Saturday', 'verified', false, 4.8, 16),

('Fernando Silva', 'fernando.s@email.com', '+55 48 99678 9012', '+55 48 99678 9012',
 'Chef with international experience offering catering, meal prep, and cooking classes. Specializing in seafood and traditional Brazilian dishes.',
 'florianopolis', 'Centro', ARRAY['cooking', 'catering', 'meal-prep'], ARRAY['pt', 'en', 'it'],
 ARRAY['seafood', 'brazilian-cuisine', 'italian-cuisine'], 12, 130000, 'By appointment', 'verified', true, 4.9, 25),

('Carolina Rodrigues', 'carolina.r@email.com', '+55 48 99789 0123', '+55 48 99789 0123',
 'Eco-friendly cleaning service using biodegradable products. Perfect for beach homes and environmentally conscious clients.',
 'florianopolis', 'Lagoa', ARRAY['cleaning', 'deep-clean'], ARRAY['pt', 'en'],
 ARRAY['eco-friendly', 'beach-homes', 'biodegradable-products'], 6, 85000, 'Monday-Saturday', 'verified', false, 4.7, 12),

('Lucas Mendes', 'lucas.m@email.com', '+55 48 99890 1234', '+55 48 99890 1234',
 'Complete home care services including cleaning, laundry, and light meal preparation. Reliable and trustworthy.',
 'florianopolis', 'Campeche', ARRAY['cleaning', 'laundry', 'cooking'], ARRAY['pt'],
 ARRAY['all-inclusive', 'reliable'], 5, 95000, 'Full week availability', 'verified', false, 4.5, 8),

('Amanda Barbosa', 'amanda.b@email.com', '+55 48 99901 2345', '+55 48 99901 2345',
 'Professional cleaner specializing in deep cleaning and organization. Great with pets and children. English speaking.',
 'florianopolis', 'Centro', ARRAY['cleaning', 'deep-clean', 'organization'], ARRAY['pt', 'en'],
 ARRAY['pet-friendly', 'child-friendly', 'english-speaker'], 7, 80000, 'Weekdays', 'verified', false, 4.8, 15),

('Gabriel Sousa', 'gabriel.s@email.com', '+55 48 99012 3456', '+55 48 99012 3456',
 'Personal chef and nutritionist offering healthy meal prep services. Customized menus for specific dietary needs.',
 'florianopolis', 'Lagoa', ARRAY['cooking', 'meal-prep'], ARRAY['pt', 'en', 'es'],
 ARRAY['nutrition', 'dietary-planning', 'healthy-meals'], 8, 110000, 'Monday-Friday', 'verified', true, 4.9, 20);

-- Insert some sample reviews
INSERT INTO public.reviews (provider_id, user_id, rating, comment, services_used, would_recommend)
SELECT
    sp.id,
    '00000000-0000-0000-0000-000000000001'::uuid, -- Placeholder user ID
    4 + (RANDOM())::INTEGER,
    'Great service! Very professional and reliable.',
    sp.services[1:1],
    true
FROM public.service_providers sp
LIMIT 10;

-- Insert sample community threads
INSERT INTO public.community_threads (user_id, title, body, category, city_tag)
VALUES
('00000000-0000-0000-0000-000000000001'::uuid,
 'Best neighborhoods for expats in Medellín?',
 'Hi everyone! I''m moving to Medellín next month and wondering which neighborhoods are best for expats. I''ve heard good things about El Poblado and Laureles. Any recommendations?',
 'housing', 'medellin'),

('00000000-0000-0000-0000-000000000001'::uuid,
 'Reliable cleaning services in Florianópolis',
 'Looking for recommendations for trustworthy cleaning services in Florianópolis, specifically in the Lagoa area. English speaking would be a plus!',
 'services', 'florianopolis'),

('00000000-0000-0000-0000-000000000001'::uuid,
 'Visa renewal process in Colombia - Tips?',
 'Has anyone recently gone through the visa renewal process in Colombia? Would appreciate any tips or advice on making it smoother.',
 'visa', 'medellin'),

('00000000-0000-0000-0000-000000000001'::uuid,
 'Weekly meal prep services - Worth it?',
 'Thinking about hiring someone for weekly meal prep. For those who use this service, is it worth the cost? How much do you typically pay?',
 'services', null),

('00000000-0000-0000-0000-000000000001'::uuid,
 'Expat meetup this Friday in El Poblado',
 'Organizing an informal expat meetup this Friday at 7 PM in El Poblado. Everyone welcome! Let''s share experiences and help newcomers.',
 'expat-life', 'medellin');