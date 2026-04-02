require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const seedUsers = [
  { name: 'Admin User', email: 'admin@test.com', password: 'password123', role: 'admin', status: 'active' },
  { name: 'Analyst User', email: 'analyst@test.com', password: 'password123', role: 'analyst', status: 'active' },
  { name: 'Viewer User', email: 'viewer@test.com', password: 'password123', role: 'viewer', status: 'active' },
];

const categories = ['Salary', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Freelance', 'Rent'];

const sampleRecords = [
  { amount: 5000, type: 'income', category: 'Salary', date: '2024-01-05', notes: 'January salary' },
  { amount: 200, type: 'expense', category: 'Food', date: '2024-01-10', notes: 'Groceries' },
  { amount: 80, type: 'expense', category: 'Transport', date: '2024-01-15', notes: 'Monthly bus pass' },
  { amount: 1200, type: 'expense', category: 'Rent', date: '2024-01-01', notes: 'January rent' },
  { amount: 5000, type: 'income', category: 'Salary', date: '2024-02-05', notes: 'February salary' },
  { amount: 180, type: 'expense', category: 'Food', date: '2024-02-12', notes: 'Restaurant & groceries' },
  { amount: 300, type: 'income', category: 'Freelance', date: '2024-02-20', notes: 'Side project payment' },
  { amount: 60, type: 'expense', category: 'Entertainment', date: '2024-02-25', notes: 'Streaming subscriptions' },
  { amount: 1200, type: 'expense', category: 'Rent', date: '2024-02-01', notes: 'February rent' },
  { amount: 5000, type: 'income', category: 'Salary', date: '2024-03-05', notes: 'March salary' },
  { amount: 150, type: 'expense', category: 'Utilities', date: '2024-03-08', notes: 'Electricity bill' },
  { amount: 220, type: 'expense', category: 'Food', date: '2024-03-14', notes: 'Weekly groceries' },
  { amount: 500, type: 'income', category: 'Freelance', date: '2024-03-18', notes: 'Consulting work' },
  { amount: 90, type: 'expense', category: 'Health', date: '2024-03-22', notes: 'Pharmacy' },
  { amount: 1200, type: 'expense', category: 'Rent', date: '2024-03-01', notes: 'March rent' },
];

async function seed() {
  console.log('Starting seed...');

  // Clear existing seed data
  await supabase.from('financial_records').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('users').delete().in('email', seedUsers.map((u) => u.email));

  // Insert users
  const userIds = [];
  for (const user of seedUsers) {
    const hashed = await bcrypt.hash(user.password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert({ ...user, password: hashed })
      .select('id')
      .single();

    if (error) {
      console.error(`Failed to insert user ${user.email}:`, error.message);
      process.exit(1);
    }
    userIds.push(data.id);
    console.log(`Created user: ${user.email} (${user.role})`);
  }

  // Use admin user id for records
  const adminId = userIds[0];
  for (const record of sampleRecords) {
    const { error } = await supabase.from('financial_records').insert({ ...record, user_id: adminId });
    if (error) {
      console.error(`Failed to insert record:`, error.message);
      process.exit(1);
    }
  }
  console.log(`Seeded ${sampleRecords.length} financial records`);
  console.log('Seed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});