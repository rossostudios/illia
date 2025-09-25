-- Migration: Frontend Integration Updates (Simplified)
-- Description: Add missing columns for frontend pages integration

-- Add missing columns to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS budget_min DECIMAL(10, 2);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS budget_max DECIMAL(10, 2);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS notification_settings JSONB DEFAULT '{"email": true, "matches": true, "messages": true, "marketing": false}';

-- Add missing columns to service_providers table
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

-- Create only essential indexes that reference existing columns
CREATE INDEX IF NOT EXISTS idx_providers_city ON public.service_providers(city);
CREATE INDEX IF NOT EXISTS idx_providers_services ON public.service_providers USING GIN(services);
CREATE INDEX IF NOT EXISTS idx_matches_user ON public.matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_provider ON public.matches(provider_id);
CREATE INDEX IF NOT EXISTS idx_users_tier ON public.users(tier);
CREATE INDEX IF NOT EXISTS idx_users_city ON public.users(city);

-- Create storage bucket for avatars (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Grant basic permissions
GRANT SELECT ON public.service_providers TO anon, authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.matches TO authenticated;