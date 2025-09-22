-- Illia.club MVP Schema Migration
-- Date: September 22, 2025
-- Description: Complete schema overhaul for expat home services platform
-- use context7

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "unaccent"; -- For accent-insensitive search
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For location-based features

-- Enum types for better data integrity
CREATE TYPE user_tier AS ENUM ('free', 'premium', 'admin');
CREATE TYPE provider_status AS ENUM ('pending', 'verified', 'suspended');
CREATE TYPE service_category AS ENUM ('cleaning', 'cooking', 'meal_prep', 'childcare', 'pet_care', 'gardening', 'handyman', 'other');
CREATE TYPE city AS ENUM ('medellin', 'florianopolis');
CREATE TYPE language AS ENUM ('english', 'spanish', 'portuguese', 'french', 'german', 'italian');
CREATE TYPE intro_status AS ENUM ('pending', 'accepted', 'declined', 'expired');
CREATE TYPE thread_category AS ENUM ('general', 'housing', 'services', 'social', 'visa', 'safety', 'recommendations');

-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS intro_requests CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS thread_posts CASCADE;
DROP TABLE IF EXISTS community_threads CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS service_providers CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Enhanced profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  tier user_tier DEFAULT 'free' NOT NULL,
  city city,
  languages language[] DEFAULT ARRAY['english']::language[],
  phone TEXT,
  whatsapp_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  trial_ends_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Service providers table
CREATE TABLE service_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  bio TEXT NOT NULL,
  avatar_url TEXT,
  city city NOT NULL,
  languages language[] NOT NULL DEFAULT ARRAY['spanish']::language[],
  services service_category[] NOT NULL,
  specialties TEXT[], -- e.g., ['vegan cooking', 'pet-friendly', 'eco-friendly']
  rate_hourly DECIMAL(10,2),
  rate_weekly DECIMAL(10,2),
  rate_monthly DECIMAL(10,2),
  currency TEXT DEFAULT 'COP' CHECK (currency IN ('COP', 'BRL', 'USD')),
  years_experience INTEGER,
  whatsapp_number TEXT,
  email TEXT,
  phone TEXT,
  availability JSONB, -- Store schedule as JSON
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES profiles(id),
  status provider_status DEFAULT 'pending',
  rating_avg DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  featured BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  search_vector tsvector
);

-- User preferences for matching
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  preferred_city city NOT NULL,
  services_needed service_category[],
  languages_required language[],
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  schedule_preference JSONB,
  special_requirements TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches table (AI-generated matches)
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  explanation TEXT NOT NULL,
  ai_model TEXT DEFAULT 'gpt-5-turbo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  viewed_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,
  UNIQUE(user_id, provider_id)
);

-- Community threads
CREATE TABLE community_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category thread_category NOT NULL,
  city_tag city,
  tags TEXT[],
  views_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  search_vector tsvector
);

-- Thread posts/replies
CREATE TABLE thread_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES community_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_solution BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  edited_at TIMESTAMPTZ
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  service_date DATE,
  is_verified BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider_id, user_id)
);

-- Intro requests
CREATE TABLE intro_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  status intro_status DEFAULT 'pending',
  message TEXT,
  scheduled_for TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

-- Create indexes for performance
CREATE INDEX idx_providers_city ON service_providers(city);
CREATE INDEX idx_providers_services ON service_providers USING GIN(services);
CREATE INDEX idx_providers_languages ON service_providers USING GIN(languages);
CREATE INDEX idx_providers_status ON service_providers(status) WHERE status = 'verified';
CREATE INDEX idx_providers_featured ON service_providers(featured) WHERE featured = true;
CREATE INDEX idx_providers_search ON service_providers USING GIN(search_vector);

CREATE INDEX idx_threads_category ON community_threads(category);
CREATE INDEX idx_threads_city ON community_threads(city_tag);
CREATE INDEX idx_threads_user ON community_threads(user_id);
CREATE INDEX idx_threads_activity ON community_threads(last_activity_at DESC);
CREATE INDEX idx_threads_search ON community_threads USING GIN(search_vector);

CREATE INDEX idx_posts_thread ON thread_posts(thread_id);
CREATE INDEX idx_posts_user ON thread_posts(user_id);

CREATE INDEX idx_matches_user ON matches(user_id);
CREATE INDEX idx_matches_provider ON matches(provider_id);
CREATE INDEX idx_matches_score ON matches(score DESC);

CREATE INDEX idx_reviews_provider ON reviews(provider_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

CREATE INDEX idx_intros_user ON intro_requests(user_id);
CREATE INDEX idx_intros_provider ON intro_requests(provider_id);
CREATE INDEX idx_intros_status ON intro_requests(status);

-- Full text search configuration
ALTER TABLE service_providers ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(bio, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(specialties, ' '), '')), 'C')
  ) STORED;

ALTER TABLE community_threads ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(body, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'C')
  ) STORED;

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON service_providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_threads_updated_at BEFORE UPDATE ON community_threads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON thread_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to update provider ratings
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE service_providers
  SET
    rating_avg = (SELECT AVG(rating)::DECIMAL(3,2) FROM reviews WHERE provider_id = NEW.provider_id),
    reviews_count = (SELECT COUNT(*) FROM reviews WHERE provider_id = NEW.provider_id)
  WHERE id = NEW.provider_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_provider_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

-- Function to update thread activity
CREATE OR REPLACE FUNCTION update_thread_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_threads
  SET
    replies_count = (SELECT COUNT(*) FROM thread_posts WHERE thread_id = NEW.thread_id),
    last_activity_at = NOW()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_thread_activity_trigger
AFTER INSERT ON thread_posts
FOR EACH ROW EXECUTE FUNCTION update_thread_activity();

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE thread_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE intro_requests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Service providers policies (public read)
CREATE POLICY "Providers viewable by everyone" ON service_providers
  FOR SELECT USING (status = 'verified' OR auth.jwt()->>'role' = 'admin');

CREATE POLICY "Only admins can insert providers" ON service_providers
  FOR INSERT WITH CHECK (auth.jwt()->>'role' = 'admin');

CREATE POLICY "Only admins can update providers" ON service_providers
  FOR UPDATE USING (auth.jwt()->>'role' = 'admin');

-- User preferences policies
CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Matches policies
CREATE POLICY "Users can view own matches" ON matches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create matches" ON matches
  FOR INSERT WITH CHECK (true); -- Will be restricted via service role

-- Community threads policies
CREATE POLICY "Anyone can view threads" ON community_threads
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create threads" ON community_threads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own threads" ON community_threads
  FOR UPDATE USING (auth.uid() = user_id);

-- Thread posts policies (premium feature for replies)
CREATE POLICY "Anyone can view posts" ON thread_posts
  FOR SELECT USING (true);

CREATE POLICY "Thread authors can always reply" ON thread_posts
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM community_threads WHERE id = thread_id
    )
  );

CREATE POLICY "Premium users can reply to any thread" ON thread_posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND tier IN ('premium', 'admin')
    )
  );

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Verified users can create reviews" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM intro_requests
      WHERE user_id = auth.uid()
      AND provider_id = reviews.provider_id
      AND status = 'accepted'
    )
  );

-- Intro requests policies (premium only)
CREATE POLICY "Users can view own intros" ON intro_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Premium users can create intros" ON intro_requests
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND tier IN ('premium', 'admin')
    )
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Note: To add test data, first create a user through Supabase Auth
-- Then insert their profile data. Example:
-- INSERT INTO profiles (id, email, full_name, tier, city, languages)
-- SELECT id, email, 'Test User', 'premium', 'medellin', ARRAY['english', 'spanish']::language[]
-- FROM auth.users WHERE email = 'test@illia.club' LIMIT 1;