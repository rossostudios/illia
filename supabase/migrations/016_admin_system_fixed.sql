-- ============================================================================
-- ADMIN SYSTEM SETUP (FIXED VERSION)
-- Version: 1.0.1
-- Date: 2025-09-23
-- Description: Creates admin roles, permissions, and audit logging system
--              Fixed to work with existing users and service_providers tables
-- ============================================================================

-- ============================================================================
-- ADD MISSING COLUMNS TO USERS TABLE
-- ============================================================================

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS is_provider BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS provider_type TEXT,
ADD COLUMN IF NOT EXISTS hourly_rate INTEGER,
ADD COLUMN IF NOT EXISTS specialties TEXT[],
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================================================
-- ADMIN ROLES AND PERMISSIONS
-- ============================================================================

-- Create admin_roles enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_role') THEN
        CREATE TYPE admin_role AS ENUM ('super_admin', 'admin', 'moderator');
    END IF;
END $$;

-- Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role admin_role NOT NULL DEFAULT 'moderator',
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create admin_audit_logs table for tracking all admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin_sessions table for enhanced security
CREATE TABLE IF NOT EXISTS public.admin_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    ip_address INET,
    user_agent TEXT,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PROVIDER APPROVAL SYSTEM
-- ============================================================================

-- Add approval fields to users table if not exists
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'suspended')),
ADD COLUMN IF NOT EXISTS approval_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.admin_users(id),
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS suspended_reason TEXT,
ADD COLUMN IF NOT EXISTS suspended_by UUID REFERENCES public.admin_users(id);

-- Also add approval fields to service_providers table if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables
               WHERE table_schema = 'public' AND table_name = 'service_providers') THEN
        ALTER TABLE public.service_providers
        ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'suspended')),
        ADD COLUMN IF NOT EXISTS approval_date TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.admin_users(id),
        ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
        ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS suspended_reason TEXT,
        ADD COLUMN IF NOT EXISTS suspended_by UUID REFERENCES public.admin_users(id);
    END IF;
END $$;

-- Create provider_approval_queue view for easy access
-- This view will work whether or not service_providers table exists
CREATE OR REPLACE VIEW public.provider_approval_queue AS
SELECT
    u.id,
    COALESCE(u.username, u.name) as username,
    COALESCE(u.display_name, u.name) as display_name,
    u.email,
    u.is_provider,
    u.provider_type,
    u.approval_status,
    u.created_at,
    u.bio,
    u.specialties,
    u.hourly_rate,
    COALESCE(u.location, u.city) as location,
    0 as review_count,  -- We'll handle this separately if booking_reviews exists
    0::NUMERIC as average_rating
FROM public.users u
WHERE u.is_provider = true;

-- ============================================================================
-- SUPPORT TICKET SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('technical', 'billing', 'provider', 'booking', 'account', 'other')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed')),
    assigned_to UUID REFERENCES public.admin_users(id),
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.support_ticket_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PLATFORM SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.platform_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'general',
    updated_by UUID REFERENCES public.admin_users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default platform settings
INSERT INTO public.platform_settings (key, value, category, description) VALUES
    ('provider_commission_rate', '"0.15"', 'billing', 'Commission rate for provider bookings'),
    ('min_booking_duration', '"30"', 'booking', 'Minimum booking duration in minutes'),
    ('max_booking_duration', '"480"', 'booking', 'Maximum booking duration in minutes'),
    ('booking_cancellation_hours', '"24"', 'booking', 'Hours before booking when cancellation is allowed'),
    ('provider_auto_approval', '"false"', 'provider', 'Auto-approve new providers'),
    ('require_provider_verification', '"true"', 'provider', 'Require identity verification for providers'),
    ('maintenance_mode', '"false"', 'system', 'Enable maintenance mode'),
    ('new_user_notifications', '"true"', 'notifications', 'Send notifications for new user signups')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- ANALYTICS AGGREGATION TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.platform_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    metric_type TEXT NOT NULL,
    metric_value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(date, metric_type)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Admin tables indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_id ON public.admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON public.admin_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_resource ON public.admin_audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON public.admin_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON public.admin_sessions(expires_at);

-- Provider approval indexes
CREATE INDEX IF NOT EXISTS idx_users_approval_status ON public.users(approval_status) WHERE is_provider = true;
CREATE INDEX IF NOT EXISTS idx_users_provider_pending ON public.users(created_at DESC) WHERE is_provider = true AND approval_status = 'pending';

