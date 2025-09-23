-- Enhanced Direct Messaging System
-- Version: 2.0.0
-- Adds conversations, read receipts, and better organization

-- Create conversations table to group messages
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_message_at TIMESTAMPTZ,
    last_message_preview TEXT,
    metadata JSONB DEFAULT '{}'
);

-- Create conversation participants
CREATE TABLE IF NOT EXISTS public.conversation_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    last_read_at TIMESTAMPTZ,
    unread_count INTEGER DEFAULT 0,
    is_muted BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    notification_enabled BOOLEAN DEFAULT true,
    UNIQUE(conversation_id, user_id)
);

-- Enhance the existing direct_messages table
ALTER TABLE public.direct_messages
ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS reply_to_id UUID REFERENCES public.direct_messages(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'text', -- text, image, file, system
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS reactions JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS is_delivered BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

-- Create message read receipts table
CREATE TABLE IF NOT EXISTS public.message_read_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES public.direct_messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, user_id)
);

-- Create blocked users table
CREATE TABLE IF NOT EXISTS public.blocked_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    blocked_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    blocked_at TIMESTAMPTZ DEFAULT NOW(),
    reason TEXT,
    UNIQUE(user_id, blocked_user_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON public.conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_participants_user ON public.conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_participants_conversation ON public.conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_participants_unread ON public.conversation_participants(user_id, unread_count) WHERE unread_count > 0;
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.direct_messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_read_receipts_message ON public.message_read_receipts(message_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users ON public.blocked_users(user_id, blocked_user_id);

-- Function to get or create conversation between two users
CREATE OR REPLACE FUNCTION get_or_create_conversation(user1_id UUID, user2_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    conversation_id UUID;
BEGIN
    -- Check if users are blocked
    IF EXISTS (
        SELECT 1 FROM public.blocked_users
        WHERE (user_id = user1_id AND blocked_user_id = user2_id)
        OR (user_id = user2_id AND blocked_user_id = user1_id)
    ) THEN
        RAISE EXCEPTION 'Cannot create conversation with blocked user';
    END IF;

    -- Find existing conversation
    SELECT cp1.conversation_id INTO conversation_id
    FROM public.conversation_participants cp1
    INNER JOIN public.conversation_participants cp2
        ON cp1.conversation_id = cp2.conversation_id
    WHERE cp1.user_id = user1_id
    AND cp2.user_id = user2_id
    AND (
        SELECT COUNT(*) FROM public.conversation_participants cp3
        WHERE cp3.conversation_id = cp1.conversation_id
    ) = 2
    LIMIT 1;

    -- Create new conversation if not found
    IF conversation_id IS NULL THEN
        INSERT INTO public.conversations (created_at)
        VALUES (NOW())
        RETURNING id INTO conversation_id;

        -- Add both participants
        INSERT INTO public.conversation_participants (conversation_id, user_id)
        VALUES
            (conversation_id, user1_id),
            (conversation_id, user2_id);
    END IF;

    RETURN conversation_id;
END;
$$;

-- Function to send a message
CREATE OR REPLACE FUNCTION send_message(
    p_sender_id UUID,
    p_receiver_id UUID,
    p_message TEXT,
    p_message_type TEXT DEFAULT 'text',
    p_attachments JSONB DEFAULT '[]'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_conversation_id UUID;
    v_message_id UUID;
BEGIN
    -- Get or create conversation
    v_conversation_id := get_or_create_conversation(p_sender_id, p_receiver_id);

    -- Insert message
    INSERT INTO public.direct_messages (
        conversation_id,
        sender_id,
        receiver_id,
        message,
        message_type,
        attachments,
        created_at
    )
    VALUES (
        v_conversation_id,
        p_sender_id,
        p_receiver_id,
        p_message,
        p_message_type,
        p_attachments,
        NOW()
    )
    RETURNING id INTO v_message_id;

    -- Update conversation
    UPDATE public.conversations
    SET
        last_message_at = NOW(),
        last_message_preview = LEFT(p_message, 100),
        updated_at = NOW()
    WHERE id = v_conversation_id;

    -- Update unread count for receiver
    UPDATE public.conversation_participants
    SET unread_count = unread_count + 1
    WHERE conversation_id = v_conversation_id
    AND user_id = p_receiver_id;

    -- Broadcast the message
    PERFORM realtime.broadcast_changes(
        'dm:' || LEAST(p_sender_id, p_receiver_id)::text || ':' || GREATEST(p_sender_id, p_receiver_id)::text,
        'INSERT',
        'message_sent',
        'direct_messages',
        'public',
        row_to_json((SELECT m FROM public.direct_messages m WHERE m.id = v_message_id)),
        NULL
    );

    RETURN v_message_id;
END;
$$;

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_read(
    p_conversation_id UUID,
    p_user_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert read receipts for unread messages
    INSERT INTO public.message_read_receipts (message_id, user_id, read_at)
    SELECT dm.id, p_user_id, NOW()
    FROM public.direct_messages dm
    WHERE dm.conversation_id = p_conversation_id
    AND dm.receiver_id = p_user_id
    AND dm.is_read = false
    ON CONFLICT DO NOTHING;

    -- Mark messages as read
    UPDATE public.direct_messages
    SET is_read = true
    WHERE conversation_id = p_conversation_id
    AND receiver_id = p_user_id
    AND is_read = false;

    -- Reset unread count
    UPDATE public.conversation_participants
    SET
        unread_count = 0,
        last_read_at = NOW()
    WHERE conversation_id = p_conversation_id
    AND user_id = p_user_id;
END;
$$;

-- Function to get conversation list for a user
CREATE OR REPLACE FUNCTION get_user_conversations(p_user_id UUID)
RETURNS TABLE (
    conversation_id UUID,
    last_message_at TIMESTAMPTZ,
    last_message_preview TEXT,
    unread_count INTEGER,
    other_user_id UUID,
    other_user_name TEXT,
    other_user_email TEXT,
    other_user_tier TEXT,
    is_provider BOOLEAN
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id as conversation_id,
        c.last_message_at,
        c.last_message_preview,
        cp.unread_count,
        ou.id as other_user_id,
        ou.name as other_user_name,
        ou.email as other_user_email,
        ou.tier as other_user_tier,
        EXISTS(SELECT 1 FROM public.service_providers sp WHERE sp.email = ou.email) as is_provider
    FROM public.conversations c
    INNER JOIN public.conversation_participants cp ON c.id = cp.conversation_id
    INNER JOIN public.conversation_participants cp2 ON c.id = cp2.conversation_id
    INNER JOIN public.users ou ON cp2.user_id = ou.id
    WHERE cp.user_id = p_user_id
    AND cp2.user_id != p_user_id
    AND NOT cp.is_archived
    ORDER BY c.last_message_at DESC NULLS LAST;
END;
$$;

-- Enable realtime for messaging tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_read_receipts;

-- RLS Policies
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_read_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

-- Conversation policies
DROP POLICY IF EXISTS "users_can_view_their_conversations" ON public.conversations;
CREATE POLICY "users_can_view_their_conversations"
    ON public.conversations FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.conversation_participants
            WHERE conversation_id = id
            AND user_id = auth.uid()
        )
    );

-- Participant policies
DROP POLICY IF EXISTS "users_can_view_their_participations" ON public.conversation_participants;
CREATE POLICY "users_can_view_their_participations"
    ON public.conversation_participants FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR conversation_id IN (
        SELECT conversation_id FROM public.conversation_participants
        WHERE user_id = auth.uid()
    ));

-- Message policies (update existing)
DROP POLICY IF EXISTS "dm_viewable_by_participants" ON public.direct_messages;
CREATE POLICY "dm_viewable_by_participants"
    ON public.direct_messages FOR SELECT TO authenticated
    USING (
        sender_id = auth.uid()
        OR receiver_id = auth.uid()
        OR conversation_id IN (
            SELECT conversation_id FROM public.conversation_participants
            WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "dm_sendable_by_users" ON public.direct_messages;
CREATE POLICY "dm_sendable_by_users"
    ON public.direct_messages FOR INSERT TO authenticated
    WITH CHECK (sender_id = auth.uid());

-- Read receipt policies
DROP POLICY IF EXISTS "users_can_view_read_receipts" ON public.message_read_receipts;
CREATE POLICY "users_can_view_read_receipts"
    ON public.message_read_receipts FOR SELECT TO authenticated
    USING (
        user_id = auth.uid() OR
        message_id IN (
            SELECT id FROM public.direct_messages
            WHERE sender_id = auth.uid()
        )
    );

-- Blocked users policies
DROP POLICY IF EXISTS "users_can_manage_blocks" ON public.blocked_users;
CREATE POLICY "users_can_manage_blocks"
    ON public.blocked_users FOR ALL TO authenticated
    USING (user_id = auth.uid());

-- Grant permissions
GRANT ALL ON public.conversations TO authenticated;
GRANT ALL ON public.conversation_participants TO authenticated;
GRANT ALL ON public.message_read_receipts TO authenticated;
GRANT ALL ON public.blocked_users TO authenticated;
GRANT EXECUTE ON FUNCTION get_or_create_conversation TO authenticated;
GRANT EXECUTE ON FUNCTION send_message TO authenticated;
GRANT EXECUTE ON FUNCTION mark_messages_read TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_conversations TO authenticated;

-- Success
DO $$
BEGIN
    RAISE NOTICE 'Enhanced Direct Messaging system setup completed!';
END $$;