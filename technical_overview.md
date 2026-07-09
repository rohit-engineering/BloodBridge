# Technical Overview: BloodBridge

## Stack

- Frontend: React 18, Vite, Tailwind CSS, Redux Toolkit, React Router, Axios
- API: Node.js, Express, JWT, parameterized SQL through `pg`
- Database: Neon PostgreSQL
- Background service: Node.js, node-cron, EJS, Nodemailer

## Data model

- `users`: staff authentication and roles
- `prospects`: public donor-interest submissions
- `donors`: staff-approved donor records

The idempotent schema is defined in `Backend/db/schema.sql` and applied with
`npm run db:init`.

## Runtime flow

1. Visitors use educational donor tools and submit the interest form.
2. The Express API inserts the form into `prospects`.
3. Staff authenticate with JWT and review prospects in the admin UI.
4. Approved prospects become donor records.
5. The background service reads the same Neon tables and sends scheduled
   eligibility, welcome, and reminder emails.

Both Node services use the same pooled `DATABASE_URL`. They expose `/health`,
stay running when Neon is unavailable, and retry the connection automatically.

## Security

- SQL values use PostgreSQL parameters rather than string interpolation.
- Admin donor creation requires a valid admin JWT.
- Secrets and database credentials live in ignored `.env` files.
- Production dependencies currently pass `npm audit`.
