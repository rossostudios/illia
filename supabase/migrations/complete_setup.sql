-- ============================================
-- Illia.club Complete Database Setup
-- Version: 1.0.0
-- Date: September 2025
--
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- Drop existing types if they exist (for clean setup)
DROP TYPE IF EXISTS user_tier CASCADE;
DROP TYPE IF EXISTS provider_status CASCADE;
DROP TYPE IF EXISTS intro_status CASCADE;
DROP TYPE IF EXISTS thread_category CASCADE;

-- Custom types
CREATE TYPE user_tier AS ENUM ('free', 'explorer', 'settler', 'local');
CREATE TYPE provider_status AS ENUM ('pending', 'verified', 'suspended');
CREATE TYPE intro_status AS ENUM ('pending', 'accepted', 'declined', 'expired');
CREATE TYPE thread_category AS ENUM ('general', 'services', 'recommendations', 'expat-life', 'housing', 'visa');

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    phone TEXT,
    city TEXT,
    preferred_language TEXT DEFAULT 'en',
    tier user_tier DEFAULT 'free',
    services TEXT[], -- Array of services they're interested in
    budget_min INTEGER, -- In cents
    budget_max INTEGER, -- In cents
    preferences JSONB DEFAULT '{}', -- Additional preferences
    subscription_id TEXT, -- Polar/Stripe subscription ID
    subscription_status TEXT,
    subscription_expires_at TIMESTAMPTZ,
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Providers table
CREATE TABLE IF NOT EXISTS public.service_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    whatsapp TEXT,
    bio TEXT NOT NULL,
    photo_url TEXT,
    city TEXT NOT NULL,
    neighborhood TEXT,
    services TEXT[] NOT NULL,
    languages TEXT[] NOT NULL,
    specialties TEXT[],
    years_experience INTEGER,
    rate_hourly INTEGER,
    rate_monthly INTEGER,
    rate_description TEXT,
    availability TEXT,
    documents_verified BOOLEAN DEFAULT false,
    background_check BOOLEAN DEFAULT false,
    status provider_status DEFAULT 'pending',
    featured BOOLEAN DEFAULT false,
    rating_avg DECIMAL(3, 2),
    reviews_count INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads table (for quiz submissions)
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
    converted_to_user BOOLEAN DEFAULT false,
    user_id UUID REFERENCES public.users(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches table
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    explanation TEXT,
    ai_model TEXT,
    viewed_at TIMESTAMPTZ,
    contacted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, provider_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    services_used TEXT[],
    would_recommend BOOLEAN,
    verified_booking BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(provider_id, user_id)
);

-- Intro Requests table
CREATE TABLE IF NOT EXISTS public.intro_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE,
    status intro_status DEFAULT 'pending',
    message TEXT,
    preferred_contact_method TEXT,
    preferred_schedule TEXT,
    provider_response TEXT,
    responded_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Threads table
