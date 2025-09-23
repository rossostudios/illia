-- Illia Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Providers table (service providers)
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  whatsapp TEXT,
  bio TEXT,
  photo_url TEXT,
  city TEXT NOT NULL,
  neighborhood TEXT,
  latitude DECIMAL(10,8), -- Geolocation latitude
  longitude DECIMAL(11,8), -- Geolocation longitude
  address TEXT, -- Full address for maps
  services TEXT[] NOT NULL, -- Array of services: ['cleaning', 'cooking', etc]
  languages TEXT[] NOT NULL, -- ['english', 'spanish', 'portuguese']
  rate_monthly INTEGER, -- In cents (USD)
  rate_hourly INTEGER, -- In cents (USD)
  verified BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  specialties TEXT[], -- ['pet-friendly', 'eco-friendly', etc]
  availability TEXT,
  availability_schedule JSONB, -- Detailed availability: {'monday': ['09:00-12:00', '14:00-18:00'], ...}
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User preferences (from quiz)
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  city TEXT NOT NULL,
  services TEXT[] NOT NULL,
  languages TEXT[] NOT NULL,
  budget_min INTEGER,
  budget_max INTEGER,
  frequency TEXT,
  preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Match history
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  match_score INTEGER,
  contacted BOOLEAN DEFAULT false,
  hired BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, provider_id)
);

-- User subscriptions (for Polar)
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id TEXT,
  customer_id TEXT,
  product_id TEXT,
  status TEXT,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Usage tracking
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id TEXT,
  meter_type TEXT,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Saved search preferences
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  filters JSONB NOT NULL, -- Complete filter configuration
  is_default BOOLEAN DEFAULT false,
  search_count INTEGER DEFAULT 0,
  last_used TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Voice search transcripts and analytics
CREATE TABLE IF NOT EXISTS voice_search_transcripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  transcript TEXT NOT NULL,
  confidence DECIMAL(3,2), -- Speech recognition confidence score
  processed_query TEXT, -- AI-processed query interpretation
  search_results JSONB, -- Results of the voice search
  duration_seconds DECIMAL(5,2), -- Length of voice input
  language_code TEXT DEFAULT 'en', -- Language detected
  created_at TIMESTAMP DEFAULT NOW()
);

