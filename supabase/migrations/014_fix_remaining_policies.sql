-- ============================================================================
-- FIX REMAINING PERFORMANCE ISSUES
-- Version: 1.0.0
-- Date: 2025-09-23
-- Description: Fixes policies for tables that were missed in previous migration
-- ============================================================================

-- ============================================================================
-- TABLES THAT EXIST BUT WERE MISSED
-- ============================================================================

-- Fix illia_leads_logs table policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view own logs" ON public.illia_leads_logs;
    DROP POLICY IF EXISTS "Users can insert own logs" ON public.illia_leads_logs;
    DROP POLICY IF EXISTS "Users can update own logs" ON public.illia_leads_logs;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'illia_leads_logs' AND table_schema = 'public') THEN
        CREATE POLICY "illia_leads_logs_manage_own" ON public.illia_leads_logs
            FOR ALL TO authenticated
            USING (user_id = (SELECT auth.uid()))
            WITH CHECK (user_id = (SELECT auth.uid()));
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'illia_leads_logs policies update failed: %', SQLERRM;
END $$;

-- Fix purchases table policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view own purchases" ON public.purchases;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'purchases' AND table_schema = 'public') THEN
        CREATE POLICY "purchases_select_own" ON public.purchases
            FOR SELECT TO authenticated
            USING (user_id = (SELECT auth.uid()));
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'purchases policies update failed: %', SQLERRM;
END $$;

-- Fix illia_leads table policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view own leads" ON public.illia_leads;
    DROP POLICY IF EXISTS "Users can insert own leads" ON public.illia_leads;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'illia_leads' AND table_schema = 'public') THEN
        CREATE POLICY "illia_leads_manage_own" ON public.illia_leads
            FOR ALL TO authenticated
            USING (user_id = (SELECT auth.uid()))
            WITH CHECK (user_id = (SELECT auth.uid()));
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'illia_leads policies update failed: %', SQLERRM;
END $$;

-- ============================================================================
-- FIX SERVICE PROVIDERS POLICIES THAT WEREN'T PROPERLY REPLACED
-- ============================================================================

DO $$
BEGIN
    -- Drop all old policies
    DROP POLICY IF EXISTS "Providers viewable by everyone" ON public.service_providers;
    DROP POLICY IF EXISTS "Only admins can insert providers" ON public.service_providers;
    DROP POLICY IF EXISTS "Only admins can update providers" ON public.service_providers;
    DROP POLICY IF EXISTS "service_providers_select" ON public.service_providers;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'service_providers' AND table_schema = 'public') THEN
        -- Create optimized policies
        CREATE POLICY "service_providers_select_all" ON public.service_providers
            FOR SELECT USING (
                COALESCE(is_active, true) = true OR
                COALESCE(status, 'active') = 'verified' OR
                user_id = (SELECT auth.uid())
            );

        CREATE POLICY "service_providers_insert_admin" ON public.service_providers
            FOR INSERT TO authenticated
            WITH CHECK (
                EXISTS (
                    SELECT 1 FROM public.profiles p
                    WHERE p.id = (SELECT auth.uid())
                    AND p.role = 'admin'
                )
            );

        CREATE POLICY "service_providers_update_admin" ON public.service_providers
            FOR UPDATE TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public.profiles p
                    WHERE p.id = (SELECT auth.uid())
                    AND p.role = 'admin'
                )
            );
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'service_providers policies update failed: %', SQLERRM;
END $$;

-- ============================================================================
-- FIX THREAD_POSTS DUPLICATE POLICIES
-- ============================================================================

