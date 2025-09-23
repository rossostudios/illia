# Real-time Community Troubleshooting Guide

## Migration Issues

### Error: "relation already exists"
This happens when running the migration multiple times. Use the safe version:
```sql
-- Use the safe migration instead:
005_realtime_community_safe.sql
```

### Error: "relation public.users does not exist"
The users table needs to be created first:
1. Run `004_fix_realtime_policies.sql` first (optional)
2. Then run `005_realtime_community_safe.sql`

### Error: "realtime.messages does not exist"
This is normal for newer Supabase projects. The realtime.messages table is deprecated. The migration handles this gracefully with the DO block.

## Running Migrations

### Recommended Order:
```bash
# 1. First run the policy fix (optional)
psql -f supabase/migrations/004_fix_realtime_policies.sql

# 2. Run the safe community setup
psql -f supabase/migrations/005_realtime_community_safe.sql

# 3. Add seed data (optional)
psql -f supabase/migrations/006_community_seed_data.sql
```

### Via Supabase Dashboard:
1. Go to SQL Editor
2. Paste the contents of `005_realtime_community_safe.sql`
3. Click "Run"
4. Check for the success message

### Via Supabase CLI:
```bash
supabase db push --db-url "postgresql://postgres:[password]@[host]/postgres"
```

## Verifying Installation

### Check Tables Exist:
```sql
-- Run this query to verify all tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
    'users',
    'community_threads',
    'thread_posts',
    'thread_reactions',
    'user_presence',
    'direct_messages'
);
```

### Check Realtime is Enabled:
```sql
-- Check which tables have realtime enabled
SELECT tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';
```

### Check RLS Policies:
```sql
-- Check RLS policies exist
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('community_threads', 'thread_posts');
```

## Common Issues

### 1. Real-time Updates Not Working
**Symptoms:** New threads/posts don't appear automatically

**Solutions:**
- Check WebSocket connection in browser console
- Verify user is authenticated
- Check RLS policies allow SELECT
- Ensure tables are in supabase_realtime publication

### 2. Cannot Create Threads/Posts
**Symptoms:** Error when trying to create content

**Solutions:**
- Verify user is authenticated
- Check RLS policies allow INSERT
- Ensure user exists in public.users table
- Check browser console for specific errors

### 3. Typing Indicators Not Showing
**Symptoms:** "User is typing..." doesn't appear

**Solutions:**
- Check WebSocket is connected
- Verify broadcast channel subscription
- Check network tab for broadcast messages
- Ensure multiple users are testing

### 4. User Presence Not Working
**Symptoms:** Online users count stays at 0

**Solutions:**
- Check presence channel subscription
- Verify auth token is being sent
- Check for CORS issues
- Ensure setAuth() is called before subscribing

## Testing Checklist

### Basic Functionality:
- [ ] Can create new threads
- [ ] Can reply to threads
- [ ] Can edit own posts
- [ ] Can delete own posts
- [ ] Can add reactions

### Real-time Features:
- [ ] New threads appear instantly
- [ ] Replies show up without refresh
- [ ] Online user count updates
- [ ] Typing indicators work
- [ ] Reactions update live

### Security:
- [ ] Cannot edit others' posts
- [ ] Cannot delete others' content
- [ ] Must be logged in to post
- [ ] RLS policies enforced

## Debug Queries

### Check User Authentication:
```sql
-- Run in SQL Editor to see current user
SELECT auth.uid(), auth.email();
```

### Check Thread Count:
```sql
SELECT COUNT(*) as thread_count
FROM public.community_threads;
```

### Check Recent Activity:
```sql
SELECT
    t.title,
    t.created_at,
    u.name as author
FROM public.community_threads t
LEFT JOIN public.users u ON t.user_id = u.id
ORDER BY t.created_at DESC
LIMIT 10;
```

### Monitor Real-time Subscriptions:
Check browser console for:
```javascript
// Should see these messages
"Subscribed to community threads"
"Subscribed to thread posts"
"Connected"
```

## Reset and Cleanup

If you need to start fresh:

### Drop All Community Tables:
```sql
-- WARNING: This deletes all data!
DROP TABLE IF EXISTS public.typing_indicators CASCADE;
DROP TABLE IF EXISTS public.direct_messages CASCADE;
DROP TABLE IF EXISTS public.user_mentions CASCADE;
DROP TABLE IF EXISTS public.thread_subscriptions CASCADE;
DROP TABLE IF EXISTS public.thread_reactions CASCADE;
DROP TABLE IF EXISTS public.thread_posts CASCADE;
DROP TABLE IF EXISTS public.community_threads CASCADE;
DROP TABLE IF EXISTS public.user_presence CASCADE;

-- Then run the safe migration again
```

### Clear Specific Data:
```sql
-- Clear posts and threads but keep structure
TRUNCATE public.thread_posts CASCADE;
TRUNCATE public.community_threads CASCADE;
```

## Getting Help

1. Check browser console for errors
2. Review network tab for failed requests
3. Check Supabase logs in dashboard
4. Verify environment variables are set
5. Test with a simple query first

## Next Steps

Once everything is working:
1. Test with multiple users
2. Monitor performance
3. Add more features
4. Implement moderation
5. Set up notifications