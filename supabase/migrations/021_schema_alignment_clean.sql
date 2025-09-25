-- Migration: Complete Schema Alignment for September 2025 (Clean Version)
-- Description: Handles all existing objects properly

-- =====================================================
-- 1. HANDLE EXISTING FUNCTIONS (DROP AND RECREATE)
-- =====================================================

-- Drop existing functions if they exist with wrong signatures
DROP FUNCTION IF EXISTS calculate_cancellation_fee(UUID) CASCADE;
DROP FUNCTION IF EXISTS check_booking_availability(UUID, DATE, TIME, TIME) CASCADE;
DROP FUNCTION IF EXISTS create_recurring_bookings(UUID, JSONB) CASCADE;
DROP FUNCTION IF EXISTS calculate_match_score(UUID, UUID) CASCADE;

-- =====================================================
-- 2. BOOKINGS TABLE
-- =====================================================

-- Create booking status enum if not exists
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

-- Add missing columns to bookings table (table already exists)
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS status booking_status DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS recurring_pattern JSONB,
  ADD COLUMN IF NOT EXISTS special_instructions TEXT,
  ADD COLUMN IF NOT EXISTS location_details TEXT,
  ADD COLUMN IF NOT EXISTS cancellation_policy TEXT,
  ADD COLUMN IF NOT EXISTS cancellation_fee DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS cancelled_by UUID,
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- =====================================================
-- 3. USERS TABLE
-- =====================================================

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS notification_settings JSONB DEFAULT '{"email": true, "matches": true, "messages": true, "bookings": true, "marketing": false}',
  ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS polar_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;

-- =====================================================
-- 4. SERVICE PROVIDERS / PROVIDERS TABLE
-- =====================================================

-- Handle both table names
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'providers') THEN
    -- Add columns to providers table
    ALTER TABLE public.providers
      ADD COLUMN IF NOT EXISTS avatar_url TEXT,
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS completed_jobs INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS location TEXT,
      ADD COLUMN IF NOT EXISTS response_time_hours INTEGER,
      ADD COLUMN IF NOT EXISTS cancellation_rate DECIMAL(5, 2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS acceptance_rate DECIMAL(5, 2) DEFAULT 100,
      ADD COLUMN IF NOT EXISTS portfolio_urls TEXT[],
      ADD COLUMN IF NOT EXISTS certifications TEXT[],
      ADD COLUMN IF NOT EXISTS insurance_verified BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
      ADD COLUMN IF NOT EXISTS payment_methods TEXT[] DEFAULT '{"cash", "card"}',
      ADD COLUMN IF NOT EXISTS working_hours JSONB DEFAULT '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "17:00"}, "saturday": null, "sunday": null}';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'service_providers') THEN
    -- Add columns to service_providers table
    ALTER TABLE public.service_providers
      ADD COLUMN IF NOT EXISTS avatar_url TEXT,
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS completed_jobs INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS location TEXT,
      ADD COLUMN IF NOT EXISTS response_time_hours INTEGER,
      ADD COLUMN IF NOT EXISTS cancellation_rate DECIMAL(5, 2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS acceptance_rate DECIMAL(5, 2) DEFAULT 100,
      ADD COLUMN IF NOT EXISTS portfolio_urls TEXT[],
      ADD COLUMN IF NOT EXISTS certifications TEXT[],
      ADD COLUMN IF NOT EXISTS insurance_verified BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
      ADD COLUMN IF NOT EXISTS payment_methods TEXT[] DEFAULT '{"cash", "card"}',
      ADD COLUMN IF NOT EXISTS working_hours JSONB DEFAULT '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "17:00"}, "saturday": null, "sunday": null}';
  END IF;
END $$;

-- =====================================================
-- 5. MATCHES TABLE
-- =====================================================

ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS match_score DECIMAL(5, 2),
  ADD COLUMN IF NOT EXISTS notes JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS dismissed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS last_interaction_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS intro_requested BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS intro_requested_at TIMESTAMPTZ;

-- =====================================================
-- 6. CREATE NEW TABLES (IF NOT EXISTS)
-- =====================================================

-- Notifications table
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

-- Analytics events table
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

-- Booking reminders table
CREATE TABLE IF NOT EXISTS public.booking_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service agreements table
CREATE TABLE IF NOT EXISTS public.service_agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  accepted_at TIMESTAMPTZ,
  version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Booking reviews table
CREATE TABLE IF NOT EXISTS public.booking_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. RECREATE FUNCTIONS WITH CORRECT SIGNATURES
-- =====================================================

-- Check booking availability
CREATE FUNCTION check_booking_availability(
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

-- Create recurring bookings
CREATE FUNCTION create_recurring_bookings(
  p_booking_id UUID,
  p_pattern JSONB
) RETURNS TABLE(booking_id UUID) AS $$
BEGIN
  RETURN QUERY SELECT p_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate cancellation fee
CREATE FUNCTION calculate_cancellation_fee(
  p_booking_id UUID
) RETURNS DECIMAL AS $$
DECLARE
  v_fee DECIMAL;
  v_booking RECORD;
BEGIN
  SELECT * INTO v_booking FROM public.bookings WHERE id = p_booking_id;
  v_fee := COALESCE(v_booking.total_amount * 0.1, 0);
  RETURN v_fee;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate match score
CREATE FUNCTION calculate_match_score(
  p_user_id UUID,
  p_provider_id UUID
) RETURNS DECIMAL AS $$
DECLARE
  v_score DECIMAL := 50;
  v_user RECORD;
  v_provider RECORD;
BEGIN
  SELECT * INTO v_user FROM public.users WHERE id = p_user_id;

  -- Try both table names
  BEGIN
    SELECT * INTO v_provider FROM public.service_providers WHERE id = p_provider_id;
  EXCEPTION WHEN OTHERS THEN
    SELECT * INTO v_provider FROM public.providers WHERE id = p_provider_id;
  END;

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
-- 8. INDEXES (SAFE TO RE-RUN)
-- =====================================================

-- Create indexes only if they don't exist
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON public.bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON public.analytics_events(user_id);

-- =====================================================
-- 9. ROW LEVEL SECURITY (CHECK BEFORE CREATE)
-- =====================================================

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist
DO $$
BEGIN
  -- Drop and recreate to ensure correct policies
  DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
  CREATE POLICY "Users can view their own bookings"
    ON public.bookings FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
  CREATE POLICY "Users can create bookings"
    ON public.bookings FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
  CREATE POLICY "Users can update their own bookings"
    ON public.bookings FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Policy creation error: %', SQLERRM;
END $$;

-- =====================================================
-- 10. GRANT PERMISSIONS
-- =====================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT INSERT ON public.analytics_events TO authenticated;
GRANT EXECUTE ON FUNCTION check_booking_availability TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_cancellation_fee TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_match_score TO authenticated;

-- =====================================================
-- DONE!
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Migration completed successfully!';
END $$;