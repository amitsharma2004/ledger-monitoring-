const supabase = require('../db');
const { createError } = require('../middleware/error.middleware');

const getLogs = async ({ user_id, action, from, to, page = 1, limit = 20 }) => {
  const offset = (page - 1) * limit;

  let query = supabase
    .from('audit_logs')
    // user_email is stored directly in audit_logs — no join needed
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (user_id) query = query.eq('user_id', user_id);
  if (action) query = query.eq('action', action);
  if (from) query = query.gte('created_at', from);
  if (to) query = query.lte('created_at', to + 'T23:59:59Z');

  const { data, error, count } = await query;
  if (error) throw createError(500, 'Failed to fetch audit logs');
  return { logs: data, total: count, page: Number(page), limit: Number(limit) };
};

module.exports = { getLogs };