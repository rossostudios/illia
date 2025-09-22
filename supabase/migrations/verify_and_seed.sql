-- ============================================
-- Verify existing schema and add sample data
-- Your database already has the tables!
-- ============================================

-- Check if providers table has data
SELECT COUNT(*) as provider_count FROM providers;

-- If no providers exist, add sample data
INSERT INTO providers (
    name, email, phone, city, services, languages,
    rate_monthly, active, verified, rating
)
SELECT * FROM (VALUES
    ('Maria Rodriguez', 'maria.r@example.com', '+57 300 123 4567',
     'medellin', ARRAY['cleaning', 'deep-clean'], ARRAY['es', 'en'],
     80000, true, true, 4.8),

    ('Carlos Martinez', 'carlos.m@example.com', '+57 301 234 5678',
     'medellin', ARRAY['cooking', 'meal-prep'], ARRAY['es', 'en', 'pt'],
     120000, true, true, 4.9),

    ('Ana Sofia Gomez', 'ana.gomez@example.com', '+57 302 345 6789',
     'medellin', ARRAY['cleaning', 'organization'], ARRAY['es'],
     60000, true, true, 4.6),

    ('Luis Reyes', 'luis.reyes@example.com', '+57 303 456 7890',
     'medellin', ARRAY['cleaning', 'maintenance'], ARRAY['es', 'en'],
     90000, true, true, 4.7),

    ('Patricia Herrera', 'patricia.h@example.com', '+57 304 567 8901',
     'medellin', ARRAY['cooking', 'meal-prep'], ARRAY['es', 'en'],
     100000, true, true, 4.9),

    ('Julia Santos', 'julia.s@example.com', '+55 48 99123 4567',
     'florianopolis', ARRAY['cleaning', 'organization'], ARRAY['pt', 'en', 'es'],
     80000, true, true, 4.9),

    ('Pedro Oliveira', 'pedro.o@example.com', '+55 48 99234 5678',
     'florianopolis', ARRAY['cooking', 'meal-prep'], ARRAY['pt', 'en'],
     100000, true, true, 4.8)
) AS v(name, email, phone, city, services, languages, rate_monthly, active, verified, rating)
WHERE NOT EXISTS (SELECT 1 FROM providers WHERE email = v.email);

-- Check the results
SELECT
    name,
    city,
    services,
    languages,
    rate_monthly,
    rating
FROM providers
ORDER BY city, name
LIMIT 10;

-- Success message
DO $$
DECLARE
    provider_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO provider_count FROM providers;
    RAISE NOTICE '✅ Database check complete!';
    RAISE NOTICE 'Total providers in database: %', provider_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Your application is ready to use with:';
    RAISE NOTICE '- Provider onboarding: /en/providers/onboard';
    RAISE NOTICE '- API endpoint: /api/providers';
    RAISE NOTICE '- Matches API: /api/matches';
END $$;