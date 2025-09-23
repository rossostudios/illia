-- Fix Realtime Policies
-- This ensures the realtime schema and messages table exist before applying policies

-- Check if realtime schema exists and create policy safely
DO $$
BEGIN
    -- Check if the realtime schema exists
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'realtime') THEN
        -- Check if the messages table exists in the realtime schema
        IF EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'realtime'
            AND table_name = 'messages'
        ) THEN
            -- Drop and recreate the policy
            DROP POLICY IF EXISTS "authenticated_can_receive_broadcasts" ON realtime.messages;
            CREATE POLICY "authenticated_can_receive_broadcasts"
                ON realtime.messages
                FOR SELECT
                TO authenticated
                USING (true);

            RAISE NOTICE 'Realtime messages policy created successfully';
        ELSE
            RAISE NOTICE 'realtime.messages table does not exist - this is normal for newer Supabase projects';
        END IF;
    ELSE
        RAISE NOTICE 'realtime schema does not exist - this is normal for newer Supabase projects';
    END IF;
END $$;