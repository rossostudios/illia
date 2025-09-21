// Test script to check actual database schema
// Run with: node test-schema.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const serviceSupabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkSchema() {
  console.log('🔍 Checking Database Schema...\n')

  // Fetch a sample row to see the actual structure
  const { data: leadSample, error: leadError } = await serviceSupabase
    .from('illia_leads')
    .select('*')
    .limit(1)

  console.log('📊 illia_leads table columns:')
  if (leadSample && leadSample.length > 0) {
    console.log('Existing columns:', Object.keys(leadSample[0]))
  } else if (!leadError) {
    console.log('Table exists but is empty')
    // Try to get columns from error message by inserting invalid data
    const { error: testError } = await serviceSupabase
      .from('illia_leads')
      .insert({ test: 'test' })

    if (testError) {
      console.log('Error details:', testError.message)
    }
  } else {
    console.log('Error:', leadError.message)
  }

  // Check other tables
  const tables = ['illia_leads_logs', 'purchases']

  for (const table of tables) {
    console.log(`\n📊 ${table} table columns:`)
    const { data, error } = await serviceSupabase
      .from(table)
      .select('*')
      .limit(1)

    if (data && data.length > 0) {
      console.log('Existing columns:', Object.keys(data[0]))
    } else if (!error) {
      console.log('Table exists but is empty')
    } else {
      console.log('Error:', error.message)
    }
  }
}

checkSchema()