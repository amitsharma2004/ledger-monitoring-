const authService = require('../services/auth.service');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

const register = async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      const details = Object.fromEntries(
        parsed.error.errors.map((e) => [e.path.join('.'), e.message])
      );
      return res.status(400).json({ error: 'Validation failed', details });
    }
    const user = await authService.register(parsed.data);
    return res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const details = Object.fromEntries(
        parsed.error.errors.map((e) => [e.path.join('.'), e.message])
      );
      return res.status(400).json({ error: 'Validation failed', details });
    }
    const result = await authService.login(parsed.data);
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };