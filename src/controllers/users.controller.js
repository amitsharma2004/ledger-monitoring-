const usersService = require('../services/users.service');
const { updateRoleSchema, updateStatusSchema } = require('../validators/users.validator');

const listUsers = async (req, res, next) => {
  try {
    const users = await usersService.listUsers();
    return res.json({ users });
  } catch (err) {
    next(err);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const parsed = updateRoleSchema.safeParse(req.body);
    if (!parsed.success) {
      const details = Object.fromEntries(
        parsed.error.errors.map((e) => [e.path.join('.'), e.message])
      );
      return res.status(400).json({ error: 'Validation failed', details });
    }
    const user = await usersService.updateRole(req.params.id, parsed.data.role);
    return res.json({ user });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const parsed = updateStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      const details = Object.fromEntries(
        parsed.error.errors.map((e) => [e.path.join('.'), e.message])
      );
      return res.status(400).json({ error: 'Validation failed', details });
    }
    const user = await usersService.updateStatus(req.params.id, parsed.data.status);
    return res.json({ user });
  } catch (err) {
    next(err);
  }
};

module.exports = { listUsers, updateRole, updateStatus };