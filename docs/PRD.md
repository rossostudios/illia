# Illia Product Requirements Document (PRD)

## Executive Summary

**Product Name:** Illia  
**Version:** 1.0  
**Date:** September 2025  
**Product Owner:** Christopher  

### Vision Statement
Illia is a trusted marketplace connecting digital nomads and expats with vetted local service providers in Medellín and Florianópolis, enabling seamless home setup and ongoing support through AI-powered matching and community-driven trust.

### Mission
To eliminate the stress and uncertainty of finding reliable help in a new city by providing instant, verified connections to trusted cleaners, cooks, and essential service providers.

---

## Problem Statement

### Primary Problem
Digital nomads and expats moving to Medellín or Florianópolis face significant challenges:
- **Language barriers** preventing effective communication with service providers
- **Trust issues** with no way to verify provider reliability
- **Time waste** searching through unvetted listings and social media groups
- **Quality uncertainty** with no standardized vetting process
- **Payment friction** dealing with cash-only providers or unfamiliar payment methods

### Market Validation
- 7M+ digital nomads globally (2024)
- Medellín: #1 destination for US expats in LatAm
- Florianópolis: Fastest-growing tech hub in Brazil
- 73% of expats struggle finding trusted services in first 3 months
- Average expat spends $300-500/month on home services

---

## User Personas

### 1. Explorer Emma (Free Tier)
**Demographics:** 28, Remote marketer, First-time in LatAm  
**Needs:** Basic orientation, occasional cleaner  
**Pain Points:** Budget-conscious, testing the waters  
**Goals:** Find affordable, safe options without commitment  
**Usage:** 2-3 match requests/month  

### 2. Settler Sam (Settler Tier - $9/mo)
**Demographics:** 35, Software developer, 6 months in Medellín  
**Needs:** Regular cleaner, occasional cook, maintenance help  
**Pain Points:** Wants consistency, hates negotiating prices  
**Goals:** Build reliable service team for long-term stay  
**Usage:** 10-15 match requests/month  

### 3. Local Lisa (Local Tier - $19/mo)
**Demographics:** 42, Entrepreneur, 2+ years resident  
**Needs:** Full home team, business connections, VIP treatment  
**Pain Points:** Values time over money, needs premium service  
**Goals:** Seamless home operations, focus on business  
**Usage:** Unlimited matches, concierge requests  

---

## Core Features

### 1. AI-Powered Matching System
**Description:** Intelligent quiz that understands user needs and matches with ideal providers  
**User Story:** As a nomad, I want to answer simple questions and get matched with providers who fit my specific needs  
**Acceptance Criteria:**
- 5-minute onboarding quiz
- Personality and lifestyle matching
- Location-based recommendations
- Budget alignment
- Language preference matching

### 2. Verified Provider Network
**Description:** Curated database of background-checked, review-verified service providers  
**User Story:** As a user, I want confidence that providers are trustworthy and reliable  
**Acceptance Criteria:**
- Background check badges
- Verified reviews from real users
- Response time guarantees
- Price transparency
- WhatsApp integration for direct contact

### 3. Smart Search & Filters
**Description:** Advanced search with neighborhood, service type, price, and availability filters  
**User Story:** As a user, I want to quickly find providers who match my specific criteria  
**Acceptance Criteria:**
- Real-time availability
- Price range filters
- Service radius mapping
- Language capabilities
- Specialty services (pet-friendly, eco-friendly, etc.)

### 4. Trust & Safety System
**Description:** Multi-layer verification and review system ensuring provider quality  
**User Story:** As a user, I want assurance that providers are who they claim to be  
**Acceptance Criteria:**
- ID verification
- Address verification
- Reference checks
- Insurance verification (where applicable)
- Dispute resolution system

### 5. Community Hub
**Description:** Forums and groups for expats to share experiences and recommendations  
**User Story:** As a nomad, I want to connect with others who've used these services  
**Acceptance Criteria:**
- City-specific forums
- Provider reviews and ratings
- Tips and guides
- Event announcements
- Emergency help network

### 6. Usage Tracking & Credits
**Description:** Transparent usage monitoring with tier-based limits  
**User Story:** As a user, I want to see my remaining match credits and usage  
**Acceptance Criteria:**
- Real-time credit display
- Usage history
- Upgrade prompts when near limits
- Monthly reset notifications

---

## User Journey Map

### New User Flow
1. **Discovery** → Google/Social Media/Word of mouth
2. **Landing Page** → Value proposition, social proof
3. **Sign Up** → Email/Google authentication
4. **Onboarding Quiz** → Preferences, location, needs assessment
5. **First Match** → AI recommends top 3 providers
6. **Contact Provider** → WhatsApp connection
7. **Service Delivery** → Provider completes service
8. **Review & Rate** → Build trust for community
9. **Upgrade Prompt** → Show value of premium tiers

### Returning User Flow
1. **Login** → Dashboard with usage stats
2. **Browse/Search** → Find new providers or rebook favorites
3. **Quick Match** → One-click rebooking
4. **Community Engagement** → Forum participation, reviews
5. **Referral** → Invite other expats for rewards

---

## Success Metrics & KPIs

### Business Metrics
- **MRR Growth:** Target 20% MoM
- **Conversion Rate:** Free → Paid: 15%
- **Churn Rate:** < 5% monthly
- **CAC:** < $50
- **LTV:CAC Ratio:** > 3:1

### Product Metrics
- **Activation Rate:** 60% complete first match within 7 days
- **Engagement:** 3+ matches/month for paid users
- **NPS Score:** > 50
- **Provider Response Time:** < 24 hours
- **Match Success Rate:** > 80% satisfaction

