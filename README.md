# FinTrack — Smart Expense Tracker

A production-grade, full-stack MERN expense & income tracker with intelligent, algorithm-driven financial insights, budget planning, savings goals, and a premium glassmorphism SaaS dashboard.

Built as a portfolio/resume-quality project. Modular architecture, clean separation of concerns, and real data-driven analytics — no placeholder screens.

---

## ✨ Features

- **Authentication** — Register/login (JWT + bcrypt), protected routes, persistent login (Redux Persist), forgot/reset password flow
- **Dashboard** — Animated "Balance Pulse" hero card, monthly income/expense/savings/expense-ratio stats, recent transactions, category breakdown, quick-add income/expense
- **Income & Expense modules** — Full CRUD, category tagging, search, category/date/amount filters, pagination, Excel (.xlsx) export
- **Unified Transactions view** — Combined income + expense feed with search/filter
- **Analytics** — Income vs expense trend, category pie chart, top spending categories, 12-month cash-flow comparison, adjustable date range
- **Budget Planner** — Per-category or overall monthly budgets with live progress bars and over-budget warnings
- **Savings Goals** — Create goals with a target/deadline, contribute funds, automatic completion detection
- **Smart Finance Insights** — Deterministic, algorithm-generated insights (no external AI calls): month-over-month category changes, highest-spending weekday, average daily spend, top category/merchant, savings trend, and a computed Financial Health Score
- **Profile** — Avatar upload (Cloudinary), edit details, change password, currency/theme/monthly-budget preferences

## 🧱 Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Redux Toolkit + Redux Persist, React Router, Axios, React Hook Form + Zod, Framer Motion, Recharts, React Hot Toast, Lucide Icons

**Backend:** Node.js, Express, MongoDB + Mongoose, JWT, bcryptjs, Multer + Cloudinary, Helmet, CORS, Morgan, express-validator, express-mongo-sanitize, express-rate-limit

> Note: the frontend is JavaScript (JSX), not TypeScript. This was a deliberate trade-off to deliver every listed feature as a fully working, connected page rather than partially-typed placeholders. The codebase is structured so it can be migrated to TypeScript incrementally (interfaces would mostly mirror the Mongoose schemas already defined in `server/src/models`).

## 📁 Project Structure

```
fintrack/
├── server/                 # Express API
│   └── src/
│       ├── config/         # DB + Cloudinary config
│       ├── controllers/    # Route handlers (auth, income, expense, dashboard, budget, goals, profile)
│       ├── middleware/     # JWT auth, error handler, validation, upload
│       ├── models/         # User, Income, Expense, Budget, SavingsGoal
│       ├── routes/         # Route definitions
│       ├── validators/     # express-validator rule sets
│       └── utils/          # JWT helper, insights engine, seed script
└── client/                 # React app
    └── src/
        ├── components/     # common/, dashboard/, charts/, forms/, ui/
        ├── hooks/          # useAuth, useCountUp
        ├── layouts/        # AuthLayout, DashboardLayout
        ├── pages/          # Dashboard, Income, Expense, Transactions, Analytics, Budget, Goals, Profile, auth/*
        ├── redux/          # store + slices (auth, ui)
        ├── routes/         # ProtectedRoute, PublicRoute
        ├── services/       # axios API calls per domain
        ├── utils/          # axios instance, formatters, api paths
        └── constants/      # category metadata
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- (Optional, for avatar uploads) A free [Cloudinary](https://cloudinary.com/) account

### 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
# edit .env with your MONGO_URI, JWT_SECRET, and (optionally) Cloudinary keys
npm run dev
```

The API runs on `http://localhost:8000` by default. Health check: `GET /api/v1/health`.

**Seed demo data** (creates a demo user with 3 months of income/expense history, budgets, and goals):

```bash
npm run seed
```

This logs the demo credentials (`demo@fintrack.app` / `Demo@1234`) to the console.

### 2. Frontend setup

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The app runs on `http://localhost:5173` and proxies `/api` requests to the backend automatically in dev mode.

### 3. Login

Use the seeded demo account, or register a new one from the sign-up page.

## 🔐 Security

- Passwords hashed with bcrypt (12 salt rounds)
- JWT-based auth with a protect middleware on every private route
- Helmet for secure HTTP headers, CORS restricted to the configured client origin
- express-mongo-sanitize against NoSQL injection
- express-rate-limit on all `/api` routes
- Centralized error handler that never leaks stack traces in production

## 📦 Deployment

- **Frontend:** deploy `client/` to Vercel (`npm run build`, output `dist/`)
- **Backend:** deploy `server/` to Render (or any Node host); set the same environment variables as `.env.example`
- **Database:** MongoDB Atlas — whitelist your deployment's IP or allow access from anywhere for simplicity

Remember to update `CLIENT_URL` (backend) and `VITE_API_BASE_URL` (frontend) to your deployed URLs.

## 🗺️ Known trade-offs / next steps

- Password-reset emails are logged to the server console instead of actually being sent (the architecture — token generation, hashing, expiry, reset route — is fully implemented; wiring in an email provider like SendGrid or SES is a drop-in addition in `authController.js`)
- In-app notifications (budget exceeded / goal achieved) currently surface as toast messages and dashboard insights rather than a persisted notification center
- Frontend is JavaScript, not TypeScript (see note above)
