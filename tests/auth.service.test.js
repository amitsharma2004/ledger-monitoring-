// Unit tests for auth service logic (pure functions, no DB)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test_secret';

describe('Auth Service - password hashing', () => {
  it('should hash password and verify correctly', async () => {
    const password = 'mypassword123';
    const hash = await bcrypt.hash(password, 10);
    const valid = await bcrypt.compare(password, hash);
    expect(valid).toBe(true);
  });

  it('should reject incorrect password', async () => {
    const hash = await bcrypt.hash('correctpass', 10);
    const invalid = await bcrypt.compare('wrongpass', hash);
    expect(invalid).toBe(false);
  });
});

describe('Auth Service - JWT', () => {
  it('should sign and verify JWT token', () => {
    const payload = { id: '123', email: 'test@test.com', role: 'admin' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe('123');
    expect(decoded.role).toBe('admin');
  });

  it('should throw on invalid token', () => {
    expect(() => jwt.verify('invalid.token.here', process.env.JWT_SECRET)).toThrow();
  });
});