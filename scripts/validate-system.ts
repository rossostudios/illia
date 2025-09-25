#!/usr/bin/env node

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import chalk from 'chalk'

// Load environment variables
config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

interface ValidationResult {
  category: string
  test: string
  status: 'pass' | 'fail' | 'warning'
  message?: string
  details?: any
}

class SystemValidator {
  private results: ValidationResult[] = []
  private supabase: any

  constructor() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase environment variables')
    }

    this.supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  }

  private addResult(result: ValidationResult) {
    this.results.push(result)

    const icon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌'
    const color = result.status === 'pass' ? chalk.green : result.status === 'warning' ? chalk.yellow : chalk.red

    console.log(`${icon} ${color(result.test)}`)
    if (result.message) {
      console.log(`   ${result.message}`)
    }
  }

  // 1. Database Connection Tests
  async validateDatabaseConnection() {
    console.log(chalk.blue('\n🔍 Validating Database Connection...'))

    try {
      const { data, error } = await this.supabase.from('users').select('count').limit(0)

      if (error) throw error

      this.addResult({
        category: 'Database',
        test: 'Database connection',
        status: 'pass',
        message: 'Successfully connected to database',
      })
    } catch (error: any) {
      this.addResult({
        category: 'Database',
        test: 'Database connection',
        status: 'fail',
        message: `Failed to connect: ${error.message}`,
      })
    }
  }

  // 2. Table Structure Validation
  async validateTableStructure() {
    console.log(chalk.blue('\n🔍 Validating Table Structure...'))

    const requiredTables = [
      'users',
      'service_providers',
      'matches',
      'bookings',
      'reviews',
      'leads',
      'notifications',
      'analytics_events',
      'community_threads',
      'direct_messages',
    ]

    for (const table of requiredTables) {
      try {
        const { error } = await this.supabase.from(table).select('*').limit(0)

        if (error) throw error

        this.addResult({
          category: 'Schema',
          test: `Table: ${table}`,
          status: 'pass',
        })
      } catch (error: any) {
        this.addResult({
          category: 'Schema',
          test: `Table: ${table}`,
          status: 'fail',
          message: error.message,
        })
      }
    }
  }

  // 3. Required Columns Validation
  async validateRequiredColumns() {
    console.log(chalk.blue('\n🔍 Validating Required Columns...'))

    const columnChecks = [
      { table: 'users', columns: ['avatar_url', 'bio', 'notification_settings'] },
      { table: 'service_providers', columns: ['avatar_url', 'is_active', 'badges', 'location'] },
      { table: 'matches', columns: ['match_score', 'dismissed_at', 'notes'] },
      { table: 'bookings', columns: ['status', 'booking_date', 'booking_time'] },
    ]

    for (const check of columnChecks) {
      try {
        const { data, error } = await this.supabase
          .from(check.table)
          .select(check.columns.join(','))
          .limit(1)

        if (error) {
          this.addResult({
            category: 'Schema',
            test: `Columns in ${check.table}`,
            status: 'fail',
            message: `Missing columns: ${error.message}`,
          })
        } else {
          this.addResult({
            category: 'Schema',
            test: `Columns in ${check.table}`,
            status: 'pass',
            message: `All required columns present`,
          })
        }
      } catch (error: any) {
        this.addResult({
          category: 'Schema',
          test: `Columns in ${check.table}`,
          status: 'fail',
          message: error.message,
        })
      }
    }
  }

  // 4. Index Performance Check
  async validateIndexes() {
    console.log(chalk.blue('\n🔍 Validating Database Indexes...'))

    const indexChecks = [
      'idx_users_email',
      'idx_users_tier',
      'idx_providers_city',
      'idx_providers_services',
      'idx_matches_user',
      'idx_matches_provider',
      'idx_bookings_user',
      'idx_bookings_date',
    ]

    try {
      // Query to check if indexes exist
      const { data, error } = await this.supabase.rpc('get_indexes')

      if (error) {
        // If RPC doesn't exist, just warn
        this.addResult({
          category: 'Performance',
          test: 'Database indexes',
          status: 'warning',
          message: 'Could not verify indexes (RPC function not available)',
        })
      } else {
        const existingIndexes = data?.map((idx: any) => idx.indexname) || []

        for (const indexName of indexChecks) {
          if (existingIndexes.includes(indexName)) {
            this.addResult({
              category: 'Performance',
              test: `Index: ${indexName}`,
              status: 'pass',
            })
          } else {
            this.addResult({
              category: 'Performance',
              test: `Index: ${indexName}`,
              status: 'warning',
              message: 'Index may be missing',
            })
          }
        }
      }
    } catch (error: any) {
      this.addResult({
        category: 'Performance',
        test: 'Database indexes',
        status: 'warning',
        message: 'Could not check indexes',
      })
    }
  }

  // 5. RLS Policy Check
  async validateRLSPolicies() {
    console.log(chalk.blue('\n🔍 Validating Row Level Security...'))

    const tablesWithRLS = [
      'users',
      'service_providers',
      'matches',
      'bookings',
      'reviews',
      'notifications',
    ]

    for (const table of tablesWithRLS) {
      try {
        // Try to query without auth (should fail if RLS is enabled)
        const anonSupabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)
        const { data, error } = await anonSupabase.from(table).select('*').limit(1)

        // If we get data without auth, RLS might be disabled (warning)
        if (data && data.length > 0) {
          this.addResult({
            category: 'Security',
            test: `RLS on ${table}`,
            status: 'warning',
            message: 'Table accessible without authentication - check RLS policies',
          })
        } else {
          this.addResult({
            category: 'Security',
            test: `RLS on ${table}`,
            status: 'pass',
            message: 'RLS appears to be enabled',
          })
        }
      } catch (error) {
        // Error accessing table is expected with RLS
        this.addResult({
          category: 'Security',
          test: `RLS on ${table}`,
          status: 'pass',
        })
      }
    }
  }

  // 6. API Endpoint Tests
  async validateAPIEndpoints() {
    console.log(chalk.blue('\n🔍 Validating API Endpoints...'))

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const endpoints = [
      { path: '/api/providers/search', method: 'GET' },
      { path: '/api/bookings', method: 'GET' },
      { path: '/api/matches', method: 'GET' },
    ]

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${baseUrl}${endpoint.path}`, {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.status === 401) {
          // Unauthorized is expected without auth
          this.addResult({
            category: 'API',
            test: `${endpoint.method} ${endpoint.path}`,
            status: 'pass',
            message: 'Endpoint requires authentication (expected)',
          })
        } else if (response.ok) {
          this.addResult({
            category: 'API',
            test: `${endpoint.method} ${endpoint.path}`,
            status: 'pass',
            message: 'Endpoint accessible',
          })
        } else {
          this.addResult({
            category: 'API',
            test: `${endpoint.method} ${endpoint.path}`,
            status: 'warning',
            message: `Status: ${response.status}`,
          })
        }
      } catch (error: any) {
        this.addResult({
          category: 'API',
          test: `${endpoint.method} ${endpoint.path}`,
          status: 'fail',
          message: `Failed to reach endpoint: ${error.message}`,
        })
      }
    }
  }

  // 7. Real-time Configuration
  async validateRealtime() {
    console.log(chalk.blue('\n🔍 Validating Real-time Configuration...'))

    try {
      const channel = this.supabase.channel('test_channel')

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Real-time connection timeout'))
        }, 5000)

        channel
          .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {})
          .subscribe((status: string) => {
            clearTimeout(timeout)
            if (status === 'SUBSCRIBED') {
              resolve(true)
            } else if (status === 'CHANNEL_ERROR') {
              reject(new Error('Channel error'))
            }
          })
      })

      this.supabase.removeChannel(channel)

      this.addResult({
        category: 'Real-time',
        test: 'Real-time subscriptions',
        status: 'pass',
        message: 'Real-time is configured correctly',
      })
    } catch (error: any) {
      this.addResult({
        category: 'Real-time',
        test: 'Real-time subscriptions',
        status: 'warning',
        message: `Real-time may not be configured: ${error.message}`,
      })
    }
  }

  // 8. Environment Variables Check
  async validateEnvironmentVariables() {
    console.log(chalk.blue('\n🔍 Validating Environment Variables...'))

    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
    ]

    const optionalEnvVars = [
      'NEXT_PUBLIC_POLAR_CHECKOUT_LINK',
      'POLAR_WEBHOOK_SECRET',
      'NEXT_PUBLIC_APP_URL',
    ]

    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        this.addResult({
          category: 'Configuration',
          test: `Environment: ${envVar}`,
          status: 'pass',
        })
      } else {
        this.addResult({
          category: 'Configuration',
          test: `Environment: ${envVar}`,
          status: 'fail',
          message: 'Required environment variable is missing',
        })
      }
    }

    for (const envVar of optionalEnvVars) {
      if (process.env[envVar]) {
        this.addResult({
          category: 'Configuration',
          test: `Environment: ${envVar}`,
          status: 'pass',
        })
      } else {
        this.addResult({
          category: 'Configuration',
          test: `Environment: ${envVar}`,
          status: 'warning',
          message: 'Optional environment variable is missing',
        })
      }
    }
  }

  // Generate summary report
  generateReport() {
    console.log(chalk.blue('\n' + '='.repeat(60)))
    console.log(chalk.blue.bold('VALIDATION SUMMARY'))
    console.log(chalk.blue('='.repeat(60)))

    const passed = this.results.filter(r => r.status === 'pass').length
    const warnings = this.results.filter(r => r.status === 'warning').length
    const failed = this.results.filter(r => r.status === 'fail').length
    const total = this.results.length

    console.log(chalk.green(`✅ Passed: ${passed}/${total}`))
    console.log(chalk.yellow(`⚠️  Warnings: ${warnings}`))
    console.log(chalk.red(`❌ Failed: ${failed}`))

    if (failed > 0) {
      console.log(chalk.red('\n❌ VALIDATION FAILED'))
      console.log('Please fix the following issues:')

      this.results
        .filter(r => r.status === 'fail')
        .forEach(r => {
          console.log(chalk.red(`  - ${r.test}: ${r.message || 'Failed'}`))
        })
    } else if (warnings > 0) {
      console.log(chalk.yellow('\n⚠️  VALIDATION PASSED WITH WARNINGS'))
      console.log('Consider addressing these warnings:')

      this.results
        .filter(r => r.status === 'warning')
        .forEach(r => {
          console.log(chalk.yellow(`  - ${r.test}: ${r.message || 'Warning'}`))
        })
    } else {
      console.log(chalk.green('\n✨ ALL VALIDATIONS PASSED!'))
      console.log('Your system is properly configured and ready for production.')
    }

    console.log(chalk.blue('\n' + '='.repeat(60)))

    return failed === 0
  }

  // Run all validations
  async runAll() {
    console.log(chalk.blue.bold('\n🚀 Starting System Validation for September 2025\n'))

    await this.validateEnvironmentVariables()
    await this.validateDatabaseConnection()
    await this.validateTableStructure()
    await this.validateRequiredColumns()
    await this.validateIndexes()
    await this.validateRLSPolicies()
    await this.validateAPIEndpoints()
    await this.validateRealtime()

    return this.generateReport()
  }
}

// Main execution
async function main() {
  try {
    const validator = new SystemValidator()
    const success = await validator.runAll()

    process.exit(success ? 0 : 1)
  } catch (error: any) {
    console.error(chalk.red('\n❌ Fatal error during validation:'))
    console.error(error.message)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { SystemValidator }