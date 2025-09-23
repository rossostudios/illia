# Migration Guide - Community & Direct Messaging Features

## Overview
This guide will help you apply the necessary database migrations to enable the Community and Direct Messaging features in your Illia.club application.

## Prerequisites
- Supabase CLI installed (`npm install -g supabase`)
- Access to your Supabase project dashboard
- Your Supabase project reference ID

## Migration Files
The following migrations need to be applied in order:
1. `005_realtime_community_safe.sql` - Community features (threads, posts, reactions)
2. `007_enhanced_direct_messaging.sql` - Direct messaging system

## Application Methods

### Method 1: Using the Helper Script (Recommended)
```bash
# 1. First, link your Supabase project (if not already linked)
npx supabase link --project-ref your-project-ref

# 2. Run the migration helper script
node scripts/apply-migrations.js
```

### Method 2: Using Supabase CLI
```bash
# 1. Link your project
npx supabase link --project-ref your-project-ref

# 2. Apply each migration
npx supabase db push --file supabase/migrations/005_realtime_community_safe.sql
npx supabase db push --file supabase/migrations/007_enhanced_direct_messaging.sql
```

### Method 3: Using Supabase Dashboard (SQL Editor)
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Copy and paste the contents of `005_realtime_community_safe.sql`
6. Click **Run**
7. Repeat for `007_enhanced_direct_messaging.sql`

## Verifying Migration Success

After applying the migrations, verify everything is working:

1. **Check Tables Created:**
   - Go to Table Editor in Supabase Dashboard
   - You should see these new tables:
     - `community_threads`
     - `thread_posts`
     - `thread_reactions`
     - `conversations`
     - `conversation_participants`
     - `direct_messages`
     - `typing_indicators`

2. **Test in Application:**
   - Refresh your application
   - Console errors should be resolved
   - Community page should load without errors
   - Messages page should be accessible

## Troubleshooting

### Error: "relation does not exist"
This means the migrations haven't been applied yet. Follow the application methods above.

### Error: "permission denied"
Ensure you're using the correct Supabase project credentials and have admin access.

### Error: "Docker daemon not running"
If using local development, ensure Docker Desktop is running.

### Console Warnings
The application includes graceful error handling. If you see warnings like:
- "Community tables not yet created"
- "Direct messaging functions not yet created"

These will disappear once migrations are applied.

## Features Enabled

Once migrations are successful, you'll have:

### Community Features
- Real-time thread creation and updates
- Thread posts with reactions
- User presence tracking
- Typing indicators
- View counts and post counts

### Direct Messaging
- Private conversations between users
- Real-time message delivery
- Read receipts
- Typing indicators
- Unread message counts
- Message history

## Next Steps
1. Test creating a community thread
2. Try sending a direct message to another user
3. Verify real-time updates are working
4. Check that unread counts update properly

## Support
If you encounter issues:
1. Check the Supabase logs in your dashboard
2. Verify all migration files are present
3. Ensure your Supabase project is properly configured
4. Check that Row Level Security (RLS) is enabled on the tables