-- Migration: Add Missing Tables for Complete App Functionality
-- Description: Creates only the missing tables that don't exist yet
-- Date: 2025-09-25

-- First, ensure we have the UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. BOOKINGS TABLE (ALREADY EXISTS - SKIP)
-- =====================================================
-- Note: bookings table already exists from migration 011_booking_system.sql
-- It has a different structure but we'll work with what exists

-- =====================================================
-- 2. COMMUNITY EVENTS TABLE (NEW)
-- =====================================================

-- Drop table if it exists with wrong schema
DROP TABLE IF EXISTS public.community_events CASCADE;

CREATE TABLE public.community_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  host_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Reference profiles
  location TEXT,
  tags TEXT[],
  capacity INTEGER,
  attendees_count INTEGER DEFAULT 0,
  is_online BOOLEAN DEFAULT false,
  meeting_link TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for community_events
CREATE INDEX idx_community_events_start_at ON public.community_events(start_at);
CREATE INDEX idx_community_events_host_id ON public.community_events(host_id);
CREATE INDEX idx_community_events_status ON public.community_events(status);

-- =====================================================
-- 3. BOOKING REMINDERS TABLE (NEW)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.booking_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('1_day_before', '1_hour_before', 'custom')),
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for booking_reminders
CREATE INDEX IF NOT EXISTS idx_booking_reminders_booking_id ON public.booking_reminders(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_reminders_scheduled ON public.booking_reminders(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_booking_reminders_status ON public.booking_reminders(status);

-- =====================================================
-- 4. SERVICE AGREEMENTS TABLE (NEW)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.service_agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  terms_content TEXT NOT NULL,
  accepted_at TIMESTAMPTZ,
  accepted_by UUID REFERENCES auth.users(id), -- Match existing bookings table pattern
  version TEXT DEFAULT '1.0',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for service_agreements
CREATE INDEX IF NOT EXISTS idx_service_agreements_booking_id ON public.service_agreements(booking_id);

-- =====================================================
-- 5. BOOKING REVIEWS TABLE (ALREADY EXISTS - SKIP)
-- =====================================================
-- Note: booking_reviews table already exists from migration 011_booking_system.sql
-- It has more fields and doesn't include is_public column

-- =====================================================
-- 6. NOTIFICATIONS TABLE (NEW)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- Reference profiles
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON public.notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- =====================================================
-- 7. ANALYTICS EVENTS TABLE (NEW)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- Reference profiles
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

-- Create indexes for analytics_events
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON public.analytics_events(session_id);

-- =====================================================
-- 8. EVENT ATTENDEES TABLE (NEW)
-- =====================================================

-- Drop table if it exists to avoid conflicts
DROP TABLE IF EXISTS public.event_attendees CASCADE;

CREATE TABLE public.event_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.community_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- Reference profiles
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled', 'no_show')),
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  attended_at TIMESTAMPTZ,
  UNIQUE(event_id, user_id)
);

-- Create indexes for event_attendees
CREATE INDEX idx_event_attendees_event_id ON public.event_attendees(event_id);
CREATE INDEX idx_event_attendees_user_id ON public.event_attendees(user_id);

-- =====================================================
-- 9. FUNCTIONS FOR BOOKINGS
-- =====================================================
-- Note: Skipping booking functions since the bookings table
-- already exists with different structure from migration 011

-- =====================================================
-- 10. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all new tables (only if not already enabled)
DO $$
BEGIN
  -- Note: Skipping bookings table as it exists from migration 011

  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'community_events' AND rowsecurity = true) THEN
    ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'booking_reminders' AND rowsecurity = true) THEN
    ALTER TABLE public.booking_reminders ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'service_agreements' AND rowsecurity = true) THEN
    ALTER TABLE public.service_agreements ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Note: Skipping booking_reviews RLS as that table exists from migration 011

  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'notifications' AND rowsecurity = true) THEN
    ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'analytics_events' AND rowsecurity = true) THEN
    ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'event_attendees' AND rowsecurity = true) THEN
    ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Note: Skipping bookings policies as that table exists from migration 011

-- Community events policies
DROP POLICY IF EXISTS "Anyone can view public events" ON public.community_events;
DROP POLICY IF EXISTS "Users can create events" ON public.community_events;
DROP POLICY IF EXISTS "Users can update their own events" ON public.community_events;

CREATE POLICY "Anyone can view public events"
  ON public.community_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create events"
  ON public.community_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Users can update their own events"
  ON public.community_events FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_id);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Analytics events policies
DROP POLICY IF EXISTS "Users can create their own analytics events" ON public.analytics_events;

CREATE POLICY "Users can create their own analytics events"
  ON public.analytics_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Note: Skipping booking_reviews policies as that table exists from migration 011
-- and has a different structure (no is_public column)

-- Event attendees policies
DROP POLICY IF EXISTS "Anyone can view event attendees" ON public.event_attendees;
DROP POLICY IF EXISTS "Users can register for events" ON public.event_attendees;
DROP POLICY IF EXISTS "Users can update their registration" ON public.event_attendees;

CREATE POLICY "Anyone can view event attendees"
  ON public.event_attendees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can register for events"
  ON public.event_attendees FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their registration"
  ON public.event_attendees FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- 11. GRANT PERMISSIONS
-- =====================================================

GRANT USAGE ON SCHEMA public TO authenticated;
-- Note: Skipping bookings and booking_reviews GRANT as those tables exist from migration 011
GRANT SELECT, INSERT, UPDATE ON public.community_events TO authenticated;
GRANT SELECT, INSERT ON public.booking_reminders TO authenticated;
GRANT SELECT, INSERT ON public.service_agreements TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;
GRANT INSERT ON public.analytics_events TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.event_attendees TO authenticated;

-- Note: Skipping function grants as those functions are not created in this migration

-- =====================================================
-- 12. TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to tables with updated_at
-- Note: Skipping bookings and booking_reviews triggers as those tables exist from migration 011

CREATE TRIGGER update_community_events_updated_at BEFORE UPDATE ON public.community_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Successfully created missing tables!';
  RAISE NOTICE '📊 Created tables: community_events, booking_reminders, service_agreements, notifications, analytics_events, event_attendees';
  RAISE NOTICE '📊 Skipped existing tables: bookings, booking_reviews (from migration 011)';
  RAISE NOTICE '🔐 Applied RLS policies to new tables';
  RAISE NOTICE '⚡ Created indexes for optimal performance';
END $$;