### Growth Metrics
- **Viral Coefficient:** > 1.2
- **Organic Traffic:** 40% of acquisition
- **Referral Rate:** 30% of users refer at least one friend
- **Market Penetration:** 10% of expats in target cities within Year 1

---

## Technical Architecture

### Tech Stack
- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Backend:** Supabase (PostgreSQL, Auth, Realtime)
- **AI/ML:** OpenAI GPT-4 for matching algorithm
- **Payments:** Polar.sh (subscriptions, metering)
- **Analytics:** PostHog / Mixpanel
- **Monitoring:** Sentry, Vercel Analytics
- **Communication:** WhatsApp Business API, SendGrid

### Infrastructure
- **Hosting:** Vercel (Edge Functions)
- **Database:** Supabase (PostgreSQL)
- **CDN:** Vercel Edge Network
- **Storage:** Supabase Storage for provider docs/images

### Security & Compliance
- **Data Protection:** LGPD (Brazil) and Colombian data laws compliant
- **Payment Security:** PCI DSS compliant via Polar
- **Authentication:** Supabase Auth with 2FA
- **Encryption:** TLS 1.3, AES-256 for sensitive data

---

## Competitive Analysis

### Direct Competitors
1. **Facebook Groups**
   - Pros: Free, large user base
   - Cons: No vetting, spam, time-consuming
   - Our Advantage: Verified providers, instant matching

2. **WhatsApp Groups**
   - Pros: Direct communication
   - Cons: Overwhelming messages, no organization
   - Our Advantage: Structured, searchable, quality-controlled

3. **TaskRabbit/Handy** (if they expand to LatAm)
   - Pros: Established brand, process
   - Cons: Not localized, expensive
   - Our Advantage: Local expertise, cultural fit, pricing

### Indirect Competitors
- Airbnb Experiences (for services)
- Local classifieds (OLX, Mercado Libre)
- Agency services (expensive, impersonal)

---

## Go-to-Market Strategy

### Phase 1: Medellín Launch (Months 1-3)
- Partner with 3 co-working spaces
- Seed 50 verified providers
- Target 100 beta users
- Collect feedback, iterate

### Phase 2: Growth (Months 4-6)
- Launch referral program
- Content marketing (expat guides)
- Influencer partnerships (expat YouTubers)
- Target 1,000 users, 150 providers

### Phase 3: Expansion (Months 7-12)
- Launch Florianópolis
- Add Buenos Aires, Mexico City
- B2B partnerships (relocation companies)
- Target 10,000 users, 1,000 providers

---

## Monetization Strategy

### Subscription Tiers
1. **Explorer (Free):** 3 matches/month, basic features
2. **Settler ($9/mo):** 20 matches/month, priority support
3. **Local ($19/mo):** Unlimited matches, concierge service

### Additional Revenue Streams
- **Provider Fees:** $29/month for premium listing (Year 2)
- **Booking Fees:** 5% transaction fee (Year 2)
- **B2B Services:** Company relocation packages
- **Affiliate:** Insurance, banking, real estate partnerships

---

## Roadmap

### Q4 2024 (MVP)
- ✅ Core matching algorithm
- ✅ Provider database
- ✅ User authentication
- ✅ Basic search/filter
- ✅ Payment integration (Polar)

### Q1 2025
- [ ] WhatsApp Business API
- [ ] Provider onboarding portal
- [ ] Advanced matching quiz
- [ ] Community forums
- [ ] Mobile app (React Native)

### Q2 2025
- [ ] AI-powered chat support
- [ ] Video provider profiles
- [ ] Booking calendar system
- [ ] Escrow payments
- [ ] Business accounts

### Q3 2025
- [ ] API for partners
- [ ] White-label solution
- [ ] Additional cities (Buenos Aires, CDMX)
- [ ] Provider training program
- [ ] Insurance partnerships

---

## Risk Assessment

### High Risk
- **Provider quality control:** Mitigation - Strict vetting, continuous monitoring
- **Market education:** Mitigation - Content marketing, free tier
- **Competition from incumbents:** Mitigation - Deep local focus, community

### Medium Risk
- **Regulatory changes:** Mitigation - Legal counsel, compliance buffer
- **Currency fluctuation:** Mitigation - USD pricing, local adjustments
- **Provider supply:** Mitigation - Attractive provider incentives

### Low Risk
- **Technical scalability:** Mitigation - Cloud infrastructure, proven stack
- **Payment processing:** Mitigation - Multiple payment providers

---

## Success Criteria

### Year 1 Goals
- 10,000 registered users
- 1,500 paying subscribers
- 1,000 verified providers
- $15K MRR
- 2 cities operational
- NPS > 50

### Long-term Vision (3 Years)
- 100,000 users across LatAm
- 15,000 paying subscribers
- 10,000 providers
- $300K MRR
- 10 cities
- Market leader in expat services

---

## Conclusion

Illia addresses a critical pain point for the rapidly growing digital nomad and expat community in Latin America. By focusing on trust, quality, and community, we're building more than a marketplace – we're creating a support system that makes transitioning to a new life seamless and stress-free.

Our differentiation lies in:
1. **Deep local expertise** rather than generic global solutions
2. **Community-driven trust** instead of anonymous transactions
3. **AI-powered personalization** for perfect matches
4. **Nomad-first design** understanding unique expat needs

With the right execution, Illia will become the essential platform for every nomad and expat in Latin America, starting with Medellín and Florianópolis.