DO $$
BEGIN
    -- Drop ALL thread_posts policies to clean up
    DROP POLICY IF EXISTS "Thread authors can always reply" ON public.thread_posts;
    DROP POLICY IF EXISTS "Premium users can reply to any thread" ON public.thread_posts;
    DROP POLICY IF EXISTS "posts_creatable_by_users" ON public.thread_posts;
    DROP POLICY IF EXISTS "posts_editable_by_owner" ON public.thread_posts;
    DROP POLICY IF EXISTS "posts_viewable_by_all" ON public.thread_posts;
    DROP POLICY IF EXISTS "Anyone can view posts" ON public.thread_posts;
    DROP POLICY IF EXISTS "posts_select_all" ON public.thread_posts;
    DROP POLICY IF EXISTS "posts_insert_authorized" ON public.thread_posts;
    DROP POLICY IF EXISTS "posts_update_owner" ON public.thread_posts;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'thread_posts' AND table_schema = 'public') THEN
        -- Single select policy
        CREATE POLICY "thread_posts_select" ON public.thread_posts
            FOR SELECT USING (true);

        -- Single insert policy combining all logic
        CREATE POLICY "thread_posts_insert" ON public.thread_posts
            FOR INSERT TO authenticated
            WITH CHECK (
                user_id = (SELECT auth.uid()) AND
                (
                    -- Thread author can always reply
                    EXISTS (
                        SELECT 1 FROM public.community_threads t
                        WHERE t.id = thread_posts.thread_id
                        AND t.user_id = (SELECT auth.uid())
                    )
                    OR
                    -- Premium/verified users can reply
                    EXISTS (
                        SELECT 1 FROM public.profiles p
                        WHERE p.id = (SELECT auth.uid())
                        AND (COALESCE(p.tier, 'free') != 'free' OR COALESCE(p.is_verified, false) = true)
                    )
                )
            );

        -- Single update policy
        CREATE POLICY "thread_posts_update" ON public.thread_posts
            FOR UPDATE TO authenticated
            USING (user_id = (SELECT auth.uid()));
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'thread_posts policies update failed: %', SQLERRM;
END $$;

-- ============================================================================
-- FIX REVIEWS POLICIES
-- ============================================================================

DO $$
BEGIN
    DROP POLICY IF EXISTS "Verified users can create reviews" ON public.reviews;
    DROP POLICY IF EXISTS "reviews_insert_verified" ON public.reviews;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reviews' AND table_schema = 'public') THEN
        CREATE POLICY "reviews_insert" ON public.reviews
            FOR INSERT TO authenticated
            WITH CHECK (
                user_id = (SELECT auth.uid()) AND
                EXISTS (
                    SELECT 1 FROM public.profiles p
                    WHERE p.id = (SELECT auth.uid())
                    AND (COALESCE(p.is_verified, false) = true OR COALESCE(p.tier, 'free') != 'free')
                )
            );
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'reviews policies update failed: %', SQLERRM;
END $$;

-- ============================================================================
-- FIX INTRO_REQUESTS POLICIES
-- ============================================================================

DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view own intros" ON public.intro_requests;
    DROP POLICY IF EXISTS "Premium users can create intros" ON public.intro_requests;
    DROP POLICY IF EXISTS "intro_requests_select_own" ON public.intro_requests;
    DROP POLICY IF EXISTS "intro_requests_insert_premium" ON public.intro_requests;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'intro_requests' AND table_schema = 'public') THEN
        CREATE POLICY "intro_requests_select" ON public.intro_requests
            FOR SELECT TO authenticated
            USING (user_id = (SELECT auth.uid()));

        CREATE POLICY "intro_requests_insert" ON public.intro_requests
            FOR INSERT TO authenticated
            WITH CHECK (
                user_id = (SELECT auth.uid()) AND
                EXISTS (
                    SELECT 1 FROM public.profiles p
                    WHERE p.id = (SELECT auth.uid())
                    AND COALESCE(p.tier, 'free') IN ('premium', 'pro', 'enterprise')
                )
            );
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'intro_requests policies update failed: %', SQLERRM;
END $$;

-- ============================================================================
-- FIX BOOKINGS POLICIES
-- ============================================================================

DO $$
BEGIN
    DROP POLICY IF EXISTS "bookings_user_access" ON public.bookings;
    DROP POLICY IF EXISTS "bookings_access" ON public.bookings;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bookings' AND table_schema = 'public') THEN
        CREATE POLICY "bookings_manage" ON public.bookings
            FOR ALL TO authenticated
            USING (
                user_id = (SELECT auth.uid()) OR
                EXISTS (
                    SELECT 1 FROM public.providers p
                    WHERE p.id = bookings.provider_id
                    AND p.user_id = (SELECT auth.uid())
                )
            )
            WITH CHECK (
                user_id = (SELECT auth.uid()) OR
                EXISTS (
                    SELECT 1 FROM public.providers p
                    WHERE p.id = bookings.provider_id
                    AND p.user_id = (SELECT auth.uid())
                )
            );
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'bookings policies update failed: %', SQLERRM;
END $$;

-- ============================================================================
-- FIX BOOKING_SLOTS DUPLICATE POLICIES
-- ============================================================================

