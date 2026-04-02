# Finance API

A RESTful API for managing personal financial records, built with Node.js, Express, and Supabase. Supports role-based access control, JWT authentication, soft-deleted records, and dashboard analytics.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express 4
- **Database**: Supabase (PostgreSQL)
- **Auth**: JSON Web Tokens (jsonwebtoken)
- **Validation**: Zod
- **Password Hashing**: bcryptjs
- **Testing**: Jest

## Setup Instructions

```bash
cp .env.example .env   # fill in your Supabase and JWT values
npm install
npm start
```

## Environment Variables

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL (e.g. `https://xxx.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (bypasses RLS) |
| `JWT_SECRET` | Secret string used to sign JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry duration (default: `24h`) |
| `PORT` | Port the server listens on (default: `3000`) |

## API Endpoints

| Method | Path | Required Role | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Log in and receive a JWT |
| GET | `/users` | admin | List all users |
| PATCH | `/users/:id/role` | admin | Update a user's role |
| PATCH | `/users/:id/status` | admin | Activate or deactivate a user |
| GET | `/records` | any authenticated | List financial records (filterable, paginated) |
| POST | `/records` | admin | Create a new financial record |
| PATCH | `/records/:id` | admin | Update an existing record |
| DELETE | `/records/:id` | admin | Soft-delete a record |
| GET | `/dashboard/summary` | any authenticated | Income, expenses, and net balance |
| GET | `/dashboard/by-category` | any authenticated | Totals grouped by category |
| GET | `/dashboard/trends` | any authenticated | Monthly income/expense trends |
| GET | `/dashboard/recent` | any authenticated | Last 10 transactions |
| GET | `/health` | Public | Health check |

### Query Parameters for `GET /records`

| Param | Type | Description |
|---|---|---|
| `type` | `income` or `expense` | Filter by record type |
| `category` | string | Partial match on category name |
| `from` | `YYYY-MM-DD` | Filter records on or after this date |
| `to` | `YYYY-MM-DD` | Filter records on or before this date |
| `page` | number | Page number (default: 1) |
| `limit` | number | Records per page (default: 10) |

## Assumptions

- The Supabase project has the schema from `src/db/schema.sql` applied before running.
- The service role key is used server-side only and never exposed to clients.
- Users register with a default role of `viewer`; role elevation is performed by an admin via `PATCH /users/:id/role`.
- All financial record mutations (create, update, delete) are restricted to `admin` role.
- Soft deletion is implemented via a `deleted_at` timestamp; deleted records are excluded from all queries and counts.

## Design Decisions

- **Role-based middleware factory**: `requireRole(...roles)` is a factory function, making it composable and reusable across any route without duplication.
- **Soft deletes over hard deletes**: Setting `deleted_at` preserves audit history and allows potential recovery, which is important in financial systems.
- **Zod validation at the controller layer**: Validation is co-located with the HTTP boundary, keeping services free of HTTP concerns and easier to test in isolation.
- **Supabase service role key**: Using the service role key server-side bypasses Row Level Security, giving full control over data access logic in application code rather than database policies.
- **Pure function unit tests**: Tests for services cover the core aggregation and pagination logic as pure functions, making them fast and dependency-free without requiring a live database or mocks.