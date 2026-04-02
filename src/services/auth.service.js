const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../db');
const { createError } = require('../middleware/error.middleware');

/**
 * Registers a new user, hashing their password before storage.
 */
const register = async ({ name, email, password, role = 'viewer' }) => {
  // Check for existing user
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) throw createError(400, 'Email already registered');

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert({ name, email, password: hashedPassword, role })
    .select('id, name, email, role, status, created_at')
    .single();

  if (error) throw createError(500, 'Failed to create user');
  return data;
};

/**
 * Authenticates a user and returns a signed JWT.
 */
const login = async ({ email, password }) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) throw createError(401, 'Invalid credentials');
  if (user.status === 'inactive') throw createError(403, 'Account is inactive');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw createError(401, 'Invalid credentials');

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

module.exports = { register, login };