-- Support ticket indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status) WHERE status != 'closed';
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned ON public.support_tickets(assigned_to) WHERE status IN ('open', 'in_progress');
CREATE INDEX IF NOT EXISTS idx_support_ticket_messages_ticket ON public.support_ticket_messages(ticket_id);

-- Platform settings index
CREATE INDEX IF NOT EXISTS idx_platform_settings_category ON public.platform_settings(category);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all admin tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_analytics ENABLE ROW LEVEL SECURITY;

-- Admin users policies
CREATE POLICY "Admin users are viewable by admins" ON public.admin_users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users au
            WHERE au.user_id = auth.uid() AND au.is_active = true
        )
    );

CREATE POLICY "Super admins can manage admin users" ON public.admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users au
            WHERE au.user_id = auth.uid()
            AND au.role = 'super_admin'
            AND au.is_active = true
        )
    );

-- Admin audit logs policies
CREATE POLICY "Admins can view audit logs" ON public.admin_audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users au
            WHERE au.user_id = auth.uid() AND au.is_active = true
        )
    );

CREATE POLICY "System can insert audit logs" ON public.admin_audit_logs
    FOR INSERT WITH CHECK (true);

-- Admin sessions policies
CREATE POLICY "Admins can manage their own sessions" ON public.admin_sessions
    FOR ALL USING (
        admin_id IN (
            SELECT id FROM public.admin_users WHERE user_id = auth.uid()
        )
    );

-- Support tickets policies
CREATE POLICY "Users can view their own tickets" ON public.support_tickets
    FOR SELECT USING (user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.admin_users au
        WHERE au.user_id = auth.uid() AND au.is_active = true
    ));

CREATE POLICY "Users can create tickets" ON public.support_tickets
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all tickets" ON public.support_tickets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users au
            WHERE au.user_id = auth.uid() AND au.is_active = true
        )
    );

-- Support ticket messages policies
CREATE POLICY "Users can view messages for their tickets" ON public.support_ticket_messages
    FOR SELECT USING (
        ticket_id IN (
            SELECT id FROM public.support_tickets WHERE user_id = auth.uid()
        ) OR EXISTS (
            SELECT 1 FROM public.admin_users au
            WHERE au.user_id = auth.uid() AND au.is_active = true
        )
    );

CREATE POLICY "Users and admins can send messages" ON public.support_ticket_messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND (
            ticket_id IN (
                SELECT id FROM public.support_tickets WHERE user_id = auth.uid()
            ) OR EXISTS (
                SELECT 1 FROM public.admin_users au
                WHERE au.user_id = auth.uid() AND au.is_active = true
            )
        )
    );

-- Platform settings policies
CREATE POLICY "Admins can view platform settings" ON public.platform_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users au
            WHERE au.user_id = auth.uid() AND au.is_active = true
        )
    );

CREATE POLICY "Super admins can manage platform settings" ON public.platform_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users au
            WHERE au.user_id = auth.uid()
            AND au.role = 'super_admin'
            AND au.is_active = true
        )
    );

-- Platform analytics policies
CREATE POLICY "Admins can view analytics" ON public.platform_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users au
            WHERE au.user_id = auth.uid() AND au.is_active = true
        )
    );

CREATE POLICY "System can manage analytics" ON public.platform_analytics
    FOR ALL USING (true);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = user_uuid AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get admin role
CREATE OR REPLACE FUNCTION public.get_admin_role(user_uuid UUID DEFAULT auth.uid())
RETURNS admin_role AS $$
DECLARE
    user_role admin_role;
BEGIN
    SELECT role INTO user_role
    FROM public.admin_users
    WHERE user_id = user_uuid AND is_active = true;

    RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log admin action
