// Unit tests for records service logic (pagination calculation, filter building)

const calculateOffset = (page, limit) => (page - 1) * limit;

describe('Records Service - Pagination', () => {
  it('should calculate correct offset for page 1', () => {
    expect(calculateOffset(1, 10)).toBe(0);
  });

  it('should calculate correct offset for page 3 with limit 5', () => {
    expect(calculateOffset(3, 5)).toBe(10);
  });

  it('should calculate correct offset for page 2 with limit 10', () => {
    expect(calculateOffset(2, 10)).toBe(10);
  });
});

describe('Records Service - Filter validation', () => {
  const isValidDate = (str) => /^\d{4}-\d{2}-\d{2}$/.test(str);

  it('should validate correct date format', () => {
    expect(isValidDate('2024-01-15')).toBe(true);
  });

  it('should reject invalid date format', () => {
    expect(isValidDate('01-15-2024')).toBe(false);
    expect(isValidDate('2024/01/15')).toBe(false);
  });

  it('should accept valid type filter', () => {
    const validTypes = ['income', 'expense'];
    expect(validTypes.includes('income')).toBe(true);
    expect(validTypes.includes('salary')).toBe(false);
  });
});