-- Migration: Complete Schema Alignment for September 2025 (Final)
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

-- Check if bookings table exists and has the right structure
DO $$
BEGIN
  -- If bookings table doesn't exist, create it
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'bookings') THEN
    CREATE TABLE public.bookings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
      provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE,
      service_type TEXT NOT NULL,
      booking_date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      duration_minutes INTEGER NOT NULL DEFAULT 120,
      hourly_rate DECIMAL(10, 2),
      total_amount DECIMAL(10, 2),
      currency TEXT DEFAULT 'USD',
      status booking_status DEFAULT 'pending',
      is_recurring BOOLEAN DEFAULT false,
      recurring_pattern JSONB,
      special_instructions TEXT,
      location_details TEXT,
      cancellation_policy TEXT,
      cancellation_fee DECIMAL(10, 2),
      cancelled_by UUID,
      cancelled_at TIMESTAMPTZ,
      confirmed_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  ELSE
    -- If table exists, add missing columns
    ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS status booking_status DEFAULT 'pending';
    ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10, 2);
    ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10, 2);
    ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
    ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false;
    ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS recurring_pattern JSONB;
    ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS special_instructions TEXT;
    ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS location_details TEXT;
    ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS cancellation_policy TEXT;
    ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS cancellation_fee DECIMAL(10, 2);
    ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS cancelled_by UUID;
    ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;
    ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;
    ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
  END IF;
END $$;

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

-- First check if service_providers table exists, if not check for providers table
DO $$
BEGIN
  -- Check if we're using 'providers' instead of 'service_providers'
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'service_providers') THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'providers') THEN
      -- Rename providers to service_providers for consistency
      ALTER TABLE public.providers RENAME TO service_providers;
    END IF;
  END IF;
END $$;

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
-- 7. CREATE NECESSARY SUPPORTING TABLES
-- =====================================================

-- Create booking reminders table if referenced in route
CREATE TABLE IF NOT EXISTS public.booking_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create service agreements table if referenced
CREATE TABLE IF NOT EXISTS public.service_agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  accepted_at TIMESTAMPTZ,
  version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create booking reviews table if referenced
CREATE TABLE IF NOT EXISTS public.booking_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 8. PERFORMANCE INDEXES
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
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date, start_time);
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
-- 9. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on tables
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_reviews ENABLE ROW LEVEL SECURITY;

-- Bookings policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Users can view their own bookings') THEN
    CREATE POLICY "Users can view their own bookings"
      ON public.bookings FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
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

-- =====================================================
-- 10. REALTIME SUBSCRIPTIONS
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
-- 11. HELPER FUNCTIONS
-- =====================================================

-- Function to check booking availability (matching the API's expected function)
CREATE OR REPLACE FUNCTION check_booking_availability(
  p_provider_id UUID,
  p_date DATE,
  p_start_time TIME,
  p_end_time TIME
) RETURNS BOOLEAN AS $$
DECLARE
  v_conflict_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO v_conflict_count
  FROM public.bookings
  WHERE provider_id = p_provider_id
    AND booking_date = p_date
    AND status IN ('confirmed', 'pending')
    AND (
      (start_time <= p_start_time AND end_time > p_start_time) OR
      (start_time < p_end_time AND end_time >= p_end_time) OR
      (start_time >= p_start_time AND end_time <= p_end_time)
    );

  RETURN v_conflict_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create recurring bookings (referenced in API)
CREATE OR REPLACE FUNCTION create_recurring_bookings(
  p_booking_id UUID,
  p_pattern JSONB
) RETURNS TABLE(booking_id UUID) AS $$
BEGIN
  -- This is a placeholder function
  -- Implement recurring booking logic based on pattern
  RETURN QUERY SELECT p_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate cancellation fee (referenced in API)
CREATE OR REPLACE FUNCTION calculate_cancellation_fee(
  p_booking_id UUID
) RETURNS DECIMAL AS $$
DECLARE
  v_fee DECIMAL;
  v_booking RECORD;
BEGIN
  SELECT * INTO v_booking FROM public.bookings WHERE id = p_booking_id;

  -- Simple cancellation fee logic (10% of total amount)
  v_fee := COALESCE(v_booking.total_amount * 0.1, 0);

  RETURN v_fee;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for match scoring
CREATE OR REPLACE FUNCTION calculate_match_score(
  p_user_id UUID,
  p_provider_id UUID
) RETURNS DECIMAL AS $$
DECLARE
  v_score DECIMAL := 50;
  v_user RECORD;
  v_provider RECORD;
BEGIN
  SELECT * INTO v_user FROM public.users WHERE id = p_user_id;
  SELECT * INTO v_provider FROM public.service_providers WHERE id = p_provider_id;

  IF v_user.city = v_provider.city THEN
    v_score := v_score + 20;
  END IF;

  IF v_user.services && v_provider.services THEN
    v_score := v_score + 15;
  END IF;

  IF v_provider.rating_avg IS NOT NULL THEN
    v_score := v_score + (v_provider.rating_avg * 2);
  END IF;

  IF v_provider.status = 'verified' THEN
    v_score := v_score + 5;
  END IF;

  RETURN LEAST(v_score, 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 12. TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Update updated_at timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to tables
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_bookings_updated_at') THEN
    CREATE TRIGGER update_bookings_updated_at
      BEFORE UPDATE ON public.bookings
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
    CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON public.users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_service_providers_updated_at') THEN
    CREATE TRIGGER update_service_providers_updated_at
      BEFORE UPDATE ON public.service_providers
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- =====================================================
-- 13. GRANT PERMISSIONS
-- =====================================================

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT INSERT ON public.analytics_events TO authenticated;
GRANT SELECT ON public.booking_reminders TO authenticated;
GRANT SELECT, INSERT ON public.service_agreements TO authenticated;
GRANT SELECT, INSERT ON public.booking_reviews TO authenticated;

-- Grant function permissions
GRANT EXECUTE ON FUNCTION check_booking_availability TO authenticated;
GRANT EXECUTE ON FUNCTION create_recurring_bookings TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_cancellation_fee TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_match_score TO authenticated;

-- =====================================================
-- 14. FINAL NOTES
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 021_complete_schema_alignment_final completed successfully!';
  RAISE NOTICE 'Tables created/updated: bookings, notifications, analytics_events, booking_reminders, service_agreements, booking_reviews';
  RAISE NOTICE 'Columns added to: users, service_providers, matches';
  RAISE NOTICE 'Functions created: check_booking_availability, create_recurring_bookings, calculate_cancellation_fee, calculate_match_score';
  RAISE NOTICE 'Indexes and RLS policies have been applied';
END $$;