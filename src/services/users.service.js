const supabase = require('../db');
const { createError } = require('../middleware/error.middleware');

/**
 * Returns all users (excluding passwords).
 */
const listUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role, status, created_at')
    .order('created_at', { ascending: false });

  if (error) throw createError(500, 'Failed to fetch users');
  return data;
};

/**
 * Updates a user's role.
 */
const updateRole = async (id, role) => {
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', id)
    .select('id, name, email, role, status')
    .single();

  if (error || !data) throw createError(404, 'User not found');
  return data;
};

/**
 * Updates a user's status (active/inactive).
 */
const updateStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('users')
    .update({ status })
    .eq('id', id)
    .select('id, name, email, role, status')
    .single();

  if (error || !data) throw createError(404, 'User not found');
  return data;
};

module.exports = { listUsers, updateRole, updateStatus };