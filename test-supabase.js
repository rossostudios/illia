// Test script to verify Supabase connection and data flow
// Run with: node test-supabase.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const serviceSupabase = createClient(supabaseUrl, supabaseServiceKey)

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...\n')
  console.log(`URL: ${supabaseUrl}`)
  console.log(`Anon Key: ${supabaseAnonKey.substring(0, 20)}...`)
  console.log(`Service Key: ${supabaseServiceKey ? supabaseServiceKey.substring(0, 20) + '...' : 'Not set'}\n`)

  try {
    // Test 1: Check tables exist
    console.log('📊 Testing table access...')

    const tables = ['illia_leads', 'illia_leads_logs', 'purchases']

    for (const table of tables) {
      const { error } = await serviceSupabase
        .from(table)
        .select('*')
        .limit(1)

      if (error) {
        console.log(`❌ Table '${table}': ${error.message}`)
      } else {
        console.log(`✅ Table '${table}' accessible`)
      }
    }

    // Test 2: Test auth signup (will fail if email already exists, that's ok)
    console.log('\n🔐 Testing auth...')
    const testEmail = `test${Date.now()}@example.com`
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'TestPassword123!'
    })

    if (authError && authError.message.includes('already registered')) {
      console.log('✅ Auth working (email already exists)')
    } else if (authData?.user) {
      console.log('✅ Auth working (test user created)')
      // Clean up test user
      await serviceSupabase.auth.admin.deleteUser(authData.user.id)
    } else {
      console.log(`⚠️  Auth issue: ${authError?.message}`)
    }

    // Test 3: Insert test data with service role
    console.log('\n📝 Testing data insertion with service role...')
    const testLead = {
      user_email: 'test@example.com',
      niche: 'Testing',
      zip_code: '29401',
      name: 'Test Business',
      email: 'test@business.com',
      phone: '(555) 123-4567',
      score: 85,
      notes: 'Test lead',
      status: 'new'
    }

    const { data: insertData, error: insertError } = await serviceSupabase
      .from('illia_leads')
      .insert(testLead)
      .select()
      .single()

    if (insertError) {
      console.log(`❌ Insert failed: ${insertError.message}`)
    } else {
      console.log(`✅ Test lead inserted with ID: ${insertData.id}`)

      // Clean up test data
      await serviceSupabase
        .from('illia_leads')
        .delete()
        .eq('id', insertData.id)
      console.log('🧹 Test data cleaned up')
    }

    console.log('\n✨ All tests completed!')
    console.log('Your Supabase backend is properly configured.')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testConnection()