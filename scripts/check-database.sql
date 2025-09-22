-- Check existing tables and their columns in Supabase
-- Run this in Supabase SQL Editor to see what currently exists

-- 1. List all tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Show columns for service_providers table (if it exists)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'service_providers'
ORDER BY ordinal_position;

-- 3. Show columns for providers table (alternative name)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'providers'
ORDER BY ordinal_position;

-- 4. Show all custom types
SELECT typname, typtype
FROM pg_type
WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  AND typtype IN ('e', 'c')
ORDER BY typname;