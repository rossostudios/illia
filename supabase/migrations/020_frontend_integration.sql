-- Migration: Frontend Integration Updates
-- Description: Add missing columns for frontend pages integration

-- Add missing columns to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS budget_min DECIMAL(10, 2);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS budget_max DECIMAL(10, 2);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS notification_settings JSONB DEFAULT '{"email": true, "matches": true, "messages": true, "marketing": false}';

-- Add missing columns to service_providers table
-- Note: Add both photo_url and avatar_url to ensure compatibility
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS completed_jobs INTEGER DEFAULT 0;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}';
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS location TEXT;

-- Add missing columns to matches table
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS match_score DECIMAL(3, 2);
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS notes JSONB DEFAULT '[]';
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Create indexes for better performance (skip existing ones)
CREATE INDEX IF NOT EXISTS idx_providers_city ON public.service_providers(city);
CREATE INDEX IF NOT EXISTS idx_providers_services ON public.service_providers USING GIN(services);
-- Skip indexes that depend on columns that may not exist
-- CREATE INDEX IF NOT EXISTS idx_providers_status ON public.service_providers(status);
-- CREATE INDEX IF NOT EXISTS idx_providers_rating ON public.service_providers(rating_avg DESC);
-- CREATE INDEX IF NOT EXISTS idx_providers_active ON public.service_providers(is_active) WHERE is_active = true;

-- Skip matches status index since status column may not exist
-- CREATE INDEX IF NOT EXISTS idx_matches_user_status ON public.matches(user_id, status);
CREATE INDEX IF NOT EXISTS idx_matches_user ON public.matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_provider ON public.matches(provider_id);
CREATE INDEX IF NOT EXISTS idx_matches_created ON public.matches(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_users_tier ON public.users(tier);
CREATE INDEX IF NOT EXISTS idx_users_city ON public.users(city);
CREATE INDEX IF NOT EXISTS idx_users_created ON public.users(created_at DESC);

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for new columns

-- Users can update their own profile (skip if exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'users'
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile" ON public.users
      FOR UPDATE
      USING (id = auth.uid())
      WITH CHECK (id = auth.uid());
  END IF;
END $$;

-- Service providers are publicly viewable when active
-- Skip if policy already exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'service_providers'
    AND policyname = 'Active providers are publicly viewable'
  ) THEN
    CREATE POLICY "Active providers are publicly viewable" ON public.service_providers
      FOR SELECT
      USING (is_active = true);
  END IF;
END $$;

-- Users can create matches with providers
CREATE POLICY "Users can create matches" ON public.matches
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can view their own matches
CREATE POLICY "Users can view own matches" ON public.matches
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own matches
CREATE POLICY "Users can update own matches" ON public.matches
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own matches
CREATE POLICY "Users can delete own matches" ON public.matches
  FOR DELETE
  USING (user_id = auth.uid());

-- Storage policies for avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_providers_updated_at BEFORE UPDATE ON public.service_providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON public.matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT ON public.service_providers TO anon, authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.matches TO authenticated;

-- Add some sample data for testing (optional)
DO $$
BEGIN
  -- Only add sample providers if the table is empty
  IF NOT EXISTS (SELECT 1 FROM public.service_providers LIMIT 1) THEN
    INSERT INTO public.service_providers (
      id, name, email, bio, city, services, specialties, languages,
      rate_hourly, rating_avg, reviews_count, status, is_active
    ) VALUES
    (
      gen_random_uuid(),
      'Maria Rodriguez',
      'maria@example.com',
      'Professional house cleaner with 10 years of experience. Attention to detail and eco-friendly products.',
      'medellin',
      ARRAY['cleaning', 'organizing'],
      ARRAY['deep cleaning', 'move-in/out cleaning'],
      ARRAY['Spanish', 'English'],
      25,
      4.8,
      42,
      'verified',
      true
    ),
    (
      gen_random_uuid(),
      'Carlos Silva',
      'carlos@example.com',
      'Expert chef specializing in local and international cuisine. Available for meal prep and cooking lessons.',
      'medellin',
      ARRAY['cooking', 'meal prep'],
      ARRAY['Colombian cuisine', 'Italian cuisine'],
      ARRAY['Spanish', 'Portuguese', 'English'],
      35,
      4.9,
      28,
      'verified',
      true
    ),
    (
      gen_random_uuid(),
      'Ana Santos',
      'ana@example.com',
      'Reliable childcare provider with certifications in first aid and early childhood education.',
      'florianopolis',
      ARRAY['childcare', 'tutoring'],
      ARRAY['infant care', 'homework help'],
      ARRAY['Portuguese', 'English'],
      30,
      4.7,
      35,
      'verified',
      true
    );

    RAISE NOTICE 'Sample providers added successfully';
  END IF;
END $$;