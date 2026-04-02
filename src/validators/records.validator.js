const { z } = require('zod');

const createRecordSchema = z.object({
  amount: z.number({ required_error: 'Amount is required' }).positive('Amount must be positive'),
  type: z.enum(['income', 'expense'], { required_error: 'Type must be income or expense' }),
  category: z.string().min(1, 'Category is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  notes: z.string().optional(),
});

const updateRecordSchema = z.object({
  amount: z.number().positive('Amount must be positive').optional(),
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().min(1).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
  notes: z.string().optional(),
});

module.exports = { createRecordSchema, updateRecordSchema };