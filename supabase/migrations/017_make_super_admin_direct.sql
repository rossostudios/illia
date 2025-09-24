-- ============================================================================
-- MAKE USER SUPER ADMIN - DIRECT VERSION
-- Version: 1.0.0
-- Date: 2025-09-23
-- Description: Directly creates super admin for user 3ac9dce2-cb7c-4abc-9d56-ef87618021e4
-- ============================================================================

-- First, ensure the user exists in the users table with proper fields
INSERT INTO public.users (id, email, is_provider, approval_status)
VALUES (
    '3ac9dce2-cb7c-4abc-9d56-ef87618021e4',
    (SELECT email FROM auth.users WHERE id = '3ac9dce2-cb7c-4abc-9d56-ef87618021e4'),
    true,
    'approved'
)
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

-- Verify the admin was created
SELECT
    au.id as admin_id,
    au.user_id,
    au.role,
    au.is_active,
    u.email,
    u.name
FROM public.admin_users au
JOIN auth.users u ON au.user_id = u.id
WHERE au.user_id = '3ac9dce2-cb7c-4abc-9d56-ef87618021e4';