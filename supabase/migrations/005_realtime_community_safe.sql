-- Enable Realtime for Community Features (SAFE VERSION)
-- This version can be run multiple times safely
-- Version: 1.0.1

-- First ensure the users table exists (it extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    phone TEXT,
    city TEXT,
    preferred_language TEXT DEFAULT 'en',
    tier TEXT DEFAULT 'free',
    services TEXT[],
    budget_min INTEGER,
    budget_max INTEGER,
    preferences JSONB DEFAULT '{}',
    subscription_id TEXT,
    subscription_status TEXT,
    subscription_expires_at TIMESTAMPTZ,
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure community tables exist
CREATE TABLE IF NOT EXISTS public.community_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    category TEXT NOT NULL,
    city_tag TEXT,
    tags TEXT[],
    views_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    last_post_at TIMESTAMPTZ,
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.thread_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID REFERENCES public.community_threads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    parent_post_id UUID REFERENCES public.thread_posts(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    is_solution BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    edited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable realtime for community tables (safe)
DO $$
BEGIN
    -- Check if tables are already in the publication
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
        AND tablename = 'community_threads'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.community_threads;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
        AND tablename = 'thread_posts'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.thread_posts;
    END IF;
END $$;

-- Add additional tables for real-time features
CREATE TABLE IF NOT EXISTS public.user_presence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    channel TEXT NOT NULL,
    status TEXT DEFAULT 'online',
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, channel)
);

CREATE TABLE IF NOT EXISTS public.thread_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID REFERENCES public.community_threads(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.thread_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    reaction TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id, reaction)
);

CREATE TABLE IF NOT EXISTS public.thread_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID REFERENCES public.community_threads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    notify_replies BOOLEAN DEFAULT true,
    notify_mentions BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(thread_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.user_mentions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.thread_posts(id) ON DELETE CASCADE,
    mentioned_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    mentioning_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.direct_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    edited_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.typing_indicators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    channel TEXT NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '10 seconds'
);

-- Create indexes (safe)
CREATE INDEX IF NOT EXISTS idx_presence_user ON public.user_presence(user_id);
CREATE INDEX IF NOT EXISTS idx_presence_channel ON public.user_presence(channel);
CREATE INDEX IF NOT EXISTS idx_reactions_post ON public.thread_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.thread_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_mentions_user ON public.user_mentions(mentioned_user_id) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_dm_conversation ON public.direct_messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_dm_unread ON public.direct_messages(receiver_id) WHERE is_read = false;
-- Note: Removed WHERE clause for typing_channel index as NOW() is not immutable
CREATE INDEX IF NOT EXISTS idx_typing_channel ON public.typing_indicators(channel);
CREATE INDEX IF NOT EXISTS idx_typing_expires ON public.typing_indicators(expires_at);

