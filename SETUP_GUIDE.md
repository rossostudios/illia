# September 2025 System Setup Guide

## 🚀 Quick Setup

Follow these steps to set up your improved codebase:

### 1. Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Payment Integration (Optional)
NEXT_PUBLIC_POLAR_CHECKOUT_LINK=your-polar-link
POLAR_WEBHOOK_SECRET=your-polar-secret

# Feature Flags (Optional)
NEXT_PUBLIC_ENABLE_LOGGING=true
```

### 2. Install Dependencies

```bash
npm install

# Install additional packages for validation
npm install --save-dev tsx chalk
```

### 3. Apply Database Migrations

Apply all database migrations to set up the complete schema:

```bash
# Apply all migrations
npm run db:migrate

# Or apply a specific migration
npm run db:migrate:specific 021_complete_schema_alignment.sql
```

### 4. Generate TypeScript Types

Generate TypeScript types from your database schema:

```bash
npm run db:types
```

### 5. Validate System

Run the comprehensive system validation:

```bash
npm run validate
```

## 📊 What's Been Improved

### Database Enhancements
- ✅ Complete bookings table with proper relationships
- ✅ Added missing columns (avatar_url, badges, notification_settings)
- ✅ Performance indexes on all critical queries
- ✅ Row Level Security policies for all tables
- ✅ Optimized functions for match scoring and availability

### Backend Improvements
- ✅ Fixed provider search API field mappings
- ✅ Implemented complete bookings CRUD operations
- ✅ Added proper error handling with categorized errors
- ✅ Comprehensive logging system with analytics integration
- ✅ Improved real-time subscription patterns

### Frontend-Backend Integration
- ✅ Aligned database schema with frontend expectations
- ✅ Fixed type mismatches between backend and frontend
- ✅ Optimized hooks with proper cleanup
- ✅ Added connection pooling and retry logic

### Performance Optimizations
- ✅ Database indexes on frequently queried fields
- ✅ Efficient real-time subscriptions with reconnection
- ✅ Batch processing for logs and analytics
- ✅ Optimized query patterns with proper pagination

### Security & Monitoring
- ✅ Row Level Security on all sensitive tables
- ✅ Comprehensive error tracking
- ✅ User action logging
- ✅ Performance monitoring
- ✅ Security event tracking

## 🧪 Testing Your Setup

### 1. Test Database Connection

```bash
# Check if migrations applied successfully
npm run validate
```

### 2. Test API Endpoints

```bash
# Test provider search
curl http://localhost:3000/api/providers/search?city=Dubai

# Test bookings (requires auth)
curl http://localhost:3000/api/bookings
```

### 3. Test Real-time Updates

Open your application and:
1. Create a match or booking
2. Open another browser tab
3. Verify real-time updates appear

## 🔧 Common Issues & Solutions

### Issue: Database migrations fail

**Solution:**
1. Check your Supabase service role key
2. Manually run the migration in Supabase SQL Editor
3. Check for existing objects with `CREATE IF NOT EXISTS`

### Issue: TypeScript type generation fails

**Solution:**
```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
npx supabase login

# Generate types manually
npx supabase gen types typescript --project-id your-project-id > utils/database.types.ts
```

### Issue: Real-time not working

**Solution:**
1. Check Supabase dashboard > Database > Replication
2. Ensure tables are added to publication:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

### Issue: API endpoints return 401

**Solution:**
1. Check authentication in your frontend
2. Ensure cookies are being set properly
3. Verify CORS settings in Supabase

## 📚 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev:turbo        # Start with Turbo mode

# Database Management
npm run db:migrate       # Apply all migrations
npm run db:types         # Generate TypeScript types

# Code Quality
npm run lint             # Run linter
npm run format           # Format code
npm run check            # Run all checks

# System Validation
npm run validate         # Run comprehensive system validation

# Production
npm run build            # Build for production
npm run start            # Start production server
```

## 🎯 Next Steps

1. **Configure Supabase MCP Server:**
   ```bash
   export SUPABASE_ACCESS_TOKEN="your-token"
   npx @supabase/mcp-server-supabase --project-ref=your-project-ref
   ```

2. **Enable Monitoring:**
   - Set up Supabase Edge Functions for background jobs
   - Configure alerts for critical errors
   - Set up analytics dashboards

3. **Performance Tuning:**
   - Review slow query logs in Supabase
   - Optimize image loading with CDN
   - Implement caching strategies

4. **Security Hardening:**
   - Review and tighten RLS policies
   - Set up rate limiting
   - Enable 2FA for admin accounts

## 📞 Support

If you encounter any issues:

1. Run the validation script: `npm run validate`
2. Check the logs in your Supabase dashboard
3. Review error messages in the browser console
4. Check the `analytics_events` table for logged errors

## ✅ Validation Checklist

- [ ] All environment variables set
- [ ] Database migrations applied successfully
- [ ] TypeScript types generated
- [ ] System validation passes
- [ ] API endpoints responding
- [ ] Real-time updates working
- [ ] Authentication functional
- [ ] Bookings system operational
- [ ] Error logging active
- [ ] Performance monitoring enabled

Your system is now optimized for September 2025 standards with improved workflow, proper backend-frontend integration, and comprehensive monitoring!