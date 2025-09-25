-- Migration: Complete Schema Alignment for September 2025 (Fixed)
-- Description: Comprehensive schema updates to align database with frontend requirements

-- =====================================================
-- 1. COMPLETE BOOKINGS SYSTEM
-- =====================================================

-- Create booking status enum (with proper existence check)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE booking_status AS ENUM (
      'pending',
      'confirmed',
      'completed',
      'cancelled',
      'rescheduled'
    );
  END IF;
END $$;

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 120,
  status booking_status DEFAULT 'pending',
  price DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  notes TEXT,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  rescheduled_from UUID REFERENCES public.bookings(id),
  location TEXT,
  address TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. FIX USERS TABLE
-- =====================================================

-- Add missing columns to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS notification_settings JSONB DEFAULT '{"email": true, "matches": true, "messages": true, "bookings": true, "marketing": false}';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS polar_customer_id TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;

-- =====================================================
-- 3. FIX SERVICE PROVIDERS TABLE
-- =====================================================

-- Add missing columns to service_providers table
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS completed_jobs INTEGER DEFAULT 0;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}';
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS response_time_hours INTEGER;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS cancellation_rate DECIMAL(5, 2) DEFAULT 0;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS acceptance_rate DECIMAL(5, 2) DEFAULT 100;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS portfolio_urls TEXT[];
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS certifications TEXT[];
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS insurance_verified BOOLEAN DEFAULT false;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS stripe_account_id TEXT;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS payment_methods TEXT[] DEFAULT '{"cash", "card"}';
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS working_hours JSONB DEFAULT '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "17:00"}, "saturday": null, "sunday": null}';

-- =====================================================
-- 4. FIX MATCHES TABLE
-- =====================================================

-- Add missing columns to matches table
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS match_score DECIMAL(5, 2);
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS notes JSONB DEFAULT '[]';
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS dismissed_at TIMESTAMPTZ;
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS last_interaction_at TIMESTAMPTZ;
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS intro_requested BOOLEAN DEFAULT false;
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS intro_requested_at TIMESTAMPTZ;

-- =====================================================
-- 5. CREATE NOTIFICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. CREATE ANALYTICS EVENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_category TEXT,
  event_properties JSONB DEFAULT '{}',
  page_path TEXT,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. PERFORMANCE INDEXES
-- =====================================================

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_tier ON public.users(tier);
CREATE INDEX IF NOT EXISTS idx_users_city ON public.users(city);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON public.users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON public.users(last_active_at DESC);

-- Service providers indexes
CREATE INDEX IF NOT EXISTS idx_providers_city ON public.service_providers(city);
CREATE INDEX IF NOT EXISTS idx_providers_services ON public.service_providers USING GIN(services);
CREATE INDEX IF NOT EXISTS idx_providers_status ON public.service_providers(status);
CREATE INDEX IF NOT EXISTS idx_providers_rating ON public.service_providers(rating_avg DESC);
CREATE INDEX IF NOT EXISTS idx_providers_active ON public.service_providers(is_active);
CREATE INDEX IF NOT EXISTS idx_providers_featured ON public.service_providers(featured);

-- Matches indexes
CREATE INDEX IF NOT EXISTS idx_matches_user ON public.matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_provider ON public.matches(provider_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_score ON public.matches(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_matches_created ON public.matches(created_at DESC);

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON public.bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date, booking_time);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON public.bookings(created_at DESC);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(user_id, read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_user ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON public.analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.analytics_events(created_at DESC);

-- =====================================================
-- 8. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Bookings policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Users can view their own bookings') THEN
    CREATE POLICY "Users can view their own bookings"
      ON public.bookings FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Providers can view their bookings') THEN
    CREATE POLICY "Providers can view their bookings"
      ON public.bookings FOR SELECT
      TO authenticated
      USING (
        provider_id IN (
          SELECT id FROM public.service_providers
          WHERE email = auth.jwt()->>'email'
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Users can create bookings') THEN
    CREATE POLICY "Users can create bookings"
      ON public.bookings FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Users can update their own bookings') THEN
    CREATE POLICY "Users can update their own bookings"
      ON public.bookings FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Notifications policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can view their own notifications') THEN
    CREATE POLICY "Users can view their own notifications"
      ON public.notifications FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can update their own notifications') THEN
    CREATE POLICY "Users can update their own notifications"
      ON public.notifications FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Analytics policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'analytics_events' AND policyname = 'Users can create their own analytics events') THEN
    CREATE POLICY "Users can create their own analytics events"
      ON public.analytics_events FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'analytics_events' AND policyname = 'Admins can view all analytics') THEN
    CREATE POLICY "Admins can view all analytics"
      ON public.analytics_events FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.users
          WHERE id = auth.uid() AND (is_admin = true OR is_super_admin = true)
        )
      );
  END IF;
