-- Booking System Schema
-- Version: 1.0.0
-- Implements comprehensive booking functionality with calendar integration,
-- recurring bookings, cancellation policies, and payment tracking

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CORE BOOKING TABLES
-- ============================================================================

-- Main bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,

  -- Booking details
  service_type TEXT[] NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,

  -- Status tracking (pending, confirmed, cancelled, completed, no_show, rescheduled)
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show', 'rescheduled')),

  -- Pricing
  hourly_rate INTEGER, -- in cents
  total_amount INTEGER, -- in cents
  currency TEXT DEFAULT 'USD',
  payment_status TEXT DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_intent_id TEXT,

  -- Cancellation policy
  cancellation_policy JSONB DEFAULT '{"hours_notice": 24, "fee_percentage": 0}',
  cancellation_fee INTEGER DEFAULT 0,
  cancelled_by UUID REFERENCES auth.users(id),
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,

  -- Recurring bookings
  is_recurring BOOLEAN DEFAULT false,
  recurring_pattern JSONB, -- {type: 'weekly', interval: 1, days: [1,3,5], end_date: '2024-12-31'}
  parent_booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  recurring_group_id UUID, -- Groups all bookings in a recurring series

  -- Additional information
  special_instructions TEXT,
  location_details JSONB, -- {type: 'user_address' | 'provider_address' | 'virtual', address: {...}}
  attachments JSONB DEFAULT '[]',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT valid_time_range CHECK (end_time > start_time),
  CONSTRAINT valid_duration CHECK (duration_minutes > 0)
);

-- Available time slots for providers
CREATE TABLE IF NOT EXISTS public.booking_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  is_blocked BOOLEAN DEFAULT false,
  block_reason TEXT,
  max_bookings INTEGER DEFAULT 1,
  current_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure slots don't overlap for the same provider
  CONSTRAINT valid_slot_time CHECK (end_time > start_time),
  CONSTRAINT valid_booking_count CHECK (current_bookings <= max_bookings),
  UNIQUE(provider_id, date, start_time, end_time)
);

-- Booking reminders and notifications schedule
CREATE TABLE IF NOT EXISTS public.booking_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL
    CHECK (reminder_type IN ('confirmation', '24hr', '1hr', 'custom', 'follow_up')),
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  channel TEXT[] DEFAULT ARRAY['email', 'in_app'],
  retry_count INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service agreements and terms
CREATE TABLE IF NOT EXISTS public.service_agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  agreement_text TEXT NOT NULL,
  version TEXT NOT NULL,
  accepted_by UUID REFERENCES auth.users(id),
  accepted_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  signature_data JSONB, -- For digital signature if implemented
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SUPPORTING TABLES
-- ============================================================================

