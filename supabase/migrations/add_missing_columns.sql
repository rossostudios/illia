-- ============================================
-- Add missing columns and features to existing tables
-- This script adds what's missing to your current schema
-- ============================================

-- First, let's check what tables exist
DO $$
DECLARE
    providers_exists BOOLEAN;
    service_providers_exists BOOLEAN;
BEGIN
    -- Check if 'providers' table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'providers'
    ) INTO providers_exists;

    -- Check if 'service_providers' table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'service_providers'
    ) INTO service_providers_exists;

    -- If providers table exists, add missing columns
    IF providers_exists THEN
        -- Add status column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_schema = 'public'
                      AND table_name = 'providers'
                      AND column_name = 'status') THEN
            ALTER TABLE public.providers
            ADD COLUMN status TEXT DEFAULT 'pending';
        END IF;

        -- Add whatsapp column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_schema = 'public'
                      AND table_name = 'providers'
                      AND column_name = 'whatsapp') THEN
            ALTER TABLE public.providers
            ADD COLUMN whatsapp TEXT;
        END IF;

        -- Add bio column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_schema = 'public'
                      AND table_name = 'providers'
                      AND column_name = 'bio') THEN
            ALTER TABLE public.providers
            ADD COLUMN bio TEXT;
        END IF;

        -- Add specialties column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_schema = 'public'
                      AND table_name = 'providers'
                      AND column_name = 'specialties') THEN
            ALTER TABLE public.providers
            ADD COLUMN specialties TEXT[];
        END IF;

        -- Add years_experience column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_schema = 'public'
                      AND table_name = 'providers'
                      AND column_name = 'years_experience') THEN
            ALTER TABLE public.providers
            ADD COLUMN years_experience INTEGER;
        END IF;

        -- Add neighborhood column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_schema = 'public'
                      AND table_name = 'providers'
                      AND column_name = 'neighborhood') THEN
            ALTER TABLE public.providers
            ADD COLUMN neighborhood TEXT;
        END IF;

        -- Add featured column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_schema = 'public'
                      AND table_name = 'providers'
                      AND column_name = 'featured') THEN
            ALTER TABLE public.providers
            ADD COLUMN featured BOOLEAN DEFAULT false;
        END IF;

        -- Add rating_avg column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_schema = 'public'
                      AND table_name = 'providers'
                      AND column_name = 'rating_avg') THEN
            ALTER TABLE public.providers
            ADD COLUMN rating_avg DECIMAL(3, 2);
        END IF;

        -- Add reviews_count column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_schema = 'public'
                      AND table_name = 'providers'
                      AND column_name = 'reviews_count') THEN
            ALTER TABLE public.providers
            ADD COLUMN reviews_count INTEGER DEFAULT 0;
        END IF;

        -- Add rate_hourly column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_schema = 'public'
                      AND table_name = 'providers'
                      AND column_name = 'rate_hourly') THEN
            ALTER TABLE public.providers
            ADD COLUMN rate_hourly INTEGER;
        END IF;

        -- Add availability column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_schema = 'public'
                      AND table_name = 'providers'
                      AND column_name = 'availability') THEN
            ALTER TABLE public.providers
            ADD COLUMN availability TEXT;
        END IF;

        RAISE NOTICE 'Updated providers table with missing columns';
    ELSE
        -- If providers doesn't exist, create it
        CREATE TABLE IF NOT EXISTS public.providers (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            whatsapp TEXT,
            bio TEXT,
            photo_url TEXT,
            city TEXT NOT NULL,
            neighborhood TEXT,
            services TEXT[] NOT NULL,
            languages TEXT[] NOT NULL,
            specialties TEXT[],
            years_experience INTEGER,
            rate_hourly INTEGER,
            rate_monthly INTEGER,
            availability TEXT,
            rating DECIMAL(3, 2),
            rating_avg DECIMAL(3, 2),
            reviews_count INTEGER DEFAULT 0,
            status TEXT DEFAULT 'pending',
            featured BOOLEAN DEFAULT false,
            active BOOLEAN DEFAULT true,
            verified BOOLEAN DEFAULT false,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        RAISE NOTICE 'Created providers table';
    END IF;
END $$;

-- Create other missing tables
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    city TEXT NOT NULL,
    services TEXT[] NOT NULL,
    languages TEXT[],
    budget TEXT,
    frequency TEXT,
    preferences TEXT,
    quiz_completed_at TIMESTAMPTZ,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    explanation TEXT,
    ai_model TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, provider_id)
);

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
    user_id UUID,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(provider_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_providers_city ON public.providers(city);
CREATE INDEX IF NOT EXISTS idx_providers_services ON public.providers USING GIN(services);
CREATE INDEX IF NOT EXISTS idx_providers_languages ON public.providers USING GIN(languages);
CREATE INDEX IF NOT EXISTS idx_providers_active ON public.providers(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_providers_rating ON public.providers(rating DESC) WHERE rating IS NOT NULL;

-- Enable RLS
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies
DROP POLICY IF EXISTS "Anyone can view active providers" ON public.providers;
CREATE POLICY "Anyone can view active providers" ON public.providers
    FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
CREATE POLICY "Anyone can view reviews" ON public.reviews
    FOR SELECT USING (true);

-- Insert sample data if providers table is empty
INSERT INTO public.providers (name, email, phone, whatsapp, bio, city, neighborhood, services, languages, specialties, years_experience, rate_monthly, availability, status, featured, rating, active)
SELECT
    'Maria Rodriguez',
    'maria.r@example.com',
    '+57 300 123 4567',
    '+57 300 123 4567',
    'Professional house cleaner with 10+ years of experience serving the expat community in El Poblado.',
    'medellin',
    'El Poblado',
    ARRAY['cleaning', 'deep-clean'],
    ARRAY['es', 'en'],
    ARRAY['eco-friendly', 'pet-friendly'],
    10,
    80000,
    'Monday-Friday mornings',
    'verified',
    true,
    4.8,
    true
WHERE NOT EXISTS (SELECT 1 FROM public.providers WHERE email = 'maria.r@example.com');

INSERT INTO public.providers (name, email, phone, whatsapp, bio, city, neighborhood, services, languages, specialties, years_experience, rate_monthly, availability, status, featured, rating, active)
SELECT
    'Carlos Martinez',
    'carlos.m@example.com',
    '+57 301 234 5678',
    '+57 301 234 5678',
    'Expert chef specializing in Colombian cuisine and meal prep services.',
    'medellin',
    'Laureles',
    ARRAY['cooking', 'meal-prep'],
    ARRAY['es', 'en'],
    ARRAY['vegan-options', 'meal-planning'],
    12,
    120000,
    'Flexible schedule',
    'verified',
    true,
    4.9,
    true
WHERE NOT EXISTS (SELECT 1 FROM public.providers WHERE email = 'carlos.m@example.com');

-- Final success message
DO $$
BEGIN
    RAISE NOTICE '✅ Database migration complete!';
    RAISE NOTICE 'Tables created/updated: providers, leads, matches, reviews';
    RAISE NOTICE 'Sample providers added (if table was empty)';
END $$;