CREATE OR REPLACE FUNCTION public.log_admin_action(
    action_type TEXT,
    resource TEXT,
    resource_uuid UUID DEFAULT NULL,
    action_details JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    admin_uuid UUID;
    log_id UUID;
BEGIN
    SELECT id INTO admin_uuid
    FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = true;

    IF admin_uuid IS NULL THEN
        RAISE EXCEPTION 'User is not an admin';
    END IF;

    INSERT INTO public.admin_audit_logs (
        admin_id,
        action,
        resource_type,
        resource_id,
        details
    ) VALUES (
        admin_uuid,
        action_type,
        resource,
        resource_uuid,
        action_details
    ) RETURNING id INTO log_id;

    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to approve provider
CREATE OR REPLACE FUNCTION public.approve_provider(
    provider_uuid UUID,
    admin_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    admin_uuid UUID;
BEGIN
    SELECT id INTO admin_uuid
    FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = true;

    IF admin_uuid IS NULL THEN
        RAISE EXCEPTION 'User is not an admin';
    END IF;

    -- Update users table
    UPDATE public.users
    SET
        approval_status = 'approved',
        approval_date = NOW(),
        approved_by = admin_uuid
    WHERE id = provider_uuid AND is_provider = true;

    PERFORM public.log_admin_action(
        'approve_provider',
        'user',
        provider_uuid,
        jsonb_build_object('notes', admin_notes)
    );

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reject provider
CREATE OR REPLACE FUNCTION public.reject_provider(
    provider_uuid UUID,
    reason TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    admin_uuid UUID;
BEGIN
    SELECT id INTO admin_uuid
    FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = true;

    IF admin_uuid IS NULL THEN
        RAISE EXCEPTION 'User is not an admin';
    END IF;

    -- Update users table
    UPDATE public.users
    SET
        approval_status = 'rejected',
        rejection_reason = reason,
        approved_by = admin_uuid,
        approval_date = NOW()
    WHERE id = provider_uuid AND is_provider = true;

    PERFORM public.log_admin_action(
        'reject_provider',
        'user',
        provider_uuid,
        jsonb_build_object('reason', reason)
    );

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get platform statistics
CREATE OR REPLACE FUNCTION public.get_platform_stats()
RETURNS TABLE (
    total_users BIGINT,
    total_providers BIGINT,
    pending_providers BIGINT,
    total_bookings BIGINT,
    active_bookings BIGINT,
    total_revenue NUMERIC,
    open_tickets BIGINT,
    today_signups BIGINT
) AS $$
DECLARE
    has_bookings BOOLEAN;
BEGIN
    -- Check if tables exist
    SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'bookings') INTO has_bookings;

    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM public.users WHERE is_deleted = false)::BIGINT as total_users,
        (SELECT COUNT(*) FROM public.users WHERE is_provider = true AND is_deleted = false)::BIGINT as total_providers,
        (SELECT COUNT(*) FROM public.users WHERE is_provider = true AND approval_status = 'pending')::BIGINT as pending_providers,
        CASE WHEN has_bookings THEN
            (SELECT COUNT(*) FROM public.bookings)::BIGINT
        ELSE 0 END as total_bookings,
        CASE WHEN has_bookings THEN
            (SELECT COUNT(*) FROM public.bookings WHERE status IN ('pending', 'confirmed'))::BIGINT
        ELSE 0 END as active_bookings,
        CASE WHEN has_bookings THEN
            COALESCE((SELECT SUM(total_amount) FROM public.bookings WHERE status = 'completed'), 0)::NUMERIC
        ELSE 0 END as total_revenue,
        COALESCE((SELECT COUNT(*) FROM public.support_tickets WHERE status IN ('open', 'in_progress')), 0)::BIGINT as open_tickets,
        (SELECT COUNT(*) FROM public.users WHERE DATE(created_at) = CURRENT_DATE)::BIGINT as today_signups;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_admin_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_admin_updated_at();

CREATE TRIGGER update_support_tickets_updated_at
    BEFORE UPDATE ON public.support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_admin_updated_at();

CREATE TRIGGER update_platform_settings_updated_at
    BEFORE UPDATE ON public.platform_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_admin_updated_at();

-- ============================================================================
-- GRANTS
-- ============================================================================

-- Grant necessary permissions
GRANT ALL ON public.admin_users TO authenticated;
GRANT ALL ON public.admin_audit_logs TO authenticated;
GRANT ALL ON public.admin_sessions TO authenticated;
GRANT ALL ON public.support_tickets TO authenticated;
GRANT ALL ON public.support_ticket_messages TO authenticated;
GRANT ALL ON public.platform_settings TO authenticated;
GRANT ALL ON public.platform_analytics TO authenticated;
GRANT SELECT ON public.provider_approval_queue TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_role TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_admin_action TO authenticated;
GRANT EXECUTE ON FUNCTION public.approve_provider TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_provider TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_platform_stats TO authenticated;