<div align="center">

# 🔔 Notification Platform

**Your Habits, On Autopilot**

A multi-channel notification system that helps you stay consistent with custom reminders, habit tracking, and automated daily summaries — all through Telegram and Email.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-5+-red.svg)](https://redis.io/)

[Watch Demo](https://x.com/RaviBhusal99965/status/2030197443560886359) • [Report Bug](https://github.com/Bhusal-Ravi/Notification/issues) • [Request Feature](https://github.com/Bhusal-Ravi/Notification/issues)

</div>

---

## 📹 Video System Demo

Watch a complete walkthrough of the platform:

**[🎥 View Demo on X/Twitter](https://x.com/RaviBhusal99965/status/2030197443560886359)**

---

## 🌟 Features

### 🎯 **Custom Notifications**
Create unlimited personalized reminders with three flexible notification types:

| Type | Pattern | Use Case |
|------|---------|----------|
| **Interval-Based** | Every X minutes/hours | "Review notes every 2 hours" |
| **Daily Fixed Time** | Specific time each day | "Team standup at 9:30 AM" |
| **One-Time Scheduled** | Specific date & time | "Doctor appointment on March 15 at 2:00 PM" |

All custom notifications support:
- ⏰ Timezone-aware delivery
- 📱 Telegram instant messaging
- ✅ One-click completion tracking
- 📊 Real-time dashboard updates

### 🔥 **Built-In Habit Tracking**
- **💧 Hydration Reminders** — Stay hydrated with interval-based water reminders
- **💪 Exercise Alerts** — Daily workout notifications at your preferred time
- **📚 Study Sessions** — Track learning consistency with study reminders
- **💬 Quote of the Day** — Morning motivation delivered at 6 AM
- **📧 Midnight Email Digest** — Daily summary with streaks, completion stats, and activity recap

### 📊 **Interactive Dashboard**
- **Subscription Management** — View and manage all active notifications
- **Streak Tracking** — Monitor current and longest streaks for each habit
- **Activity Analytics** — Visualize completion rates with interactive charts
- **Real-Time Updates** — Instant UI refresh via WebSocket when you complete tasks
- **Custom Cadence Controls** — Update intervals, timezones, and notification times on the fly

### ✨ **Smart Confirmation System**
No more typing commands! When you receive a Telegram reminder, simply tap:
- **✅ Completed** — Logs activity, updates streaks, and refreshes dashboard instantly
- **❌ Missed** — Records skip without penalizing your streak

### 🤖 **Telegram Bot Integration**
- `/link` — Connect your Telegram account via secure OTP
- `/water`, `/exercise`, `/study` — Enable/disable habit reminders
- `/status` — Check your active subscriptions
- Inline button confirmations for instant activity logging

---

## 🛠️ Technology Stack

<div align="center">

<img width="80" height="80" alt="BullMQ" src="https://github.com/user-attachments/assets/2240f8b0-a0a0-4454-960d-a3bc7f9d5274" />
<img width="80" height="80" alt="Redis" src="https://github.com/user-attachments/assets/b7a03c85-c846-4ffe-ab9d-43627c54f6cd" />
<img width="80" height="80" alt="PostgreSQL" src="https://github.com/user-attachments/assets/879a3b2c-efbb-4c95-b546-4190da0bbc81" />
<img width="80" height="80" alt="Telegram Bot API" src="https://github.com/user-attachments/assets/a0e11ef7-cfcd-4c9c-83e3-cb8d3c9ce79c" />
<img width="80" height="80" alt="Resend" src="https://github.com/user-attachments/assets/f9df0ec1-b4f2-403b-b0b4-7a78a01f6ab1" />
<img width="80" height="80" alt="Node.js" src="https://github.com/user-attachments/assets/8cb85ad4-9a5f-4210-89f9-e49d41527bd5" />
<img width="80" height="80" alt="React.js" src="https://github.com/user-attachments/assets/aa3a7f84-e907-43c1-b44d-9239c0581049" />
<img width="80" height="80" alt="Socket.io" src="https://github.com/user-attachments/assets/f999ee04-c101-44e2-8bcc-41f478b87efb" />

</div>

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express 5
- **Job Scheduler:** BullMQ 5 + Redis 5
- **Database:** PostgreSQL 15
- **Authentication:** better-auth (Google OAuth)
- **Messaging:** node-telegram-bot-api
- **Email Service:** Resend
- **Real-time:** Socket.io

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Forms:** react-hook-form
- **Timezone Selection:** react-timezone-select
- **Icons:** lucide-react

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      NOTIFICATION PLATFORM                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   React UI   │◄─────►│  Express API │◄─────►│ PostgreSQL   │
│  (Dashboard) │       │  + Socket.io │       │  (Sessions,  │
│   Vite Dev   │       │              │       │   Tasks,     │
└──────────────┘       └──────────────┘       │   Activity)  │
										│                └──────────────┘
										│
										▼
							  ┌──────────────┐
							  │  BullMQ      │
							  │  Scheduler   │
							  │  (Redis)     │
							  └──────────────┘
										│
					  ┌────────────┼────────────┐
					  │                         │
					  ▼                         ▼
			 ┌─────────────┐           ┌─────────────┐
			 │  Telegram   │           │   Email     │
			 │  Bot Worker │           │   Worker    │
			 │  (Messages) │           │  (Resend)   │
			 └─────────────┘           └─────────────┘
					  │                         │
					  ▼                         ▼
			 ┌─────────────┐           ┌─────────────┐
			 │  Telegram   │           │   Gmail     │
			 │   Users     │           │   Inbox     │
			 └─────────────┘           └─────────────┘
```

### How It Works

1. **Scheduler** — BullMQ checks every minute for eligible notifications based on:
	- User's `notify_after` interval (e.g., "1 hour")
	- User's `fixed_notify_time` (e.g., "15:45")
	- User's timezone and active status

2. **Workers** — Process jobs in parallel:
	- **Telegram Worker** — Sends reminders with inline buttons
	- **Email Worker** — Compiles midnight digest HTML emails

3. **Confirmation Flow** — User taps "Completed ✅":
	- Inserts `taskactivity` record with `event_type='completed'`
	- Updates streak logic (same day = maintain, previous day = increment, other = reset)
	- Emits Socket.io event to dashboard for instant UI update

4. **Dashboard** — Real-time React app displays:
	- Active subscription cards
	- Current & longest streaks
	- Today's activity count
	- Update controls for cadence/timezone

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- **Node.js 20+** installed ([Download](https://nodejs.org/))
- **PostgreSQL 15+** database ([Download](https://www.postgresql.org/download/))
- **Redis 6+** server ([Download](https://redis.io/download/))
- **Telegram Bot Token** from [@BotFather](https://t.me/botfather)
- **Resend API Key** from [resend.com](https://resend.com/)
- **Google OAuth Credentials** from [Google Cloud Console](https://console.cloud.google.com/)
- **FavQs API Key** from [favqs.com/api](https://favqs.com/api)

---

### 📦 Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Bhusal-Ravi/Notification.git
cd Notification
```

#### 2️⃣ Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

#### 3️⃣ Configure Environment Variables

Create `backend/.env` file with the following:

```env
# Database Configuration
POSTGRES_CONNECTION_STRING=postgresql://user:password@localhost:5432/notification_db
POSTGRES_HOST=localhost

# Redis Configuration
REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_password
REDIS_HOST=localhost
REDIS_PORT=6379

# Telegram Bot
TELEGRAM_TOKEN=your_telegram_bot_token_from_botfather

# Email Service (Legacy - Optional)
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

# Resend Email Service (Primary)
RESEND_API_KEY=re_your_resend_api_key

# Quote API
API_KEY_QUOTES=your_favqs_api_key

# Authentication (better-auth)
BETTER_AUTH_SECRET=generate_a_random_256_bit_secret
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Environment
DEVELOPMENT=true
```

**Generate `BETTER_AUTH_SECRET`:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 4️⃣ Set Up Database

Run the database migration:

```bash
psql "$POSTGRES_CONNECTION_STRING" -f backend/better-auth_migrations/2026-02-17T08-33-15.820Z.sql
```

Or manually create tables by running the migration SQL file.

#### 5️⃣ Start the Application

**Terminal 1 — Backend Server:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend Dev Server:**
```bash
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

---

## 📖 User Guide

### Getting Started as a User

#### Step 1: Sign In
1. Visit the application homepage
2. Click **"Get Started"** or **"Sign In with Google"**
3. Authorize with your Google account
4. You'll be redirected to your dashboard

#### Step 2: Link Your Telegram Account
1. Open [@YourBotName](https://t.me/your_bot_username) on Telegram
2. Send `/link` command
3. Bot will generate an OTP with command format
4. Copy and send the command (e.g., `/link 652847 yourmail@example.com`)
5. Confirmation message appears when linked successfully

#### Step 3: Enable Built-In Habits
From the Telegram bot:
- `/water` — Enable hydration reminders (default: every 1 hour)
- `/exercise` — Enable daily workout reminder (default: 3:45 PM)
- `/study` — Enable study session tracking

Check your status anytime with `/status`

#### Step 4: Create Custom Notifications
1. Go to your dashboard
2. Click **"+ Create Custom Notification"**
3. Choose notification type:
	- **Interval-Based:** Set reminder frequency (e.g., "30 minutes", "3 hours")
	- **Daily Fixed Time:** Set daily time (e.g., "09:30")
	- **One-Time:** Set specific date and time
4. Enter notification title (e.g., "Take medication")
5. Select your timezone
6. Click **"Create Notification"**

#### Step 5: Confirm Activities
When you receive a Telegram reminder:
1. You'll see a message with two buttons:
	- **✅ Completed?** — Mark as done
	- **❌ Missed?** — Mark as skipped
2. Tap **"Completed ✅?"**
3. Your dashboard updates instantly
4. Streaks are automatically calculated

#### Step 6: Manage Notifications
From your dashboard:
- **View Subscriptions** — See all active notifications with current intervals
- **Update Settings** — Click "Update" on any card to:
  - Change notification interval or time
  - Switch timezone
  - Enable/disable notification
- **Track Streaks** — Scroll to "Daily Streaks" section to see:
  - Current streak count
  - Longest streak achieved
  - Last completion timestamp

#### Step 7: Receive Daily Summary
Every midnight (in your timezone):
- You'll receive an email digest with:
  - Yesterday's completion counts for each task
  - Current and longest streaks
  - Tasks sent vs. completed statistics
- **No action needed** — automatically generated!

---

## 🤖 Telegram Bot Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/start` | Welcome message and bot introduction | `/start` |
| `/help` | Display all available commands | `/help` |
| `/link OTP EMAIL` | Link Telegram account to your dashboard | `/link 652847 user@example.com` |
| `/water` | Enable/disable water reminders | `/water` |
| `/exercise` | Enable/disable exercise reminders | `/exercise` |
| `/study` | Enable/disable study reminders | `/study` |
| `/status` | Check your active notification subscriptions | `/status` |

**Inline Buttons:**
- **✅ Completed?** — Mark task as completed (logs activity, updates streaks)
- **❌ Missed?** — Mark task as missed (records skip without penalty)

---

## 🛣️ API Endpoints

### Authentication
```
GET  /api/auth/*                    # better-auth handlers (Google OAuth)
```

### User & Tasks
```
GET  /api/healthcheck               # Server health status
GET  /api/userinfo/:userid          # User's active notifications + details
GET  /api/userstreak/:userid        # User's current streaks for all tasks
GET  /api/gettaskactivity/:userid   # User's activity history
POST /api/setuserinfo               # Create/update user profile
```

### Notification Management
```
GET  /api/updateget/:userid         # Get task settings for Update Center
PUT  /api/updateput/:userid         # Update task interval/timezone/status
PUT  /api/customnotification        # Create custom notification (type 1/2/3)
```

### Dashboard & Settings
```
GET  /api/dashboard/:userid         # Dashboard analytics data
GET  /api/settings/:userid          # User settings (online/offline hours)
PUT  /api/updatesettings/:userid    # Update user settings
```

### Telegram Integration
```
POST /api/checkuserexist            # Verify user before Telegram linking
GET  /api/telegramstatuscheck/:userid # Check Telegram connection status
POST /api/telegramverify            # Complete OTP-based Telegram linking
```

---

## 📊 Database Schema

### Core Tables

#### `user` (better-auth managed)
- Authentication records
- Google OAuth account data
- Session tokens

#### `userinfo`
- User profiles (userid, fname, lname, email)
- Online/offline hours (active notification window)

#### `task`
- Task definitions (taskid, taskname, tasktype, notification_type)
- Priority levels (`system` vs `usercreated`)

#### `taskuser`
- User-task subscriptions (userid + taskid)
- Configuration: `isactive`, `timezone`, `notify_after`, `fixed_notify_time`
- Throttle tracking: `lastcheck`, `last_user_activity`

#### `taskactivity`
- Activity log (taskuser_id, event_type, performed_at)
- Event types: `sent`, `completed`, `missed`
- Button deduplication: `telegram_button_id`

#### `task_streak`
- Streak tracking (taskuser_id, current_streak, longest_streak)
- Last completion date tracking

#### `telegramusers`
- Telegram account linkage (telegram_user_id, chat_id, userid)

#### `telegramotp`
- One-time password management for Telegram linking
- Expires after 5 minutes or first use

---

## 🎨 Dashboard Features

### Subscription Cards
- **Task Name** — Display notification title
- **Timezone** — Show user's configured timezone
- **Cadence** — Display interval (e.g., "Every 1 hour") or fixed time ("Daily at 15:45")
- **Status Badge** — Active/Inactive indicator
- **Refresh Button** — Manual notification trigger (respects throttle)
- **Update Button** — Opens settings modal

### Streak Tracker
- **Current Streak** — Days of consecutive completion
- **Longest Streak** — All-time best streak
- **Last Completed** — Timestamp of most recent completion
- **Status Indicator** — Active/Broken streak visualization

### Analytics Charts
- **Task-Wise Completion** — Bar chart showing completion rates per task
- **Total Sent vs Completed** — Line chart comparing reminders sent vs confirmed
- **Total Tasks** — Pie chart of active vs inactive subscriptions

### Update Center
- **Task Selection** — Dropdown to choose which notification to edit
- **Interval Editor** — Text input with validation (e.g., "5 minutes", "2 hours")
- **Fixed Time Picker** — Time input for daily reminders
- **Timezone Selector** — Searchable timezone dropdown
- **Toggle Switch** — Enable/disable notification
- **Animated Status Cards** — Success/error feedback with Framer Motion

---

## 🔐 Security Features

- **Rate Limiting** — 100 requests per 15 minutes per IP
- **Session-Based Auth** — Secure HTTP-only cookies
- **OTP Verification** — SHA256 hashed one-time passwords for Telegram linking
- **SQL Injection Protection** — Parameterized queries throughout
- **Transaction Management** — ACID compliance for critical operations
- **CORS Configuration** — Whitelisted trusted origins only
- **Environment Isolation** — Separate dev/prod configurations

---

## 🚀 Deployment

### Production Environment Variables

Update `backend/.env` for production:

```env
BETTER_AUTH_URL=https://your-domain.com
DEVELOPMENT=false

# Update Redis/PostgreSQL to production hosts
POSTGRES_CONNECTION_STRING=postgresql://user:pass@prod-db-host:5432/db
REDIS_HOST=prod-redis-host
REDIS_PORT=6379
```

### Build for Production

```bash
# Build frontend
npm run build

# The dist/ folder contains optimized static files
# Deploy to Vercel, Netlify, or serve via Express
```

### Backend Deployment
- Deploy to **Railway**, **Render**, **Fly.io**, or **AWS EC2**
- Ensure Redis and PostgreSQL instances are accessible
- Set environment variables in deployment platform
- Run migrations before first deployment

### Recommended Setup
- **Frontend:** Vercel (automatic deployment from GitHub)
- **Backend:** Railway (includes Redis + PostgreSQL add-ons)
- **Database:** Railway PostgreSQL or managed PostgreSQL (AWS RDS, DigitalOcean)
- **Redis:** Railway Redis or managed Redis (Upstash, Redis Cloud)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the Repository**
	```bash
	git clone https://github.com/YOUR_USERNAME/Notification.git
	```

2. **Create a Feature Branch**
	```bash
	git checkout -b feature/amazing-feature
	```

3. **Commit Your Changes**
	```bash
	git commit -m 'Add some amazing feature'
	```

4. **Push to the Branch**
	```bash
	git push origin feature/amazing-feature
	```

5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test thoroughly before submitting PR
- Update documentation if needed

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🐛 Known Issues & Roadmap

### Known Issues
- Email delivery may be delayed during high traffic
- Timezone conversion edge cases around DST transitions

### Roadmap
- [ ] SMS notifications via Twilio
- [ ] WhatsApp Business API integration
- [ ] Mobile app (React Native)
- [ ] Team/group notifications
- [ ] Advanced analytics dashboard
- [ ] Webhook integrations for third-party apps
- [ ] Voice notifications via Twilio
- [ ] Multi-language support

---

## 💬 Support

- **Issues:** [GitHub Issues](https://github.com/Bhusal-Ravi/Notification/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Bhusal-Ravi/Notification/discussions)
- **Email:** contact@portlify.me

---

## 🙏 Acknowledgments

- [BullMQ](https://github.com/taskforcesh/bullmq) — Robust Redis-based job queue
- [better-auth](https://github.com/better-auth/better-auth) — Modern authentication library
- [Resend](https://resend.com/) — Developer-first email API
- [FavQs](https://favqs.com/) — Quote of the day API
- [Telegram Bot API](https://core.telegram.org/bots/api) — Instant messaging platform

---

<div align="center">

**Built with ❤️ by [Ravi Bhusal](https://github.com/Bhusal-Ravi)**

⭐ **Star this repo if you find it helpful!** ⭐

[🎥 Watch Demo](https://x.com/RaviBhusal99965/status/2030197443560886359) • [🐛 Report Bug](https://github.com/Bhusal-Ravi/Notification/issues) • [✨ Request Feature](https://github.com/Bhusal-Ravi/Notification/issues)

</div>

Install + run:
1. `npm install`
2. `npm run dev`
3. Visit `http://localhost:5173` (auth flows will bounce through the backend’s `/api/auth/*`).

## Development Notes
- Queues (`schedular`, `telegram`, `gmail`, `qotd`) require Redis connectivity; ensure the Redis URI matches your `.env` before relying on scheduled jobs.

- `src/components/index.css` registers custom Mabry Pro fonts; keep assets under `src/assets/fonts` in sync if you tweak typography.
New fonts can be added.

## Visual Preview

![Hydration Flow](src/assets/images/water.png)

![Quote of the Day](src/assets/images/qotd.png)

![Midnight Report](src/assets/images/midnightreport.png)