-- Track all booking status changes for audit trail
CREATE TABLE IF NOT EXISTS public.booking_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  change_reason TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post-service reviews linked to bookings
CREATE TABLE IF NOT EXISTS public.booking_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  service_quality INTEGER CHECK (service_quality >= 1 AND service_quality <= 5),
  punctuality INTEGER CHECK (punctuality >= 1 AND punctuality <= 5),
  communication INTEGER CHECK (communication >= 1 AND communication <= 5),
  value_for_money INTEGER CHECK (value_for_money >= 1 AND value_for_money <= 5),
  would_recommend BOOLEAN DEFAULT true,
  provider_response TEXT,
  provider_responded_at TIMESTAMPTZ,
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- External calendar synchronization
CREATE TABLE IF NOT EXISTS public.provider_calendar_sync (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE UNIQUE,
  calendar_provider TEXT CHECK (calendar_provider IN ('google', 'outlook', 'apple', 'caldav')),
  calendar_id TEXT,
  access_token TEXT, -- Encrypted in production
  refresh_token TEXT, -- Encrypted in production
  sync_token TEXT,
  last_synced TIMESTAMPTZ,
  sync_frequency_minutes INTEGER DEFAULT 15,
  is_active BOOLEAN DEFAULT true,
  error_count INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Booking notification preferences per user
CREATE TABLE IF NOT EXISTS public.booking_notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  push_enabled BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,

  -- Timing preferences (in minutes before booking)
  reminder_24hr BOOLEAN DEFAULT true,
  reminder_1hr BOOLEAN DEFAULT true,
  reminder_custom_minutes INTEGER,

  -- Quiet hours (no notifications during these times)
  quiet_hours_enabled BOOLEAN DEFAULT false,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  timezone TEXT DEFAULT 'America/Bogota',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id, status, booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON public.bookings(provider_id, status, booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date, start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status) WHERE status IN ('pending', 'confirmed');
CREATE INDEX IF NOT EXISTS idx_bookings_recurring ON public.bookings(recurring_group_id) WHERE recurring_group_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bookings_payment ON public.bookings(payment_status) WHERE payment_status != 'completed';

-- Booking slots indexes
CREATE INDEX IF NOT EXISTS idx_slots_provider_date ON public.booking_slots(provider_id, date, is_available);
CREATE INDEX IF NOT EXISTS idx_slots_available ON public.booking_slots(date, is_available) WHERE is_available = true;

-- Reminders indexes
CREATE INDEX IF NOT EXISTS idx_reminders_scheduled ON public.booking_reminders(scheduled_for, status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_reminders_booking ON public.booking_reminders(booking_id);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_provider ON public.booking_reviews(provider_id, rating);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.booking_reviews(user_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to check booking availability
CREATE OR REPLACE FUNCTION check_booking_availability(
  p_provider_id UUID,
  p_date DATE,
  p_start_time TIME,
  p_end_time TIME
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_available BOOLEAN;
BEGIN
  -- Check if there's an available slot
  SELECT EXISTS (
    SELECT 1
    FROM public.booking_slots
    WHERE provider_id = p_provider_id
      AND date = p_date
      AND start_time <= p_start_time
      AND end_time >= p_end_time
      AND is_available = true
      AND is_blocked = false
      AND current_bookings < max_bookings
  ) INTO v_available;

  -- Also check for conflicts with existing bookings
  IF v_available THEN
    SELECT NOT EXISTS (
      SELECT 1
      FROM public.bookings
      WHERE provider_id = p_provider_id
        AND booking_date = p_date
        AND status IN ('confirmed', 'pending')
        AND (
          (start_time <= p_start_time AND end_time > p_start_time) OR
          (start_time < p_end_time AND end_time >= p_end_time) OR
          (start_time >= p_start_time AND end_time <= p_end_time)
        )
    ) INTO v_available;
  END IF;

  RETURN v_available;
END;
$$;

-- Function to create recurring bookings
CREATE OR REPLACE FUNCTION create_recurring_bookings(
  p_booking_id UUID,
  p_pattern JSONB
)
RETURNS SETOF UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_booking RECORD;
  v_current_date DATE;
  v_end_date DATE;
  v_new_booking_id UUID;
  v_group_id UUID;
  v_interval_days INTEGER;
BEGIN
  -- Get the original booking
  SELECT * INTO v_booking FROM public.bookings WHERE id = p_booking_id;

  IF v_booking IS NULL THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;

  -- Generate group ID for the recurring series
  v_group_id := uuid_generate_v4();

  -- Update original booking with group ID
  UPDATE public.bookings
  SET recurring_group_id = v_group_id
  WHERE id = p_booking_id;

  -- Parse recurrence pattern
  v_current_date := v_booking.booking_date;
  v_end_date := (p_pattern->>'end_date')::DATE;
  v_interval_days := COALESCE((p_pattern->>'interval')::INTEGER, 7);

  -- Create recurring bookings
  WHILE v_current_date < v_end_date LOOP
    v_current_date := v_current_date + (v_interval_days || ' days')::INTERVAL;

    IF v_current_date <= v_end_date THEN
      INSERT INTO public.bookings (
        user_id, provider_id, service_type, booking_date,
        start_time, end_time, duration_minutes, status,
        hourly_rate, total_amount, currency,
        is_recurring, recurring_pattern, parent_booking_id,
        recurring_group_id, special_instructions, location_details
      )
      VALUES (
        v_booking.user_id, v_booking.provider_id, v_booking.service_type,
        v_current_date, v_booking.start_time, v_booking.end_time,
        v_booking.duration_minutes, 'pending',
        v_booking.hourly_rate, v_booking.total_amount, v_booking.currency,
        true, p_pattern, p_booking_id, v_group_id,
        v_booking.special_instructions, v_booking.location_details
      )
      RETURNING id INTO v_new_booking_id;

      RETURN NEXT v_new_booking_id;
    END IF;
  END LOOP;
END;
$$;

-- Function to calculate cancellation fee
CREATE OR REPLACE FUNCTION calculate_cancellation_fee(
  p_booking_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_booking RECORD;
  v_hours_notice INTEGER;
  v_fee_percentage INTEGER;
  v_fee INTEGER;
BEGIN
  SELECT * INTO v_booking FROM public.bookings WHERE id = p_booking_id;

  IF v_booking IS NULL THEN
    RETURN 0;
  END IF;

  -- Get cancellation policy
  v_hours_notice := COALESCE((v_booking.cancellation_policy->>'hours_notice')::INTEGER, 24);
  v_fee_percentage := COALESCE((v_booking.cancellation_policy->>'fee_percentage')::INTEGER, 0);

  -- Calculate hours until booking
  IF EXTRACT(EPOCH FROM (v_booking.booking_date + v_booking.start_time - NOW())) / 3600 < v_hours_notice THEN
    v_fee := (v_booking.total_amount * v_fee_percentage) / 100;
  ELSE
    v_fee := 0;
  END IF;

  RETURN v_fee;
END;
$$;

-- Trigger to update booking status history
CREATE OR REPLACE FUNCTION log_booking_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.booking_status_history (
      booking_id, old_status, new_status, changed_by
    )
    VALUES (
      NEW.id, OLD.status, NEW.status, auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_booking_status_history ON public.bookings;
CREATE TRIGGER trigger_booking_status_history
AFTER UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION log_booking_status_change();

-- Trigger to update provider rating after review
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update rating in providers table if it exists
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema = 'public'
             AND table_name = 'providers'
             AND column_name = 'rating') THEN
    UPDATE public.providers
    SET
      rating = (
        SELECT AVG(rating)::DECIMAL(3,2)
        FROM public.booking_reviews
        WHERE provider_id = NEW.provider_id
      ),
      review_count = (
        SELECT COUNT(*)
        FROM public.booking_reviews
        WHERE provider_id = NEW.provider_id
      )
    WHERE id = NEW.provider_id;
  END IF;

  -- Also update in service_providers table if it exists
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema = 'public'
             AND table_name = 'service_providers'
             AND column_name = 'rating_avg') THEN
    UPDATE public.service_providers
    SET
      rating_avg = (
        SELECT AVG(rating)::DECIMAL(3,2)
        FROM public.booking_reviews
        WHERE provider_id = NEW.provider_id
      ),
      reviews_count = (
        SELECT COUNT(*)
        FROM public.booking_reviews
        WHERE provider_id = NEW.provider_id
      )
    WHERE id = NEW.provider_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_provider_rating ON public.booking_reviews;
CREATE TRIGGER trigger_update_provider_rating
AFTER INSERT OR UPDATE ON public.booking_reviews
FOR EACH ROW
EXECUTE FUNCTION update_provider_rating();

-- Trigger to auto-create booking reminders
CREATE OR REPLACE FUNCTION create_booking_reminders()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    -- 24 hour reminder
    INSERT INTO public.booking_reminders (
      booking_id, reminder_type, scheduled_for
    )
    VALUES (
      NEW.id,
      '24hr',
      (NEW.booking_date + NEW.start_time - INTERVAL '24 hours')
    );

    -- 1 hour reminder
    INSERT INTO public.booking_reminders (
      booking_id, reminder_type, scheduled_for
    )
    VALUES (
      NEW.id,
      '1hr',
      (NEW.booking_date + NEW.start_time - INTERVAL '1 hour')
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_create_reminders ON public.bookings;
CREATE TRIGGER trigger_create_reminders
AFTER UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION create_booking_reminders();

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all booking tables
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_calendar_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Bookings policies
CREATE POLICY bookings_user_access ON public.bookings
  FOR ALL USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.providers p
      WHERE p.id = provider_id
      AND p.id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.service_providers sp
      WHERE sp.id = provider_id
      AND sp.id = auth.uid()
    )
  );

-- Booking slots policies (providers manage their own, users can view)
CREATE POLICY slots_provider_manage ON public.booking_slots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.providers p
      WHERE p.id = provider_id
      AND p.id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.service_providers sp
      WHERE sp.id = provider_id
      AND sp.id = auth.uid()
    )
  );

CREATE POLICY slots_user_view ON public.booking_slots
  FOR SELECT USING (is_available = true);

-- Reviews policies
CREATE POLICY reviews_create ON public.booking_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY reviews_view ON public.booking_reviews
  FOR SELECT USING (true);

-- Notification preferences policies
CREATE POLICY notification_prefs_own ON public.booking_notification_preferences
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- SAMPLE DATA AND INITIAL SETUP
-- ============================================================================

-- Create default notification preferences for existing users
INSERT INTO public.booking_notification_preferences (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;