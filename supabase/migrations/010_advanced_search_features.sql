-- Advanced Search Features Migration
-- Adds geolocation, saved searches, voice search, and search analytics

-- Add new columns to providers table
ALTER TABLE providers
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11,8),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS availability_schedule JSONB;

-- Update existing providers with sample coordinates
UPDATE providers SET
  latitude = CASE
    WHEN city = 'medellin' AND neighborhood = 'El Poblado' THEN 6.2093
    WHEN city = 'medellin' AND neighborhood = 'Laureles' THEN 6.2497
    WHEN city = 'medellin' AND neighborhood = 'Envigado' THEN 6.1759
    WHEN city = 'medellin' AND neighborhood = 'Sabaneta' THEN 6.1514
    WHEN city = 'florianopolis' AND neighborhood = 'Centro' THEN -27.5954
    WHEN city = 'florianopolis' AND neighborhood = 'Jurerê' THEN -27.4339
    WHEN city = 'florianopolis' AND neighborhood = 'Campeche' THEN -27.6736
    ELSE NULL
  END,
  longitude = CASE
    WHEN city = 'medellin' AND neighborhood = 'El Poblado' THEN -75.5676
    WHEN city = 'medellin' AND neighborhood = 'Laureles' THEN -75.5908
    WHEN city = 'medellin' AND neighborhood = 'Envigado' THEN -75.5624
    WHEN city = 'medellin' AND neighborhood = 'Sabaneta' THEN -75.6166
    WHEN city = 'florianopolis' AND neighborhood = 'Centro' THEN -48.5480
    WHEN city = 'florianopolis' AND neighborhood = 'Jurerê' THEN -48.5004
    WHEN city = 'florianopolis' AND neighborhood = 'Campeche' THEN -48.4914
    ELSE NULL
  END,
  address = CASE
    WHEN city = 'medellin' AND neighborhood = 'El Poblado' THEN 'Carrera 43 #10-32, El Poblado, Medellín'
    WHEN city = 'medellin' AND neighborhood = 'Laureles' THEN 'Carrera 70 #1-45, Laureles, Medellín'
    WHEN city = 'medellin' AND neighborhood = 'Envigado' THEN 'Calle 37 Sur #42-15, Envigado, Medellín'
    WHEN city = 'medellin' AND neighborhood = 'Sabaneta' THEN 'Carrera 48 #69-30, Sabaneta, Medellín'
    WHEN city = 'florianopolis' AND neighborhood = 'Centro' THEN 'Rua Tenente Silveira 150, Centro, Florianópolis'
    WHEN city = 'florianopolis' AND neighborhood = 'Jurerê' THEN 'Av. dos Búzios 1800, Jurerê, Florianópolis'
    WHEN city = 'florianopolis' AND neighborhood = 'Campeche' THEN 'Servidão Ver. Altair P. Alves 120, Campeche, Florianópolis'
    ELSE NULL
  END;

-- Create saved searches table
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  filters JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  search_count INTEGER DEFAULT 0,
  last_used TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Create voice search transcripts table
CREATE TABLE IF NOT EXISTS voice_search_transcripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  transcript TEXT NOT NULL,
  confidence DECIMAL(3,2),
  processed_query TEXT,
  search_results JSONB,
  duration_seconds DECIMAL(5,2),
  language_code TEXT DEFAULT 'en',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create search analytics table
CREATE TABLE IF NOT EXISTS search_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  search_type TEXT NOT NULL,
  query TEXT,
  filters_used JSONB,
  result_count INTEGER,
  time_to_results DECIMAL(5,2),
  clicked_result_id UUID REFERENCES providers(id),
  conversion_funnel TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_providers_location ON providers(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_providers_specialties ON providers USING GIN(specialties);
CREATE INDEX IF NOT EXISTS idx_providers_rating ON providers(rating);
CREATE INDEX IF NOT EXISTS idx_providers_verified ON providers(verified);
CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_default ON saved_searches(user_id, is_default) WHERE is_default = true;
CREATE INDEX IF NOT EXISTS idx_voice_search_user ON voice_search_transcripts(user_id);
CREATE INDEX IF NOT EXISTS idx_search_analytics_user ON search_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_search_analytics_type ON search_analytics(search_type);
CREATE INDEX IF NOT EXISTS idx_search_analytics_conversion ON search_analytics(conversion_funnel);

-- Add sample availability schedules
UPDATE providers SET availability_schedule = '{"monday": ["09:00-12:00"], "tuesday": ["09:00-12:00"], "wednesday": ["09:00-12:00"], "thursday": ["09:00-12:00"], "friday": ["09:00-12:00"]}' WHERE name = 'Maria Rodriguez';
UPDATE providers SET availability_schedule = '{"monday": ["18:00-22:00"], "tuesday": ["18:00-22:00"], "wednesday": ["18:00-22:00"], "thursday": ["18:00-22:00"], "friday": ["18:00-22:00"], "saturday": ["12:00-22:00"]}' WHERE name = 'Carlos Martinez';
UPDATE providers SET availability_schedule = '{"saturday": ["08:00-18:00"], "sunday": ["08:00-18:00"]}' WHERE name = 'Ana Silva';
UPDATE providers SET availability_schedule = '{"monday": ["07:00-11:00"], "tuesday": ["07:00-11:00"], "wednesday": ["07:00-11:00"], "thursday": ["07:00-11:00"], "friday": ["07:00-11:00"]}' WHERE name = 'Luis Gomez';
UPDATE providers SET availability_schedule = '{"monday": ["13:00-17:00"], "wednesday": ["13:00-17:00"], "friday": ["13:00-17:00"]}' WHERE name = 'Isabella Torres';
