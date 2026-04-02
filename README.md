# FinFlow — Financial Ledger Monitoring

A full-stack financial management dashboard with role-based access control, budget tracking, transaction monitoring, compliance flagging, and audit logs.

**Backend** — Node.js, Express, Supabase (PostgreSQL), JWT, Zod  
**Frontend** — React 18, Vite, React Router, Recharts, Axios

---

## Project Structure

```
LedgerMonitoring/
├── src/                        # Backend (Express API)
│   ├── controllers/            # HTTP request handlers
│   ├── services/               # Business logic
│   ├── routes/                 # Route definitions
│   ├── middleware/             # Auth, role, audit, error
│   ├── validators/             # Zod schemas
│   ├── db/                     # Supabase client + migrations
│   ├── seed/                   # Database seed script
│   ├── app.js                  # Express app setup
│   └── server.js               # Entry point
├── Frontend/                   # Frontend (React + Vite)
│   ├── src/
│   │   ├── api/                # Axios API calls per domain
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # AuthContext (global auth state)
│   │   ├── pages/              # Route-level page components
│   │   └── styles/             # Per-page CSS files
│   └── vercel.json
├── tests/                      # Jest unit tests
├── render.yaml                 # Render deployment config
├── docker-compose.yml          # Local Docker setup
└── README.md
```

---

## Architecture

### Request Flow

```
Client (React)
  │
  ▼
Axios (Frontend/src/api/)
  │  adds Bearer token to every request
  ▼
Express Router (src/routes/)
  │
  ├── requireAuth middleware     → verifies JWT, attaches req.user
  ├── requireRole middleware     → checks req.user.role against allowed roles
  │
  ▼
Controller (src/controllers/)
  │  validates request body with Zod
  │  returns HTTP response
  ▼
Service (src/services/)
  │  contains all business logic
  │  calls Supabase for data
  │  calls logAudit() for mutations
  ▼
Supabase (PostgreSQL)
```

### Layer Responsibilities

**Routes** — wire HTTP methods and paths to controllers, apply middleware chains

**Controllers** — parse and validate request input with Zod, call the appropriate service, return JSON responses. No business logic lives here.

**Services** — all business logic lives here: querying Supabase, applying filters, auto-flagging compliance, computing aggregates. Services are HTTP-agnostic and easy to unit test.

**Middleware**
- `requireAuth` — extracts and verifies the Bearer JWT, attaches decoded payload to `req.user`
- `requireRole(...roles)` — factory function, returns middleware that checks `req.user.role` against the allowed list. Composable and reusable across any route
- `logAudit()` — writes a record to `audit_logs` table with before/after values on every mutation. Failures are swallowed so they never break the main request
- `errorHandler` — global Express error handler, returns consistent `{ error, details }` JSON shape

**Validators** — Zod schemas co-located with the HTTP boundary (controllers), keeping services free of HTTP concerns

### Key Design Decisions

**Soft deletes** — records are never hard deleted. A `deleted_at` timestamp is set instead, preserving full audit history. All queries filter `deleted_at IS NULL`.

**Auto compliance flagging** — when a record is created or updated, if `amount >= 100,000` it is automatically set to `flagged` status. Analysts and admins can manually change it to `clean` or `under_review`.

**Role-based middleware factory** — `requireRole('admin', 'analyst')` is a single composable call, making route-level access control declarative and readable.

**Supabase service role key** — used server-side only, bypasses Row Level Security, giving full control over data access in application code rather than database policies.

**JWT payload** — tokens carry `{ id, email, role }` so every request has user context without an extra database lookup.

---

## Roles & Permissions

| Role | Access |
|---|---|
| `viewer` | Dashboard, Records (read), Budget |
| `analyst` | + Monitoring, Compliance review |
| `admin` | + Create/Update/Delete records, Audit Logs, User management |

---

## API Endpoints

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |

### Records
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/records` | Any | List records (filterable, paginated) |
| POST | `/api/records` | Admin | Create record |
| PATCH | `/api/records/:id` | Admin | Update record |
| PATCH | `/api/records/:id/compliance` | Admin, Analyst | Update compliance status |
| DELETE | `/api/records/:id` | Admin | Soft delete record |

#### Query Parameters for `GET /api/records`
| Param | Type | Description |
|---|---|---|
| `type` | `income` or `expense` | Filter by type |
| `category` | string | Partial match |
| `from` | `YYYY-MM-DD` | Start date |
| `to` | `YYYY-MM-DD` | End date |
| `compliance_status` | `clean`, `flagged`, `under_review` | Filter by compliance |
| `page` | number | Page number (default: 1) |
| `limit` | number | Per page (default: 10) |

### Dashboard
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/dashboard/summary` | Any | Income, expenses, net balance |
| GET | `/api/dashboard/by-category` | Any | Totals grouped by category |
| GET | `/api/dashboard/trends` | Any | Monthly income/expense trends |
| GET | `/api/dashboard/recent` | Any | Last 10 transactions |
| GET | `/api/dashboard/forecast` | Any | Projected next month spend |

### Users
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/users` | Admin | List all users |
| PATCH | `/api/users/:id/role` | Admin | Update user role |
| PATCH | `/api/users/:id/status` | Admin | Activate/deactivate user |

### Other
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/monitoring` | Analyst, Admin | Anomaly and threshold alerts |
| GET | `/api/audit-logs` | Admin | Full audit trail |
| GET | `/api/budgets` | Any | Budget vs actual |
| GET | `/health` | Public | Health check |

---

## Local Development

### Backend

```bash
npm install
cp src/.env.example src/.env   # fill in values
npm run dev                     # http://localhost:3000
npm run seed                    # seed demo data
npm test                        # run Jest tests
```

### Frontend

```bash
cd Frontend
npm install
npm run dev                     # http://localhost:3011
```

---

## Environment Variables

### Backend (`src/.env`)

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side only) |
| `JWT_SECRET` | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | Token expiry e.g. `24h` |
| `PORT` | Server port (default `3000`) |
| `FRONTEND_URL` | Allowed CORS origin e.g. `https://your-app.vercel.app` |

### Frontend (`Frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL e.g. `https://your-app.onrender.com/api` |

---

## Deployment

### Backend → Render
1. Connect repo — `render.yaml` auto-configures build and start commands
2. Add secrets in Render dashboard: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `FRONTEND_URL`

### Frontend → Vercel
1. Connect repo, set root directory to `Frontend`
2. Add env var in Vercel dashboard: `VITE_API_URL` → your Render URL + `/api`

---

## Docker (Local)

```bash
docker-compose up --build
```

Backend → `http://localhost:3000`  
Frontend → `http://localhost:3011`
