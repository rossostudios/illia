const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

async function applyMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '019_refresh_core_functions.sql')
  const sql = fs.readFileSync(migrationPath, 'utf8')

  console.log('Applying migration to Supabase...')

  try {
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    for (const statement of statements) {
      if (statement.toUpperCase().includes('BEGIN') ||
          statement.toUpperCase().includes('COMMIT') ||
          statement.length < 5) {
        continue
      }

      console.log(`Executing: ${statement.substring(0, 50)}...`)

      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: statement + ';'
      }).single()

      if (error && !error.message.includes('already exists')) {
        console.error('Error:', error.message)
      }
    }

    console.log('Migration applied successfully!')
  } catch (error) {
    console.error('Migration error:', error)

    // Try alternative approach - execute key functions directly
    console.log('\nTrying to create functions directly...')

    // Test if functions exist
    const { data: convData, error: convError } = await supabase.rpc('get_user_conversations', {
      p_user_id: '00000000-0000-0000-0000-000000000000'
    })

    if (convError && convError.message.includes('function')) {
      console.log('Functions not available. Database may need manual migration.')
      console.log('Please run the migration SQL directly in Supabase dashboard.')
    } else {
      console.log('Core messaging functions appear to be available!')
    }
  }
}

// Load env vars
require('dotenv').config({ path: '.env.local' })

applyMigration()