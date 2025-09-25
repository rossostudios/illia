-- Ensure latest function definitions for messaging, bookings, and admin workflows
-- This migration refreshes RPCs so the frontend and API are aligned with the
-- schema defined in the repo migrations (007, 011, 016, etc.)

BEGIN;

-- Drop legacy variants of log_admin_action that use obsolete parameter order
DROP FUNCTION IF EXISTS public.log_admin_action(text, uuid, text);
DROP FUNCTION IF EXISTS public.log_admin_action(text, uuid, text, jsonb);

-- Booking availability checker
CREATE OR REPLACE FUNCTION public.check_booking_availability(
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
    -- Verify there is an available slot covering the requested window
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
    )
    INTO v_available;

    -- Reject if there is an overlapping confirmed/pending booking
    IF v_available THEN
        SELECT NOT EXISTS (
            SELECT 1
            FROM public.bookings
            WHERE provider_id = p_provider_id
              AND booking_date = p_date
              AND status IN ('confirmed', 'pending')
              AND (
                    (start_time <= p_start_time AND end_time > p_start_time)
                 OR (start_time < p_end_time AND end_time >= p_end_time)
                 OR (start_time >= p_start_time AND end_time <= p_end_time)
              )
        )
        INTO v_available;
    END IF;

    RETURN v_available;
END;
$$;

