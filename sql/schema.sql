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
  services TEXT[] NOT NULL, -- Array of services: ['cleaning', 'cooking', etc]
  languages TEXT[] NOT NULL, -- ['english', 'spanish', 'portuguese']
  rate_monthly INTEGER, -- In cents (USD)
  rate_hourly INTEGER, -- In cents (USD)
  verified BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  specialties TEXT[], -- ['pet-friendly', 'eco-friendly', etc]
  availability TEXT,
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

-- Create indexes for performance (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_providers_city ON providers(city);
CREATE INDEX IF NOT EXISTS idx_providers_services ON providers USING GIN(services);
CREATE INDEX IF NOT EXISTS idx_providers_languages ON providers USING GIN(languages);
CREATE INDEX IF NOT EXISTS idx_providers_active ON providers(active);
CREATE INDEX IF NOT EXISTS idx_matches_user ON matches(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_user_month ON usage_tracking(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON user_subscriptions(user_id, status);

-- Sample providers for Medellín
INSERT INTO providers (name, email, phone, whatsapp, bio, photo_url, city, neighborhood, services, languages, rate_monthly, verified, rating, specialties, availability)
VALUES 
  ('Maria Rodriguez', 'maria@example.com', '+57 300 123 4567', '+573001234567', 'Professional cleaner with 10 years of experience. Specializes in eco-friendly products.', 'https://i.pravatar.cc/150?img=1', 'medellin', 'El Poblado', ARRAY['cleaning', 'deep-clean'], ARRAY['english', 'spanish'], 20000, true, 4.8, ARRAY['eco-friendly', 'pet-friendly'], 'Mon-Fri mornings'),
  ('Carlos Martinez', 'carlos@example.com', '+57 301 234 5678', '+573012345678', 'Expert in Colombian cuisine and meal prep. Can accommodate dietary restrictions.', 'https://i.pravatar.cc/150?img=8', 'medellin', 'Laureles', ARRAY['cooking', 'meal-prep'], ARRAY['spanish', 'english'], 25000, true, 4.7, ARRAY['vegan-options', 'meal-planning'], 'Flexible schedule'),
  ('Ana Silva', 'ana@example.com', '+57 302 345 6789', '+573023456789', 'Reliable house cleaner and organizer. Great with pets and children.', 'https://i.pravatar.cc/150?img=5', 'medellin', 'Envigado', ARRAY['cleaning', 'organization', 'laundry'], ARRAY['spanish'], 18000, false, 4.6, ARRAY['pet-friendly', 'child-friendly'], 'Weekends available'),
  ('Luis Gomez', 'luis@example.com', '+57 303 456 7890', '+573034567890', 'Professional chef specializing in healthy meal prep and international cuisine.', 'https://i.pravatar.cc/150?img=11', 'medellin', 'Sabaneta', ARRAY['cooking', 'meal-prep'], ARRAY['english', 'spanish', 'portuguese'], 30000, true, 4.9, ARRAY['healthy-meals', 'international-cuisine'], 'Weekdays'),
  ('Isabella Torres', 'isabella@example.com', '+57 304 567 8901', '+573045678901', 'Experienced in deep cleaning and organization. Uses only organic products.', 'https://i.pravatar.cc/150?img=20', 'medellin', 'El Poblado', ARRAY['cleaning', 'deep-clean', 'organization'], ARRAY['english', 'spanish'], 22000, true, 4.7, ARRAY['organic-products', 'detail-oriented'], 'Flexible');

-- Sample providers for Florianópolis
INSERT INTO providers (name, email, phone, whatsapp, bio, photo_url, city, neighborhood, services, languages, rate_monthly, verified, rating, specialties, availability)
VALUES 
  ('Juliana Santos', 'juliana@example.com', '+55 48 98765 4321', '+5548987654321', 'Especialista em limpeza e organização. 8 anos de experiência.', 'https://i.pravatar.cc/150?img=23', 'florianopolis', 'Centro', ARRAY['cleaning', 'organization'], ARRAY['portuguese', 'english'], 150000, true, 4.8, ARRAY['eco-friendly', 'efficient'], 'Segunda a sexta'),
  ('Pedro Oliveira', 'pedro@example.com', '+55 48 98876 5432', '+5548988765432', 'Chef profissional, especializado em culinária saudável e vegetariana.', 'https://i.pravatar.cc/150?img=33', 'florianopolis', 'Lagoa da Conceição', ARRAY['cooking', 'meal-prep'], ARRAY['portuguese', 'english', 'spanish'], 200000, true, 4.9, ARRAY['vegetarian', 'healthy-meals'], 'Horário flexível');
