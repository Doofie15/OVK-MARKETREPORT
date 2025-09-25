#!/usr/bin/env node

/**
 * Setup Analytics Database Script
 * Applies the analytics migrations to Supabase database
 */

const { createClient } = require('@supabase/supabase-js');
const { readFileSync } = require('fs');
const { join } = require('path');

// Load environment variables
require('dotenv').config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://gymdertakhxjmfrmcqgp.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required');
  console.log('Add it to your .env.local file or environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const migrations = [
  '20250925000001_create_analytics_tables.sql',
  '20250925000002_create_analytics_views.sql',
  '20250925000003_create_auction_analytics_views.sql'
];

async function runMigration(filename) {
  try {
    console.log(`📦 Running migration: ${filename}`);
    
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', filename);
    const sql = readFileSync(migrationPath, 'utf8');
    
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      // Try direct execution if rpc doesn't work
      const { error: directError } = await supabase
        .from('dummy_table_that_doesnt_exist')
        .select('*');
      
      // Since the above will fail, we'll use a different approach
      console.log(`⚠️  RPC approach failed, migration needs manual execution: ${filename}`);
      console.log(`📋 SQL content needs to be executed in Supabase SQL Editor:`);
      console.log('─'.repeat(80));
      console.log(sql);
      console.log('─'.repeat(80));
      return false;
    }
    
    console.log(`✅ Migration completed: ${filename}`);
    return true;
  } catch (e) {
    console.error(`❌ Migration failed: ${filename}`, e.message);
    return false;
  }
}

async function setupAnalyticsDatabase() {
  console.log('🚀 Setting up OVK Analytics Database');
  console.log(`📡 Connecting to: ${SUPABASE_URL}`);
  
  // Test connection
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error && !error.message.includes('relation "users" does not exist')) {
      throw error;
    }
    console.log('✅ Connected to Supabase');
  } catch (e) {
    console.error('❌ Failed to connect to Supabase:', e.message);
    process.exit(1);
  }
  
  let successCount = 0;
  
  for (const migration of migrations) {
    const success = await runMigration(migration);
    if (success) successCount++;
    console.log(''); // Add spacing
  }
  
  console.log('📊 Migration Summary:');
  console.log(`✅ Successful: ${successCount}/${migrations.length}`);
  console.log(`❌ Failed: ${migrations.length - successCount}/${migrations.length}`);
  
  if (successCount === 0) {
    console.log('\n🔧 Manual Setup Required:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Execute each migration file in order:');
    migrations.forEach((file, index) => {
      console.log(`   ${index + 1}. supabase/migrations/${file}`);
    });
    console.log('\n📖 See docs/NETLIFY_DEPLOYMENT.md for detailed instructions');
  } else if (successCount === migrations.length) {
    console.log('\n🎉 Analytics database setup complete!');
    console.log('✅ You can now use the full analytics dashboard');
  } else {
    console.log('\n⚠️  Partial setup completed');
    console.log('Some migrations may need manual execution');
  }
  
  console.log('\n🔗 Supabase Dashboard: https://supabase.com/dashboard/projects');
}

setupAnalyticsDatabase().catch(console.error);