-- Search analytics
CREATE TABLE IF NOT EXISTS search_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  search_type TEXT NOT NULL, -- 'text', 'voice', 'ai_suggestion', 'saved_search'
  query TEXT,
  filters_used JSONB,
  result_count INTEGER,
  time_to_results DECIMAL(5,2), -- seconds
  clicked_result_id UUID REFERENCES providers(id),
  conversion_funnel TEXT, -- 'searched' -> 'viewed' -> 'contacted' -> 'hired'
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_providers_city ON providers(city);
CREATE INDEX IF NOT EXISTS idx_providers_services ON providers USING GIN(services);
CREATE INDEX IF NOT EXISTS idx_providers_languages ON providers USING GIN(languages);
CREATE INDEX IF NOT EXISTS idx_providers_active ON providers(active);
CREATE INDEX IF NOT EXISTS idx_providers_location ON providers(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_providers_specialties ON providers USING GIN(specialties);
CREATE INDEX IF NOT EXISTS idx_providers_rating ON providers(rating);
CREATE INDEX IF NOT EXISTS idx_providers_verified ON providers(verified);
CREATE INDEX IF NOT EXISTS idx_matches_user ON matches(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_user_month ON usage_tracking(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON user_subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_default ON saved_searches(user_id, is_default) WHERE is_default = true;
CREATE INDEX IF NOT EXISTS idx_voice_search_user ON voice_search_transcripts(user_id);
CREATE INDEX IF NOT EXISTS idx_search_analytics_user ON search_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_search_analytics_type ON search_analytics(search_type);
CREATE INDEX IF NOT EXISTS idx_search_analytics_conversion ON search_analytics(conversion_funnel);

-- Sample providers for Medellín
INSERT INTO providers (name, email, phone, whatsapp, bio, photo_url, city, neighborhood, latitude, longitude, address, services, languages, rate_monthly, verified, rating, specialties, availability, availability_schedule)
VALUES
  ('Maria Rodriguez', 'maria@example.com', '+57 300 123 4567', '+573001234567', 'Professional cleaner with 10 years of experience. Specializes in eco-friendly products.', 'https://i.pravatar.cc/150?img=1', 'medellin', 'El Poblado', 6.2093, -75.5676, 'Carrera 43 #10-32, El Poblado, Medellín', ARRAY['cleaning', 'deep-clean'], ARRAY['english', 'spanish'], 20000, true, 4.8, ARRAY['eco-friendly', 'pet-friendly'], 'Mon-Fri mornings', '{"monday": ["09:00-12:00"], "tuesday": ["09:00-12:00"], "wednesday": ["09:00-12:00"], "thursday": ["09:00-12:00"], "friday": ["09:00-12:00"]}'),
  ('Carlos Martinez', 'carlos@example.com', '+57 301 234 5678', '+573012345678', 'Expert in Colombian cuisine and meal prep. Can accommodate dietary restrictions.', 'https://i.pravatar.cc/150?img=8', 'medellin', 'Laureles', 6.2497, -75.5908, 'Carrera 70 #1-45, Laureles, Medellín', ARRAY['cooking', 'meal-prep'], ARRAY['spanish', 'english'], 25000, true, 4.7, ARRAY['vegan-options', 'meal-planning'], 'Flexible schedule', '{"monday": ["18:00-22:00"], "tuesday": ["18:00-22:00"], "wednesday": ["18:00-22:00"], "thursday": ["18:00-22:00"], "friday": ["18:00-22:00"], "saturday": ["12:00-22:00"]}'),
  ('Ana Silva', 'ana@example.com', '+57 302 345 6789', '+573023456789', 'Reliable house cleaner and organizer. Great with pets and children.', 'https://i.pravatar.cc/150?img=5', 'medellin', 'Envigado', 6.1759, -75.5624, 'Calle 37 Sur #42-15, Envigado, Medellín', ARRAY['cleaning', 'organization', 'laundry'], ARRAY['spanish'], 18000, false, 4.6, ARRAY['pet-friendly', 'child-friendly'], 'Weekends available', '{"saturday": ["08:00-18:00"], "sunday": ["08:00-18:00"]}'),
  ('Luis Gomez', 'luis@example.com', '+57 303 456 7890', '+573034567890', 'Professional chef specializing in healthy meal prep and international cuisine.', 'https://i.pravatar.cc/150?img=11', 'medellin', 'Sabaneta', 6.1514, -75.6166, 'Carrera 48 #69-30, Sabaneta, Medellín', ARRAY['cooking', 'meal-prep'], ARRAY['english', 'spanish', 'portuguese'], 30000, true, 4.9, ARRAY['healthy-meals', 'international-cuisine'], 'Weekdays', '{"monday": ["07:00-11:00"], "tuesday": ["07:00-11:00"], "wednesday": ["07:00-11:00"], "thursday": ["07:00-11:00"], "friday": ["07:00-11:00"]}'),
  ('Isabella Torres', 'isabella@example.com', '+57 304 567 8901', '+573045678901', 'Experienced in deep cleaning and organization. Uses only organic products.', 'https://i.pravatar.cc/150?img=20', 'medellin', 'El Poblado', 6.2078, -75.5654, 'Carrera 36 #7-20, El Poblado, Medellín', ARRAY['cleaning', 'deep-clean', 'organization'], ARRAY['english', 'spanish'], 22000, true, 4.7, ARRAY['organic-products', 'detail-oriented'], 'Flexible', '{"monday": ["13:00-17:00"], "wednesday": ["13:00-17:00"], "friday": ["13:00-17:00"]}');

-- Sample providers for Florianópolis
INSERT INTO providers (name, email, phone, whatsapp, bio, photo_url, city, neighborhood, latitude, longitude, address, services, languages, rate_monthly, verified, rating, specialties, availability, availability_schedule)
VALUES
  ('Patricia Santos', 'patricia@example.com', '+55 48 99876 5432', '+5548998765432', 'Dedicated cleaner with attention to detail. Specializes in organizing and decluttering spaces.', 'https://i.pravatar.cc/150?img=15', 'florianopolis', 'Centro', -27.5954, -48.5480, 'Rua Tenente Silveira 150, Centro, Florianópolis', ARRAY['cleaning', 'organization'], ARRAY['portuguese'], 17000, true, 4.8, ARRAY['konmari-method', 'deep-cleaning'], 'Weekdays', '{"monday": ["08:00-17:00"], "tuesday": ["08:00-17:00"], "wednesday": ["08:00-17:00"], "thursday": ["08:00-17:00"], "friday": ["08:00-17:00"]}'),
  ('Roberto Fernandes', 'roberto@example.com', '+55 48 98765 4321', '+5548987654321', 'Premium cleaning service with eco-friendly products. Specialized in luxury homes and Airbnb turnovers.', 'https://i.pravatar.cc/150?img=25', 'florianopolis', 'Jurerê', -27.4339, -48.5004, 'Av. dos Búzios 1800, Jurerê, Florianópolis', ARRAY['cleaning', 'deep-clean'], ARRAY['portuguese', 'english', 'italian'], 28000, true, 5.0, ARRAY['luxury-homes', 'airbnb', 'green-cleaning'], 'By appointment', '{"monday": ["09:00-18:00"], "tuesday": ["09:00-18:00"], "wednesday": ["09:00-18:00"], "thursday": ["09:00-18:00"], "friday": ["09:00-18:00"], "saturday": ["09:00-18:00"]}'),
  ('Lucia Costa', 'lucia@example.com', '+55 48 97654 3210', '+5548976543210', 'Experienced housekeeper offering comprehensive cleaning and laundry services.', 'https://i.pravatar.cc/150?img=9', 'florianopolis', 'Campeche', -27.6736, -48.4914, 'Servidão Ver. Altair P. Alves 120, Campeche, Florianópolis', ARRAY['cleaning', 'laundry'], ARRAY['portuguese', 'spanish'], 16000, true, 4.6, ARRAY['laundry', 'ironing', 'window-cleaning'], 'Tue-Thu all day', '{"tuesday": ["08:00-18:00"], "wednesday": ["08:00-18:00"], "thursday": ["08:00-18:00"]}');

