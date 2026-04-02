const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const recordsRoutes = require('./routes/records.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const monitoringRoutes = require('./routes/monitoring.routes');
const auditRoutes = require('./routes/audit.routes');
const budgetRoutes = require('./routes/budget.routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

const allowedOrigins = [
  'http://localhost:3011',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/records', recordsRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/monitoring', monitoringRoutes);
app.use('/audit-logs', auditRoutes);
app.use('/budgets', budgetRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', version: '2.0.0' }));
app.use(errorHandler);

module.exports = app;