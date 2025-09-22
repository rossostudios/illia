# Database Setup Guide

## Overview
Your Illia platform is now configured to work with real provider data from Supabase. The application connects to your existing database schema with the `providers` table.

## Migration Scripts Available

### 1. Add Missing Status Column
**File**: `/supabase/migrations/add_status_column.sql`
- Adds the `status` column to track provider verification status
- Creates index for performance
- Run this first if you get "column 'status' does not exist" error

### 2. Seed Sample Providers
**File**: `/supabase/seed-providers.sql`
- Adds 8 sample providers (5 in Medellín, 3 in Florianópolis)
- Includes realistic data with services, languages, rates, and bios
- Safe to run multiple times (uses ON CONFLICT to update existing)

## How to Run the Scripts

1. Open your Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the script content
4. Click "Run" to execute

## Verify Your Setup

After running the scripts, verify everything works:

```sql
-- Check provider count
SELECT city, COUNT(*) as count
FROM providers
WHERE active = true
GROUP BY city;

-- View sample providers
SELECT name, city, services, languages, rate_monthly
FROM providers
WHERE active = true
ORDER BY rating DESC
LIMIT 10;
```

## Testing the Integration

1. **Explore Page** (`/en/dashboard/explore`):
   - Now fetches real providers from database
   - Filters by city, services, languages, and budget
   - Shows actual provider data instead of mocks

2. **Provider API** (`/api/providers`):
   - Query parameters:
     - `city`: 'medellin' or 'florianopolis'
     - `services`: comma-separated list (e.g., 'cleaning,cooking')
     - `languages`: comma-separated list (e.g., 'en,es')
     - `budget_max`: maximum monthly budget

3. **Provider Onboarding** (`/en/providers/onboard`):
   - Form to add new providers
   - Saves directly to database
   - Redirects to success page after submission

## Database Schema

Your `providers` table includes:
- Basic info: name, email, phone, whatsapp
- Location: city, neighborhood
- Services: services[] array, specialties[] array
- Languages: languages[] array
- Rates: rate_monthly, rate_hourly
- Status: active, verified, status, featured
- Metadata: rating, reviews_count, years_experience

## Next Steps

1. Test the Explore page with real data
2. Try the provider onboarding flow
3. Implement the AI matching endpoint (currently returns simple score)
4. Add the community forum features
5. Build out the membership tiers

The application is now connected to real data and ready for testing!