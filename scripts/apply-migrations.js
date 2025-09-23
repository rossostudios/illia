#!/usr/bin/env node

/**
 * Helper script to apply migrations to your Supabase project
 *
 * Usage:
 * 1. Make sure you have connected to your Supabase project:
 *    npx supabase link --project-ref your-project-ref
 *
 * 2. Run this script:
 *    node scripts/apply-migrations.js
 *
 * This will apply the community and messaging migrations in the correct order.
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const migrations = ['005_realtime_community_safe.sql', '007_enhanced_direct_messaging.sql']

console.log('🚀 Applying Supabase migrations for Community and Direct Messaging features...\n')

// Check if migrations exist
migrations.forEach((migration) => {
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', migration)
  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migration}`)
    process.exit(1)
  }
})

// Apply migrations
migrations.forEach((migration, index) => {
  console.log(`\n📝 Applying migration ${index + 1}/${migrations.length}: ${migration}`)

  try {
    const migrationPath = path.join('supabase', 'migrations', migration)

    // Use supabase db push with the specific file
    execSync(`npx supabase db push --file ${migrationPath}`, {
      stdio: 'inherit',
    })

    console.log(`✅ Successfully applied: ${migration}`)
  } catch (error) {
    console.error(`❌ Failed to apply migration: ${migration}`)
    console.error(`Error: ${error.message}`)
    console.log('\nTroubleshooting tips:')
    console.log('1. Make sure you are connected to your Supabase project:')
    console.log('   npx supabase link --project-ref your-project-ref\n')
    console.log('2. Check your Supabase project credentials')
    console.log('3. Ensure Docker is running if using local development')
    process.exit(1)
  }
})

console.log('\n✨ All migrations applied successfully!')
console.log('\nYour app now has:')
console.log('✅ Real-time community features with threads and posts')
console.log('✅ Direct messaging system with conversations')
console.log('✅ Typing indicators and presence tracking')
console.log('✅ Read receipts and delivery status')
console.log('\nNext steps:')
console.log('1. Refresh your app to see the new features')
console.log('2. The errors in the console should now be resolved')
console.log('3. Test the community and messaging features')