CREATE TABLE IF NOT EXISTS public.community_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    category thread_category NOT NULL,
    city_tag TEXT,
    tags TEXT[],
    views_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    last_post_at TIMESTAMPTZ,
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Thread Posts table
CREATE TABLE IF NOT EXISTS public.thread_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID REFERENCES public.community_threads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    parent_post_id UUID REFERENCES public.thread_posts(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    is_solution BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    edited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Activity Tracking
CREATE TABLE IF NOT EXISTS public.user_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Provider Schedule/Availability
CREATE TABLE IF NOT EXISTS public.provider_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME,
    end_time TIME,
    is_available BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_providers_city ON public.service_providers(city);
CREATE INDEX IF NOT EXISTS idx_providers_services ON public.service_providers USING GIN(services);
CREATE INDEX IF NOT EXISTS idx_providers_languages ON public.service_providers USING GIN(languages);
CREATE INDEX IF NOT EXISTS idx_providers_rating ON public.service_providers(rating_avg DESC) WHERE rating_avg IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_providers_status ON public.service_providers(status);
CREATE INDEX IF NOT EXISTS idx_providers_active ON public.service_providers(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_matches_user ON public.matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_score ON public.matches(score DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_provider ON public.reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_threads_category ON public.community_threads(category);
CREATE INDEX IF NOT EXISTS idx_threads_city ON public.community_threads(city_tag);
CREATE INDEX IF NOT EXISTS idx_posts_thread ON public.thread_posts(thread_id);

-- Full text search indexes
CREATE INDEX IF NOT EXISTS idx_providers_bio_search ON public.service_providers USING GIN(to_tsvector('english', bio));
CREATE INDEX IF NOT EXISTS idx_threads_search ON public.community_threads USING GIN(to_tsvector('english', title || ' ' || body));

-- Update functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_providers_updated_at ON public.service_providers;
DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
DROP TRIGGER IF EXISTS update_intro_requests_updated_at ON public.intro_requests;
DROP TRIGGER IF EXISTS update_threads_updated_at ON public.community_threads;

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON public.service_providers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_intro_requests_updated_at BEFORE UPDATE ON public.intro_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_threads_updated_at BEFORE UPDATE ON public.community_threads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update provider ratings
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.service_providers
    SET
        rating_avg = (SELECT AVG(rating)::DECIMAL(3,2) FROM public.reviews WHERE provider_id = NEW.provider_id),
        reviews_count = (SELECT COUNT(*) FROM public.reviews WHERE provider_id = NEW.provider_id)
    WHERE id = NEW.provider_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_provider_rating_on_review ON public.reviews;

CREATE TRIGGER update_provider_rating_on_review
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

-- Function to update thread post count
CREATE OR REPLACE FUNCTION update_thread_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.community_threads
        SET
            posts_count = posts_count + 1,
            last_post_at = NOW()
        WHERE id = NEW.thread_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.community_threads
        SET posts_count = posts_count - 1
        WHERE id = OLD.thread_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_thread_count_on_post ON public.thread_posts;

CREATE TRIGGER update_thread_count_on_post
    AFTER INSERT OR DELETE ON public.thread_posts
    FOR EACH ROW EXECUTE FUNCTION update_thread_post_count();

-- Row Level Security Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intro_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Anyone can view active providers" ON public.service_providers;
DROP POLICY IF EXISTS "Anyone can view verified providers" ON public.service_providers;
DROP POLICY IF EXISTS "Users can view own matches" ON public.matches;
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can view own intro requests" ON public.intro_requests;
DROP POLICY IF EXISTS "Premium users can create intro requests" ON public.intro_requests;
DROP POLICY IF EXISTS "Anyone can view threads" ON public.community_threads;
DROP POLICY IF EXISTS "Authenticated users can create threads" ON public.community_threads;
DROP POLICY IF EXISTS "Users can update own threads" ON public.community_threads;
DROP POLICY IF EXISTS "Anyone can view posts" ON public.thread_posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.thread_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON public.thread_posts;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Providers policies (public read for active providers)
CREATE POLICY "Anyone can view active providers" ON public.service_providers
    FOR SELECT USING (active = true);

-- Matches policies
CREATE POLICY "Users can view own matches" ON public.matches
    FOR SELECT USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Intro requests policies
CREATE POLICY "Users can view own intro requests" ON public.intro_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Premium users can create intro requests" ON public.intro_requests
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND tier != 'free')
    );

-- Community threads policies
CREATE POLICY "Anyone can view threads" ON public.community_threads
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create threads" ON public.community_threads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own threads" ON public.community_threads
    FOR UPDATE USING (auth.uid() = user_id);

-- Thread posts policies
CREATE POLICY "Anyone can view posts" ON public.thread_posts
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON public.thread_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON public.thread_posts
    FOR UPDATE USING (auth.uid() = user_id);

-- Grant permissions for Supabase auth
GRANT ALL ON public.users TO authenticated;
GRANT SELECT ON public.service_providers TO anon, authenticated;
GRANT ALL ON public.matches TO authenticated;
GRANT ALL ON public.reviews TO authenticated;
GRANT ALL ON public.intro_requests TO authenticated;
GRANT ALL ON public.community_threads TO authenticated;
GRANT ALL ON public.thread_posts TO authenticated;
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT ON public.community_threads TO anon;
GRANT SELECT ON public.thread_posts TO anon;

-- ============================================
-- SEED DATA SECTION
-- ============================================

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
 ARRAY['dietary-restrictions', 'event-catering', 'weekly-menus'], 10, 100000, 'Flexible', 'verified', true, 4.9, 20)
ON CONFLICT (email) DO NOTHING;

-- Insert sample service providers for Florianópolis
INSERT INTO public.service_providers (name, email, phone, whatsapp, bio, city, neighborhood, services, languages, specialties, years_experience, rate_monthly, availability, status, featured, rating_avg, reviews_count)
VALUES
('Julia Santos', 'julia.s@email.com', '+55 48 99123 4567', '+55 48 99123 4567',
 'Professional cleaning and organization services in Lagoa and surrounding areas. Fluent in English and Spanish. Specialized in beach home maintenance.',
 'florianopolis', 'Lagoa', ARRAY['cleaning', 'organization'], ARRAY['pt', 'en', 'es'],
 ARRAY['beach-homes', 'english-speaker', 'spanish-speaker'], 9, 80000, 'Flexible schedule', 'verified', true, 4.9, 22),

('Pedro Oliveira', 'pedro.o@email.com', '+55 48 99234 5678', '+55 48 99234 5678',
 'Personal chef specializing in Brazilian cuisine and healthy meal prep. Vegetarian and vegan options available. Serving the expat community for 8 years.',
 'florianopolis', 'Campeche', ARRAY['cooking', 'meal-prep'], ARRAY['pt', 'en'],
 ARRAY['brazilian-cuisine', 'vegetarian', 'vegan'], 8, 100000, 'Monday-Saturday', 'verified', true, 4.8, 19)
ON CONFLICT (email) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Database setup complete! Tables created and sample data inserted.';
END $$;