-- Create or replace functions
CREATE OR REPLACE FUNCTION broadcast_thread_changes()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    PERFORM realtime.broadcast_changes(
        'community:threads',
        TG_OP,
        TG_OP,
        TG_TABLE_NAME,
        TG_TABLE_SCHEMA,
        NEW,
        OLD
    );

    IF TG_TABLE_NAME = 'thread_posts' THEN
        PERFORM realtime.broadcast_changes(
            'thread:' || COALESCE(NEW.thread_id, OLD.thread_id)::text,
            TG_OP,
            TG_OP,
            TG_TABLE_NAME,
            TG_TABLE_SCHEMA,
            NEW,
            OLD
        );
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION update_thread_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.community_threads
        SET
            posts_count = posts_count + 1,
            last_post_at = NEW.created_at,
            updated_at = NOW()
        WHERE id = NEW.thread_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.community_threads
        SET
            posts_count = GREATEST(0, posts_count - 1),
            updated_at = NOW()
        WHERE id = OLD.thread_id;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION increment_thread_views(thread_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.community_threads
    SET views_count = views_count + 1
    WHERE id = thread_id;
END;
$$;

-- Create triggers (safe)
DROP TRIGGER IF EXISTS broadcast_thread_changes_trigger ON public.community_threads;
CREATE TRIGGER broadcast_thread_changes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.community_threads
    FOR EACH ROW EXECUTE FUNCTION broadcast_thread_changes();

DROP TRIGGER IF EXISTS broadcast_post_changes_trigger ON public.thread_posts;
CREATE TRIGGER broadcast_post_changes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.thread_posts
    FOR EACH ROW EXECUTE FUNCTION broadcast_thread_changes();

DROP TRIGGER IF EXISTS update_thread_stats_trigger ON public.thread_posts;
CREATE TRIGGER update_thread_stats_trigger
    AFTER INSERT OR DELETE ON public.thread_posts
    FOR EACH ROW EXECUTE FUNCTION update_thread_stats();

-- Enable RLS
ALTER TABLE public.community_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typing_indicators ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (safe - drop existing first)
DO $$
BEGIN
    -- Community threads policies
    DROP POLICY IF EXISTS "threads_viewable_by_all" ON public.community_threads;
    CREATE POLICY "threads_viewable_by_all"
        ON public.community_threads FOR SELECT TO authenticated
        USING (true);

    DROP POLICY IF EXISTS "threads_creatable_by_users" ON public.community_threads;
    CREATE POLICY "threads_creatable_by_users"
        ON public.community_threads FOR INSERT TO authenticated
        WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "threads_editable_by_owner" ON public.community_threads;
    CREATE POLICY "threads_editable_by_owner"
        ON public.community_threads FOR UPDATE TO authenticated
        USING (auth.uid() = user_id);

    -- Thread posts policies
    DROP POLICY IF EXISTS "posts_viewable_by_all" ON public.thread_posts;
    CREATE POLICY "posts_viewable_by_all"
        ON public.thread_posts FOR SELECT TO authenticated
        USING (true);

    DROP POLICY IF EXISTS "posts_creatable_by_users" ON public.thread_posts;
    CREATE POLICY "posts_creatable_by_users"
        ON public.thread_posts FOR INSERT TO authenticated
        WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "posts_editable_by_owner" ON public.thread_posts;
    CREATE POLICY "posts_editable_by_owner"
        ON public.thread_posts FOR UPDATE TO authenticated
        USING (auth.uid() = user_id);

    -- Reactions policies
    DROP POLICY IF EXISTS "reactions_viewable_by_all" ON public.thread_reactions;
    CREATE POLICY "reactions_viewable_by_all"
        ON public.thread_reactions FOR SELECT TO authenticated
        USING (true);

    DROP POLICY IF EXISTS "reactions_manageable_by_owner" ON public.thread_reactions;
    CREATE POLICY "reactions_manageable_by_owner"
        ON public.thread_reactions FOR ALL TO authenticated
        USING (auth.uid() = user_id);

    -- Direct messages policies
    DROP POLICY IF EXISTS "dm_viewable_by_participants" ON public.direct_messages;
    CREATE POLICY "dm_viewable_by_participants"
        ON public.direct_messages FOR SELECT TO authenticated
        USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

    DROP POLICY IF EXISTS "dm_sendable_by_users" ON public.direct_messages;
    CREATE POLICY "dm_sendable_by_users"
        ON public.direct_messages FOR INSERT TO authenticated
        WITH CHECK (auth.uid() = sender_id);

    -- Presence policies
    DROP POLICY IF EXISTS "presence_viewable_by_all" ON public.user_presence;
    CREATE POLICY "presence_viewable_by_all"
        ON public.user_presence FOR SELECT TO authenticated
        USING (true);

    DROP POLICY IF EXISTS "presence_manageable_by_owner" ON public.user_presence;
    CREATE POLICY "presence_manageable_by_owner"
        ON public.user_presence FOR ALL TO authenticated
        USING (auth.uid() = user_id);
END $$;

-- Grant permissions
GRANT ALL ON public.community_threads TO authenticated;
GRANT ALL ON public.thread_posts TO authenticated;
GRANT ALL ON public.thread_reactions TO authenticated;
GRANT ALL ON public.thread_subscriptions TO authenticated;
GRANT ALL ON public.user_mentions TO authenticated;
GRANT ALL ON public.direct_messages TO authenticated;
GRANT ALL ON public.user_presence TO authenticated;
GRANT ALL ON public.typing_indicators TO authenticated;
GRANT EXECUTE ON FUNCTION increment_thread_views TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Real-time community features setup completed successfully!';
END $$;