// Unit tests for dashboard service aggregation logic

const computeSummary = (records) => {
  const totalIncome = records
    .filter((r) => r.type === 'income')
    .reduce((sum, r) => sum + Number(r.amount), 0);
  const totalExpenses = records
    .filter((r) => r.type === 'expense')
    .reduce((sum, r) => sum + Number(r.amount), 0);
  return { total_income: totalIncome, total_expenses: totalExpenses, net_balance: totalIncome - totalExpenses };
};

const groupByCategory = (records) => {
  const grouped = {};
  for (const record of records) {
    const key = record.category;
    if (!grouped[key]) grouped[key] = { category: key, income: 0, expense: 0 };
    grouped[key][record.type] += Number(record.amount);
  }
  return Object.values(grouped);
};

describe('Dashboard Service - Summary', () => {
  const records = [
    { type: 'income', amount: 5000, category: 'Salary', date: '2024-01-05' },
    { type: 'expense', amount: 200, category: 'Food', date: '2024-01-10' },
    { type: 'expense', amount: 1200, category: 'Rent', date: '2024-01-01' },
    { type: 'income', amount: 300, category: 'Freelance', date: '2024-01-20' },
  ];

  it('should compute correct total income', () => {
    const { total_income } = computeSummary(records);
    expect(total_income).toBe(5300);
  });

  it('should compute correct total expenses', () => {
    const { total_expenses } = computeSummary(records);
    expect(total_expenses).toBe(1400);
  });

  it('should compute correct net balance', () => {
    const { net_balance } = computeSummary(records);
    expect(net_balance).toBe(3900);
  });
});

describe('Dashboard Service - By Category', () => {
  const records = [
    { type: 'income', amount: 5000, category: 'Salary' },
    { type: 'expense', amount: 200, category: 'Food' },
    { type: 'expense', amount: 150, category: 'Food' },
    { type: 'income', amount: 300, category: 'Freelance' },
  ];

  it('should group records correctly by category', () => {
    const result = groupByCategory(records);
    const food = result.find((r) => r.category === 'Food');
    expect(food.expense).toBe(350);
    expect(food.income).toBe(0);
  });

  it('should return correct number of categories', () => {
    const result = groupByCategory(records);
    expect(result.length).toBe(3);
  });
});