-- Mark messages read and sync read receipts
CREATE OR REPLACE FUNCTION public.mark_messages_read(
    p_conversation_id UUID,
    p_user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert read receipts for any unread messages
    INSERT INTO public.message_read_receipts (message_id, user_id, read_at)
    SELECT dm.id, p_user_id, NOW()
    FROM public.direct_messages dm
    WHERE dm.conversation_id = p_conversation_id
      AND dm.receiver_id = p_user_id
      AND dm.is_read = false
    ON CONFLICT DO NOTHING;

    -- Mark messages as read for the recipient
    UPDATE public.direct_messages
    SET is_read = true
    WHERE conversation_id = p_conversation_id
      AND receiver_id = p_user_id
      AND is_read = false;

    -- Reset unread count for the participant
    UPDATE public.conversation_participants
    SET unread_count = 0,
        last_read_at = NOW()
    WHERE conversation_id = p_conversation_id
      AND user_id = p_user_id;
END;
$$;

-- Conversation helper ensures a DM thread exists between two users
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(
    user1_id UUID,
    user2_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    conversation_id UUID;
BEGIN
    -- Prevent conversations with blocked users
    IF EXISTS (
        SELECT 1
        FROM public.blocked_users
        WHERE (user_id = user1_id AND blocked_user_id = user2_id)
           OR (user_id = user2_id AND blocked_user_id = user1_id)
    ) THEN
        RAISE EXCEPTION 'Cannot create conversation with blocked user';
    END IF;

    -- Locate existing two-person conversation
    SELECT cp1.conversation_id
    INTO conversation_id
    FROM public.conversation_participants cp1
    JOIN public.conversation_participants cp2
      ON cp1.conversation_id = cp2.conversation_id
    WHERE cp1.user_id = user1_id
      AND cp2.user_id = user2_id
      AND (
          SELECT COUNT(*)
          FROM public.conversation_participants cp3
          WHERE cp3.conversation_id = cp1.conversation_id
      ) = 2
    LIMIT 1;

    -- Create conversation if none found
    IF conversation_id IS NULL THEN
        INSERT INTO public.conversations (created_at)
        VALUES (NOW())
        RETURNING id INTO conversation_id;

        INSERT INTO public.conversation_participants (conversation_id, user_id)
        VALUES (conversation_id, user1_id), (conversation_id, user2_id);
    END IF;

    RETURN conversation_id;
END;
$$;

-- Send a direct message and update conversation metadata
CREATE OR REPLACE FUNCTION public.send_message(
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
    v_conversation_id := public.get_or_create_conversation(p_sender_id, p_receiver_id);

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

    UPDATE public.conversations
    SET last_message_at = NOW(),
        last_message_preview = LEFT(p_message, 100),
        updated_at = NOW()
    WHERE id = v_conversation_id;

    UPDATE public.conversation_participants
    SET unread_count = unread_count + 1
    WHERE conversation_id = v_conversation_id
      AND user_id = p_receiver_id;

    -- Broadcast the change for realtime subscribers
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

-- Return the conversation list for a user with counterpart metadata
CREATE OR REPLACE FUNCTION public.get_user_conversations(
    p_user_id UUID
)
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
        c.id,
        c.last_message_at,
        c.last_message_preview,
        cp.unread_count,
        ou.id,
        ou.name,
        ou.email,
        ou.tier,
        EXISTS (
            SELECT 1
            FROM public.service_providers sp
            WHERE sp.email = ou.email
        ) AS is_provider
    FROM public.conversations c
    JOIN public.conversation_participants cp
      ON c.id = cp.conversation_id
    JOIN public.conversation_participants cp2
      ON cp2.conversation_id = c.id
    JOIN public.users ou
      ON cp2.user_id = ou.id
    WHERE cp.user_id = p_user_id
      AND cp2.user_id <> p_user_id
      AND NOT cp.is_archived
    ORDER BY c.last_message_at DESC NULLS LAST;
END;
$$;

-- Admin audit logger aligned with frontend RPC signature
CREATE OR REPLACE FUNCTION public.log_admin_action(
    action_type TEXT,
    resource TEXT,
    resource_uuid UUID DEFAULT NULL,
    action_details JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    admin_uuid UUID;
    log_id UUID;
BEGIN
    SELECT id
    INTO admin_uuid
    FROM public.admin_users
    WHERE user_id = auth.uid()
      AND is_active = true;

    IF admin_uuid IS NULL THEN
        RAISE EXCEPTION 'User is not an admin';
    END IF;

    INSERT INTO public.admin_audit_logs (
        admin_id,
        action,
        resource_type,
        resource_id,
        details
    )
    VALUES (
        admin_uuid,
        action_type,
        resource,
        resource_uuid,
        action_details
    )
    RETURNING id INTO log_id;

    RETURN log_id;
END;
$$;

-- Approve provider helper used by admin dashboard
CREATE OR REPLACE FUNCTION public.approve_provider(
    provider_uuid UUID,
    admin_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    admin_uuid UUID;
BEGIN
    SELECT id
    INTO admin_uuid
    FROM public.admin_users
    WHERE user_id = auth.uid()
      AND is_active = true;

    IF admin_uuid IS NULL THEN
        RAISE EXCEPTION 'User is not an admin';
    END IF;

    UPDATE public.users
    SET approval_status = 'approved',
        approval_date = NOW(),
        approved_by = admin_uuid
    WHERE id = provider_uuid
      AND is_provider = true;

    PERFORM public.log_admin_action(
        'approve_provider',
        'user',
        provider_uuid,
        jsonb_build_object('notes', admin_notes)
    );

    RETURN true;
END;
$$;

-- Reject provider helper used by admin dashboard
CREATE OR REPLACE FUNCTION public.reject_provider(
    provider_uuid UUID,
    reason TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    admin_uuid UUID;
BEGIN
    SELECT id
    INTO admin_uuid
    FROM public.admin_users
    WHERE user_id = auth.uid()
      AND is_active = true;

    IF admin_uuid IS NULL THEN
        RAISE EXCEPTION 'User is not an admin';
    END IF;

    UPDATE public.users
    SET approval_status = 'rejected',
        rejection_reason = reason,
        approved_by = admin_uuid,
        approval_date = NOW()
    WHERE id = provider_uuid
      AND is_provider = true;

    PERFORM public.log_admin_action(
        'reject_provider',
        'user',
        provider_uuid,
        jsonb_build_object('reason', reason)
    );

    RETURN true;
END;
$$;

-- Ensure privileges (re-grant in case REPLACE reset them)
GRANT EXECUTE ON FUNCTION public.check_booking_availability(UUID, DATE, TIME, TIME) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_messages_read(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_or_create_conversation(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.send_message(UUID, UUID, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_conversations(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_admin_action(TEXT, TEXT, UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.approve_provider(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_provider(UUID, TEXT) TO authenticated;

COMMIT;
