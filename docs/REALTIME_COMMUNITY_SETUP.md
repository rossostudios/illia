# Real-time Community Setup Guide

## Overview
The real-time community system provides a fully functional forum with live updates using Supabase Realtime's latest features including Broadcast, Presence, and database change subscriptions.

## Database Setup

### 1. Apply Migrations
Apply the migrations in order:

```bash
# Connect to your Supabase project
supabase db push

# Or apply manually in SQL editor:
# 1. Run 005_realtime_community.sql
# 2. Run 006_community_seed_data.sql (optional, for testing)
```

### 2. Verify Tables
After migration, verify these tables exist:
- `public.users` - User profiles
- `public.community_threads` - Forum threads
- `public.thread_posts` - Thread replies
- `public.thread_reactions` - Post reactions
- `public.user_presence` - Online status tracking
- `public.thread_subscriptions` - Thread notifications
- `public.direct_messages` - DM functionality

## Features Implemented

### Real-time Updates
- **Live Thread List**: New threads appear instantly for all users
- **Post Updates**: Replies appear in real-time without refresh
- **View Counts**: Automatic view count tracking
- **Reactions**: Live emoji reactions with counts

### User Presence
- **Online Users**: See who's currently active
- **Typing Indicators**: Know when someone is composing
- **Thread Presence**: See who's viewing the same thread

### Security
- **Row Level Security**: All tables have RLS policies
- **Authenticated Access**: Only logged-in users can interact
- **Owner Permissions**: Users can only edit/delete their own content

## Usage

### Access the Community
Navigate to `/dashboard/community` to access the real-time forum.

### Create Content
1. **New Thread**: Click "New Thread" button (requires authentication)
2. **Reply**: Type in the reply box at the bottom of any thread
3. **React**: Click emoji buttons under posts
4. **Edit/Delete**: Use icons on your own posts

### Real-time Features
- Green dot and count show online users
- "User is typing..." appears when others compose
- New threads/posts appear with smooth animations
- Reactions update instantly

## API Hooks

### useRealtimeThreads
```typescript
const { threads, loading, createThread } = useRealtimeThreads({
  category: 'general',
  city: 'medellin'
})
```

### useRealtimePosts
```typescript
const { posts, createPost, toggleReaction } = useRealtimePosts({
  threadId: 'thread-uuid'
})
```

### usePresence
```typescript
const { onlineUsers, updateStatus } = usePresence({
  channel: 'thread:uuid'
})
```

### useTypingIndicator
```typescript
const { typingUsers, handleInputChange } = useTypingIndicator({
  channel: 'thread:uuid'
})
```

## Next Steps

### 1. Enhanced Features
- **Rich Text Editor**: Add markdown/WYSIWYG editor
- **File Uploads**: Support images and attachments
- **Search**: Full-text search across threads
- **Notifications**: Push notifications for mentions

### 2. Moderation
- **Report System**: Flag inappropriate content
- **Admin Tools**: Pin, lock, delete threads
- **Auto-moderation**: Spam/toxicity detection
- **User Banning**: Temporary/permanent bans

### 3. Gamification
- **Reputation System**: Points for helpful posts
- **Badges**: Achievements for participation
- **Leaderboards**: Top contributors
- **Trust Levels**: Unlock features with activity

### 4. Performance
- **Pagination**: Virtual scrolling for long lists
- **Caching**: React Query for data management
- **Optimistic UI**: Instant feedback
- **Lazy Loading**: Load content as needed

### 5. Direct Messaging
The DM table structure is ready. To implement:
1. Create DM UI component
2. Add useDirecMessages hook
3. Set up DM notifications
4. Add online status indicators

## Troubleshooting

### Migration Errors
If you get "relation does not exist" errors:
1. Ensure auth.users exists (Supabase Auth)
2. Run migrations in order
3. Check RLS is enabled on tables

### Real-time Not Working
1. Check Supabase Realtime is enabled in dashboard
2. Verify RLS policies allow SELECT
3. Ensure user is authenticated
4. Check browser console for WebSocket errors

### Performance Issues
1. Add database indexes (already included)
2. Limit subscription channels
3. Implement pagination
4. Use connection pooling

## Environment Variables
Ensure these are set:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Testing
1. Create multiple user accounts
2. Open multiple browser windows
3. Test real-time updates across sessions
4. Verify typing indicators work
5. Test reactions and presence

## Support
For issues or questions:
- Check Supabase Realtime docs
- Review RLS policies
- Inspect browser console
- Check network tab for WebSocket