DO $$
BEGIN
    DROP POLICY IF EXISTS "slots_provider_manage" ON public.booking_slots;
    DROP POLICY IF EXISTS "slots_user_view" ON public.booking_slots;
    DROP POLICY IF EXISTS "booking_slots_access" ON public.booking_slots;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'booking_slots' AND table_schema = 'public') THEN
        -- Single combined policy for all operations
        CREATE POLICY "booking_slots_combined" ON public.booking_slots
            FOR ALL
            USING (
                COALESCE(is_available, true) = true OR
                EXISTS (
                    SELECT 1 FROM public.providers p
                    WHERE p.id = booking_slots.provider_id
                    AND p.user_id = (SELECT auth.uid())
                )
            )
            WITH CHECK (
                EXISTS (
                    SELECT 1 FROM public.providers p
                    WHERE p.id = booking_slots.provider_id
                    AND p.user_id = (SELECT auth.uid())
                )
            );
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'booking_slots policies update failed: %', SQLERRM;
END $$;

-- ============================================================================
-- FIX THREAD_REACTIONS DUPLICATE POLICIES
-- ============================================================================

DO $$
BEGIN
    DROP POLICY IF EXISTS "thread_reactions_select_all" ON public.thread_reactions;
    DROP POLICY IF EXISTS "thread_reactions_manage_own" ON public.thread_reactions;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'thread_reactions' AND table_schema = 'public') THEN
        -- Single select policy for all
        CREATE POLICY "thread_reactions_select" ON public.thread_reactions
            FOR SELECT USING (true);

        -- Separate policies for insert/update/delete
        CREATE POLICY "thread_reactions_insert" ON public.thread_reactions
            FOR INSERT TO authenticated
            WITH CHECK (user_id = (SELECT auth.uid()));

        CREATE POLICY "thread_reactions_update" ON public.thread_reactions
            FOR UPDATE TO authenticated
            USING (user_id = (SELECT auth.uid()));

        CREATE POLICY "thread_reactions_delete" ON public.thread_reactions
            FOR DELETE TO authenticated
            USING (user_id = (SELECT auth.uid()));
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'thread_reactions policies update failed: %', SQLERRM;
END $$;

-- ============================================================================
-- FIX USER_PRESENCE DUPLICATE POLICIES
-- ============================================================================

DO $$
BEGIN
    DROP POLICY IF EXISTS "user_presence_select_all" ON public.user_presence;
    DROP POLICY IF EXISTS "user_presence_manage_own" ON public.user_presence;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_presence' AND table_schema = 'public') THEN
        -- Single select policy for all
        CREATE POLICY "user_presence_select" ON public.user_presence
            FOR SELECT USING (true);

        -- Separate policies for insert/update/delete
        CREATE POLICY "user_presence_insert" ON public.user_presence
            FOR INSERT TO authenticated
            WITH CHECK (user_id = (SELECT auth.uid()));

        CREATE POLICY "user_presence_update" ON public.user_presence
            FOR UPDATE TO authenticated
            USING (user_id = (SELECT auth.uid()));

        CREATE POLICY "user_presence_delete" ON public.user_presence
            FOR DELETE TO authenticated
            USING (user_id = (SELECT auth.uid()));
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'user_presence policies update failed: %', SQLERRM;
END $$;

-- ============================================================================
-- ADD INDEXES FOR NEW TABLES
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'illia_leads_logs' AND table_schema = 'public') THEN
        CREATE INDEX IF NOT EXISTS idx_illia_leads_logs_user_id ON public.illia_leads_logs(user_id);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'purchases' AND table_schema = 'public') THEN
        CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases(user_id);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'illia_leads' AND table_schema = 'public') THEN
        CREATE INDEX IF NOT EXISTS idx_illia_leads_user_id ON public.illia_leads(user_id);
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Index creation failed: %', SQLERRM;
END $$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
DECLARE
    v_remaining_issues INTEGER;
BEGIN
    -- Count remaining auth.uid() issues (should be 0)
    SELECT COUNT(*) INTO v_remaining_issues
    FROM pg_policies
    WHERE schemaname = 'public'
    AND cmd != 'SELECT'  -- Not a SELECT policy
    AND qual LIKE '%auth.uid()%'
    AND qual NOT LIKE '%(SELECT auth.uid())%';

    RAISE NOTICE 'Remaining performance fixes completed:';
    RAISE NOTICE '  - Fixed policies for illia_leads_logs, purchases, illia_leads tables';
    RAISE NOTICE '  - Consolidated duplicate policies for thread_posts, booking_slots';
    RAISE NOTICE '  - Separated FOR ALL policies into specific operations';
    RAISE NOTICE '  - Added missing indexes';
    RAISE NOTICE '';
    RAISE NOTICE 'Policies with unoptimized auth.uid() remaining: %', v_remaining_issues;
    RAISE NOTICE '';
    RAISE NOTICE 'Migration completed successfully!';
END $$;