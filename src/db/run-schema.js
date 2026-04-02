require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { Client } = require('pg');

// Supabase direct connection uses the service role key as the password
// when connecting via the session pooler
const url = new URL(process.env.SUPABASE_URL);
const projectRef = url.hostname.split('.')[0];

const client = new Client({
  host: `db.${projectRef}.supabase.co`,
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: process.env.DB_PASSWORD || process.env.SUPABASE_SERVICE_ROLE_KEY,
  ssl: { rejectUnauthorized: false }
});

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'analyst', 'viewer')),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS financial_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(15, 2) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_financial_records_deleted_at ON financial_records(deleted_at);
CREATE INDEX IF NOT EXISTS idx_financial_records_user_id ON financial_records(user_id);
`;

async function runSchema() {
  try {
    await client.connect();
    console.log('Connected to database!');
    await client.query(schema);
    console.log('Schema created successfully!');
    await client.end();
  } catch (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  }
}

runSchema();