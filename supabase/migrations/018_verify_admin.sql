-- ============================================================================
-- VERIFY ADMIN USER
-- Version: 1.0.0
-- Date: 2025-09-23
-- Description: Check if admin user exists and is properly configured
-- ============================================================================

-- Check if the user exists in auth.users
SELECT
    id,
    email,
    created_at,
    'AUTH USER' as source
FROM auth.users
WHERE id = '3ac9dce2-cb7c-4abc-9d56-ef87618021e4';

-- Check if the user exists in public.users
SELECT
    id,
    email,
    is_provider,
    approval_status,
    is_deleted,
    'PUBLIC USER' as source
FROM public.users
WHERE id = '3ac9dce2-cb7c-4abc-9d56-ef87618021e4';

-- Check if admin user exists
SELECT
    au.id as admin_id,
    au.user_id,
    au.role,
    au.is_active,
    au.created_at,
    'ADMIN USER' as source
FROM public.admin_users au
WHERE au.user_id = '3ac9dce2-cb7c-4abc-9d56-ef87618021e4';

-- Show all admin users
SELECT
    au.*,
    u.email
FROM public.admin_users au
LEFT JOIN auth.users u ON au.user_id = u.id;

-- If no admin exists, create it now
DO $$
BEGIN
    -- Ensure user exists in public.users
    INSERT INTO public.users (id, email, is_provider, approval_status, is_deleted)
    SELECT
        '3ac9dce2-cb7c-4abc-9d56-ef87618021e4',
        email,
        true,
        'approved',
        false
    FROM auth.users
    WHERE id = '3ac9dce2-cb7c-4abc-9d56-ef87618021e4'
    ON CONFLICT (id) DO UPDATE
    SET
        is_provider = true,
        approval_status = 'approved',
        is_deleted = false;

    -- Create or update admin user
    INSERT INTO public.admin_users (user_id, role, is_active)
    VALUES ('3ac9dce2-cb7c-4abc-9d56-ef87618021e4', 'super_admin', true)
    ON CONFLICT (user_id) DO UPDATE
    SET
        role = 'super_admin',
        is_active = true,
        updated_at = NOW();

    RAISE NOTICE 'Admin user created/updated successfully';
END $$;

-- Final verification
SELECT
    au.id as admin_id,
    au.user_id,
    au.role,
    au.is_active,
    u.email,
    pu.is_provider,
    pu.approval_status
FROM public.admin_users au
JOIN auth.users u ON au.user_id = u.id
LEFT JOIN public.users pu ON pu.id = u.id
WHERE au.user_id = '3ac9dce2-cb7c-4abc-9d56-ef87618021e4';