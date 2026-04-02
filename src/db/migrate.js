require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrate() {
  console.log('Running migrations...');

  // Create users table
  const { error: e1 } = await supabase.rpc('run_migration', {
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin','analyst','viewer')),
        status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `
  });

  if (e1) {
    // Fallback: check if table exists by querying it
    const { error: checkErr } = await supabase.from('users').select('id').limit(1);
    if (checkErr && checkErr.code === '42P01') {
      console.error('Tables do not exist. Please run the SQL schema manually in Supabase SQL editor.');
      console.error('Schema file: src/db/schema.sql');
      process.exit(1);
    }
  }

  console.log('Migration check complete.');
}

migrate().catch(console.error);