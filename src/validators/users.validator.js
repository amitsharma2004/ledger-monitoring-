const { z } = require('zod');

const updateRoleSchema = z.object({
  role: z.enum(['admin', 'analyst', 'viewer'], { required_error: 'Role is required' }),
});

const updateStatusSchema = z.object({
  status: z.enum(['active', 'inactive'], { required_error: 'Status is required' }),
});

module.exports = { updateRoleSchema, updateStatusSchema };