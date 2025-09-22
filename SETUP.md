# Illia.club Setup Guide

## 🚀 Quick Start

This guide will help you set up the Illia.club database and start developing the platform.

## 📊 Database Setup

### Step 1: Apply Database Schema

1. Go to your Supabase Dashboard:
   ```
   https://app.supabase.com/project/edbxyingyflwmxutiuxm/sql/new
   ```

2. Copy the entire contents of `supabase/migrations/001_complete_schema.sql`

3. Paste it into the SQL editor and click "Run"

4. You should see success messages for all table creations

### Step 2: Seed Initial Data

1. In the same SQL editor, clear the previous content

2. Copy the entire contents of `supabase/seed.sql`

3. Paste and click "Run" to insert 20 sample providers

4. Verify the data was inserted:
   ```sql
   SELECT COUNT(*) FROM service_providers;
   -- Should return 20
   ```

### Step 3: Configure Storage Buckets

1. Go to Storage in Supabase Dashboard:
   ```
   https://app.supabase.com/project/edbxyingyflwmxutiuxm/storage/buckets
   ```

2. Create two buckets:
   - `provider-photos` (Public)
   - `avatars` (Public)

3. Set policies to allow public read access

## 🔑 Environment Variables

Ensure your `.env.local` file has all required variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4-turbo

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🏃 Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## 📱 Key Features & URLs

### Public Pages
- **Homepage**: `/` or `/en`, `/es`, `/pt`
- **Provider Onboarding**: `/en/providers/onboard`
- **Login**: `/en/login`

### Dashboard (Requires Authentication)
- **Explore**: `/en/dashboard/explore` - Interactive quiz for matching
- **Directory**: `/en/dashboard/directory` - Browse all providers
- **Community**: `/en/dashboard/community` - Forum discussions
- **Matches**: `/en/dashboard/matches` - Your matched providers
- **Profile**: `/en/dashboard/profile` - User settings

## ✅ Database Tables Created

- `users` - Extended user profiles
- `service_providers` - Provider profiles with services, languages, rates
- `leads` - Quiz submissions from potential users
- `matches` - AI-generated matches between users and providers
- `reviews` - Provider reviews and ratings
- `intro_requests` - Introduction requests (premium feature)
- `community_threads` - Forum threads
- `thread_posts` - Forum posts/replies
- `user_activity` - Activity tracking
- `provider_availability` - Provider schedule

## 🔄 Next Steps

### Immediate Tasks
1. ✅ Database schema created
2. ✅ Provider onboarding form built
3. ✅ API endpoints created
4. ⏳ Connect Explore page to real data
5. ⏳ Remove mock data from application
6. ⏳ Build community forum
7. ⏳ Implement provider profiles
8. ⏳ Add WhatsApp integration

### Testing the Provider Onboarding
1. Navigate to `/en/providers/onboard`
2. Fill out the form with test data
3. Submit and verify it appears in Supabase
4. Check the success page redirect

### Sample API Calls

**Get Providers**:
```bash
curl http://localhost:3000/api/providers?city=medellin&services=cleaning,cooking
```

**Submit Quiz for Matches**:
```bash
curl -X POST http://localhost:3000/api/matches \
  -H "Content-Type: application/json" \
  -d '{
    "city": "medellin",
    "services": ["cleaning", "cooking"],
    "languages": ["en"],
    "budget": "200",
    "name": "Test User",
    "email": "test@example.com"
  }'
```

## 🐛 Troubleshooting

### Database Issues
- If tables don't exist, re-run the migration script
- Check RLS policies are enabled in Supabase Dashboard
- Verify service role key has proper permissions

### API Errors
- Check console logs for detailed error messages
- Verify environment variables are loaded
- Ensure Supabase project is active

### Authentication Issues
- Clear browser cookies
- Check Supabase Auth settings
- Verify redirect URLs are configured

## 📚 Documentation Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [next-intl](https://next-intl-docs.vercel.app/)

## 🤝 Support

For questions or issues:
- Check existing GitHub issues
- Contact: support@illia.club
- Join our Discord community

---

**Version**: 1.0.0
**Last Updated**: September 2025
**Status**: MVP Development