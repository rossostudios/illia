-- Seed data for Community Features
-- This creates sample threads and posts for testing

-- Insert sample threads (only if users exist)
DO $$
DECLARE
    user1_id UUID;
    user2_id UUID;
    user3_id UUID;
    thread1_id UUID;
    thread2_id UUID;
    thread3_id UUID;
BEGIN
    -- Get or create test users
    SELECT id INTO user1_id FROM public.users LIMIT 1;

    IF user1_id IS NULL THEN
        -- Create a test user if none exist
        INSERT INTO public.users (id, email, name, city, tier)
        VALUES (
            (SELECT id FROM auth.users LIMIT 1),
            'test@example.com',
            'Test User',
            'medellin',
            'free'
        )
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
        RETURNING id INTO user1_id;
    END IF;

    -- Only proceed if we have at least one user
    IF user1_id IS NOT NULL THEN
        -- Create sample threads
        INSERT INTO public.community_threads (id, user_id, title, body, category, city_tag, tags, views_count, posts_count, is_pinned)
        VALUES
        (
            gen_random_uuid(),
            user1_id,
            'Best neighborhoods for digital nomads in Medellín?',
            'I''m moving to Medellín next month and looking for recommendations on the best neighborhoods for digital nomads. I need good WiFi, cafes, and preferably a community of other remote workers. Budget is around $800-1200/month for accommodation.',
            'housing',
            'medellin',
            ARRAY['housing', 'digital-nomad', 'neighborhoods'],
            125,
            8,
            true
        ),
        (
            gen_random_uuid(),
            user1_id,
            'Reliable house cleaning services in El Poblado',
            'Can anyone recommend a trustworthy cleaning service in El Poblado? I need someone for weekly cleaning of a 2-bedroom apartment. English speaking would be a plus but not required.',
            'services',
            'medellin',
            ARRAY['cleaning', 'el-poblado', 'services'],
            89,
            5,
            false
        ),
        (
            gen_random_uuid(),
            user1_id,
            'Visa run to Panama - tips and experiences?',
            'My tourist visa expires soon and I''m planning a visa run to Panama. Has anyone done this recently? Any tips on the process, how long to stay, and what to expect at the border?',
            'visa',
            'medellin',
            ARRAY['visa', 'panama', 'immigration'],
            234,
            12,
            false
        )
        ON CONFLICT DO NOTHING
        RETURNING id INTO thread1_id;

        -- Create sample posts for the first thread if it was created
        IF thread1_id IS NOT NULL THEN
            INSERT INTO public.thread_posts (thread_id, user_id, body)
            VALUES
            (
                thread1_id,
                user1_id,
                'I highly recommend Laureles! It''s less touristy than Poblado but has everything you need. Lots of cafes, good restaurants, and the Segundo Parque area is great for meeting other expats.'
            ),
            (
                thread1_id,
                user1_id,
                'El Poblado is the most popular but can be pricey. If you want something more authentic, check out Envigado. It''s just south of Poblado, safer, quieter, and you get more for your money.'
            ),
            (
                thread1_id,
                user1_id,
                'For coworking, Selina in Poblado is great. They have a good community and regular events. Also check out Tinkko and Espacio.'
            )
            ON CONFLICT DO NOTHING;

            -- Update thread stats
            UPDATE public.community_threads
            SET
                posts_count = (SELECT COUNT(*) FROM public.thread_posts WHERE thread_id = thread1_id),
                last_post_at = NOW()
            WHERE id = thread1_id;
        END IF;
    END IF;
END $$;

-- Add some sample reactions (if posts exist)
INSERT INTO public.thread_reactions (post_id, user_id, reaction)
SELECT
    p.id,
    u.id,
    CASE (RANDOM() * 4)::INT
        WHEN 0 THEN '👍'
        WHEN 1 THEN '❤️'
        WHEN 2 THEN '🎉'
        WHEN 3 THEN '🤔'
        ELSE '👏'
    END
FROM public.thread_posts p
CROSS JOIN public.users u
WHERE RANDOM() < 0.3  -- 30% chance of reaction
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_threads_category_city ON public.community_threads(category, city_tag);
CREATE INDEX IF NOT EXISTS idx_threads_created ON public.community_threads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_threads_last_post ON public.community_threads(last_post_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_posts_created ON public.thread_posts(created_at);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;