END $$;

-- =====================================================
-- 9. REALTIME SUBSCRIPTIONS
-- =====================================================

-- Enable realtime for relevant tables (only if not already enabled)
DO $$
BEGIN
  -- Check if the tables are already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND schemaname = 'public'
    AND tablename = 'bookings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND schemaname = 'public'
    AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Realtime subscription setup: %', SQLERRM;
END $$;

-- =====================================================
-- 10. FUNCTIONS FOR BETTER PERFORMANCE
-- =====================================================

-- Function to calculate match score
CREATE OR REPLACE FUNCTION calculate_match_score(
  p_user_id UUID,
  p_provider_id UUID
) RETURNS DECIMAL AS $$
DECLARE
  v_score DECIMAL := 50; -- Base score
  v_user RECORD;
  v_provider RECORD;
BEGIN
  -- Get user data
  SELECT * INTO v_user FROM public.users WHERE id = p_user_id;
  -- Get provider data
  SELECT * INTO v_provider FROM public.service_providers WHERE id = p_provider_id;

  -- Location match (20 points)
  IF v_user.city = v_provider.city THEN
    v_score := v_score + 20;
  END IF;

  -- Service match (15 points)
  IF v_user.services && v_provider.services THEN
    v_score := v_score + 15;
  END IF;

  -- Rating bonus (10 points max)
  IF v_provider.rating_avg IS NOT NULL THEN
    v_score := v_score + (v_provider.rating_avg * 2);
  END IF;

  -- Verified bonus (5 points)
  IF v_provider.status = 'verified' THEN
    v_score := v_score + 5;
  END IF;

  RETURN LEAST(v_score, 100); -- Cap at 100
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get provider availability
CREATE OR REPLACE FUNCTION get_provider_availability(
  p_provider_id UUID,
  p_date DATE
) RETURNS TABLE (
  time_slot TIME,
  is_available BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  WITH time_slots AS (
    SELECT generate_series(
      '08:00'::TIME,
      '20:00'::TIME,
      '1 hour'::INTERVAL
    )::TIME AS time_slot
  ),
  existing_bookings AS (
    SELECT booking_time, duration_minutes
    FROM public.bookings
    WHERE provider_id = p_provider_id
      AND booking_date = p_date
      AND status IN ('confirmed', 'pending')
  )
  SELECT
    ts.time_slot,
    NOT EXISTS (
      SELECT 1 FROM existing_bookings eb
      WHERE ts.time_slot >= eb.booking_time
        AND ts.time_slot < eb.booking_time + (eb.duration_minutes || ' minutes')::INTERVAL
    ) AS is_available
  FROM time_slots ts
  ORDER BY ts.time_slot;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 11. TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Update updated_at timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to bookings table if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_bookings_updated_at') THEN
    CREATE TRIGGER update_bookings_updated_at
      BEFORE UPDATE ON public.bookings
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- =====================================================
-- 12. GRANT PERMISSIONS
-- =====================================================

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT INSERT ON public.analytics_events TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_match_score TO authenticated;
GRANT EXECUTE ON FUNCTION get_provider_availability TO authenticated;

-- =====================================================
-- 13. FINAL NOTES
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 021_complete_schema_alignment_fixed completed successfully!';
  RAISE NOTICE 'Tables created/updated: bookings, notifications, analytics_events';
  RAISE NOTICE 'Columns added to: users, service_providers, matches';
  RAISE NOTICE 'Indexes and RLS policies have been applied';
END $$;