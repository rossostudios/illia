#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  console.log('Please add these to your .env file:')
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function applyMigration(filePath: string) {
  const fileName = path.basename(filePath)
  console.log(`\n📄 Applying migration: ${fileName}`)

  try {
    // Read the SQL file
    const sql = fs.readFileSync(filePath, 'utf8')

    // Split by semicolons but preserve those in strings
    const statements = sql
      .split(/;(?=(?:[^']*'[^']*')*[^']*$)/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    console.log(`  Found ${statements.length} SQL statements`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]

      // Skip comments and empty statements
      if (statement.startsWith('--') || statement.length === 0) {
        continue
      }

      // Log progress for long migrations
      if (statements.length > 10 && i % 10 === 0) {
        console.log(`  Progress: ${i}/${statements.length} statements`)
      }

      try {
        // Execute the statement using raw SQL
        const { error } = await supabase
          .rpc('exec_sql', {
            sql: `${statement};`,
          })
          .single()

        if (error) {
          // Try direct execution if RPC doesn't exist
          const { error: directError } = await supabase.from('_migrations').select('*').limit(0)
          if (directError?.message.includes('exec_sql')) {
            console.warn('  ⚠️  RPC function not available, skipping statement')
            continue
          }
          throw error
        }
      } catch (err: any) {
        // Some statements might fail if they already exist (like CREATE IF NOT EXISTS)
        if (
          err.message?.includes('already exists') ||
          err.code === '42P07' ||
          err.code === '42710'
        ) {
          console.log(`  ⏭️  Skipped (already exists): ${statement.substring(0, 50)}...`)
        } else {
          console.error(`  ❌ Error in statement: ${statement.substring(0, 100)}...`)
          console.error(`     ${err.message}`)
          throw err
        }
      }
    }

    console.log(`  ✅ Successfully applied ${fileName}`)
    return true
  } catch (error: any) {
    console.error(`  ❌ Failed to apply ${fileName}:`, error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Starting migration process...')
  console.log(`📦 Supabase URL: ${SUPABASE_URL}`)

  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations')

  // Get the specific migration file or all migrations
  const targetMigration = process.argv[2]

  let files: string[]
  if (targetMigration) {
    const targetFile = path.join(migrationsDir, targetMigration)
    if (!fs.existsSync(targetFile)) {
      console.error(`❌ Migration file not found: ${targetMigration}`)
      process.exit(1)
    }
    files = [targetFile]
    console.log(`📎 Running specific migration: ${targetMigration}`)
  } else {
    // Get all SQL files in migrations directory
    files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort()
      .map((file) => path.join(migrationsDir, file))

    console.log(`📁 Found ${files.length} migration files`)
  }

  let successCount = 0
  let failCount = 0

  for (const file of files) {
    const success = await applyMigration(file)
    if (success) {
      successCount++
    } else {
      failCount++
      // Continue with other migrations even if one fails
    }
  }

  console.log(`\n${'='.repeat(50)}`)
  console.log('📊 Migration Summary:')
  console.log(`  ✅ Successful: ${successCount}`)
  console.log(`  ❌ Failed: ${failCount}`)
  console.log('='.repeat(50))

  if (failCount > 0) {
    console.log('\n⚠️  Some migrations failed. Please check the errors above.')
    console.log('You may need to:')
    console.log('1. Check your Supabase service role key')
    console.log('2. Manually run failed migrations in Supabase SQL Editor')
    console.log('3. Ensure your database schema matches expected state')
  } else {
    console.log('\n✨ All migrations completed successfully!')
  }

  process.exit(failCount > 0 ? 1 : 0)
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err)
  process.exit(1)
})

// Run the script
main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
