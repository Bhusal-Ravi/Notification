# Notification Service

Backend service that schedules personal reminders (water, exercise, study) and sends midnight summary emails. It combines BullMQ queues, Redis, Telegram bots, Gmail SMTP, and PostgreSQL so users stay informed across channels.

## Features
- Express API with health/test routes and centralized env/bootstrap logic
- BullMQ scheduler running recurring jobs for hydration, exercise, and midnight reports
- Telegram bot for onboarding, task activation, and logging `/input` activity from chat
- Nodemailer Gmail transport for automated email summaries
- PostgreSQL persistence plus Redis-backed workers for reliable delivery

## Quick Start
1. `cd backend && npm install`
2. Create a `.env` file next to `server.js` with:
   - `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_PORT`, `POSTGRES_HOST`
   - `REDIS_HOST`, `REDIS_PORT`
   - `TELEGRAM_TOKEN`
   - `MAIL_USER`, `MAIL_PASS`
3. Apply the Better Auth migrations to PostgreSQL (for example: `psql "$POSTGRES_CONNECTION_STRING" -f backend/better-auth_migrations/2026-02-07T15-20-45.441Z.sql`). This creates the `user`, `session`, `account`, and `verification` tables the auth layer needs.
4. Ensure Redis and PostgreSQL are running.
5. `npm run dev` for auto-reload during development or `npm start` for production mode.

## Project Structure
- `config/` database and Redis connection helpers
- `queue/` BullMQ producers for Telegram and Gmail jobs
- `routes/` Express route definitions
- `services/` integrations (Telegram bot, Gmail SMTP, message templates)

## Visual Preview

![Hydration Flow](src/assets/images/water.png)

![Quote of the Day](src/assets/images/qotd.png)

![Midnight Report](src/assets/images/midnightreport.png)