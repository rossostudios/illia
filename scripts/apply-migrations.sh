#!/bin/bash

# Illia.club Database Migration Script
# This script applies database migrations to your Supabase project using psql

echo "🚀 Illia.club Database Setup"
echo "============================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found"
    echo "Please ensure you have .env.local with your Supabase credentials"
    exit 1
fi

# Load environment variables
export $(cat .env.local | grep -v '^#' | xargs)

# Extract project ID from Supabase URL
PROJECT_ID=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed 's|https://||' | sed 's|.supabase.co||')

echo "📊 Project ID: $PROJECT_ID"
echo ""

# Database connection string
DB_URL="postgresql://postgres.${PROJECT_ID}:${SUPABASE_SERVICE_ROLE_KEY}@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

echo "📝 Applying database migrations..."
echo ""

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  psql is not installed. Installing via brew..."
    brew install postgresql
fi

# Apply the schema migration
echo "1️⃣  Creating database schema..."
psql "$DB_URL" < supabase/migrations/001_complete_schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Schema created successfully!"
else
    echo "❌ Error creating schema. Please check the error messages above."
    exit 1
fi

echo ""
echo "2️⃣  Seeding initial data..."
psql "$DB_URL" < supabase/seed.sql

if [ $? -eq 0 ]; then
    echo "✅ Seed data inserted successfully!"
else
    echo "⚠️  Warning: Seed data may have encountered issues. Check if data already exists."
fi

echo ""
echo "3️⃣  Verifying installation..."
psql "$DB_URL" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"

echo ""
echo "✅ Database setup complete! Your Illia.club database is ready."
echo ""
echo "📊 View your data at:"
echo "   https://app.supabase.com/project/$PROJECT_ID/editor"