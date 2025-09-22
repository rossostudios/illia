# Vercel Deployment Guide for Illia.club

## Pre-Deployment Checklist ✅

### 1. Environment Variables Required
You need to add these in Vercel Dashboard → Settings → Environment Variables:

#### Required Variables:
```bash
# Supabase (copy from .env.local)
NEXT_PUBLIC_SUPABASE_URL=https://edbxyingyflwmxutiuxm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI (for AI matching)
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4-turbo

# App URL (update after deployment)
NEXT_PUBLIC_APP_URL=https://illia.club
```

#### Optional Variables (for payments - add later):
```bash
# Polar.sh Integration
POLAR_ACCESS_TOKEN=your-polar-token
POLAR_API_KEY=your-polar-api-key
NEXT_PUBLIC_POLAR_ORGANIZATION_ID=illia-club
POLAR_SUCCESS_URL=https://illia.club/dashboard/membership?success=true
POLAR_WEBHOOK_SECRET=your-webhook-secret
```

## Deployment Steps 🚀

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. Add environment variables (from checklist above)
5. Click "Deploy"

### 3. Custom Domain Setup

After deployment:
1. Go to Vercel Dashboard → Project Settings → Domains
2. Add your custom domain: `illia.club`
3. Follow DNS configuration instructions:
   - Add CNAME record: `@ → cname.vercel-dns.com`
   - Or A records if using apex domain
4. Wait for SSL certificate (automatic)

### 4. Post-Deployment Configuration

#### Update Environment Variables:
```bash
NEXT_PUBLIC_APP_URL=https://illia.club
POLAR_SUCCESS_URL=https://illia.club/dashboard/membership?success=true
```

#### Configure Supabase:
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Update Site URL: `https://illia.club`
3. Add to Redirect URLs:
   - `https://illia.club/auth/callback`
   - `https://illia.club/dashboard`
   - `https://illia.club/*`

## Database Status 📊

Your database is ready with:
- ✅ Providers table with sample data
- ✅ Leads table for user signups
- ✅ Matches table for AI results
- ✅ Reviews table for ratings

## Features Status 🎯

### Working:
- ✅ Multi-language support (EN, ES, PT)
- ✅ Provider directory with real data
- ✅ Provider onboarding form
- ✅ Explore/search functionality
- ✅ Authentication with Supabase
- ✅ Dashboard UI

### Pending:
- ⏳ AI matching with GPT-4 (API key needed)
- ⏳ Payment integration (Polar.sh setup)
- ⏳ Community forum
- ⏳ WhatsApp introductions
- ⏳ Email notifications

## Monitoring & Analytics 📈

### Vercel Analytics (Free):
- Automatically enabled
- View at: vercel.com/dashboard → Analytics

### Error Monitoring:
Consider adding (optional):
- Sentry for error tracking
- PostHog for product analytics
- Mixpanel for user behavior

## Security Checklist 🔒

- ✅ Environment variables not exposed in code
- ✅ Supabase RLS policies enabled
- ✅ API routes protected
- ✅ HTTPS enforced by Vercel
- ⚠️ Review OpenAI API key usage limits

## Quick Commands 🛠️

```bash
# Local development
npm run dev

# Build test
npm run build

# Type check
npm run type-check

# Lint
npm run lint

# Format code
npx biome check --fix ./app
```

## Support & Next Steps 📞

1. **Test production site** at your domain
2. **Monitor build logs** in Vercel dashboard
3. **Check Supabase logs** for API issues
4. **Set up Polar.sh** for payments when ready

## Environment Variable Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key |
| `OPENAI_API_KEY` | ✅ | OpenAI API key for matching |
| `NEXT_PUBLIC_APP_URL` | ✅ | Your production URL |
| `POLAR_*` | ❌ | Payment integration (later) |

---

Ready to deploy! 🎉 Your app will be live at `https://illia.club` after following these steps.