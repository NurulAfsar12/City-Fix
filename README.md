# CityFIX: A Smart Problem Reporting and Resolution System

CityFix is a web-based platform designed to help citizens report city-related problems and enable authorities to manage and resolve them efficiently.

The system allows users to submit complaints related to roads, electricity, water supply, garbage management, and other civic issues. Administrators can monitor complaints, assign workers, and track resolution progress.

## Features

### Authentication
- User Registration
- User Login
- Secure API Authentication using JWT (Bearer tokens)
- Persistent Login using Local Storage

### Citizen Features
- Submit complaints
- View submitted complaints
- Track complaint status

### Admin Features
- View all complaints
- Assign workers
- Update complaint status
- Delete reports

### Worker Features
- View assigned tasks
- Update work progress
- Mark complaints as resolved

## Technology Stack

| Layer     | Technology                                        |
|-----------|---------------------------------------------------|
| Frontend  | React 19 + Vite + Tailwind CSS 4                  |
| Backend   | Node.js + Express 5                               |
| Database  | NeonDB (serverless PostgreSQL)                    |
| Auth      | JWT (`jsonwebtoken`) + `bcryptjs` password hashing|
| Uploads   | Multer (report images)                            |

## Project Structure

```
CityFIX/
│
├── backend/                 # Node.js REST API
│   ├── server.js            # Entry point
│   ├── src/
│   │   ├── config/db.js     # NeonDB connection
│   │   ├── controllers/     # Request handlers (auth, reports, assignments...)
│   │   ├── middleware/      # JWT auth guard
│   │   ├── routes/          # API route definitions
│   │   ├── db/
│   │   │   ├── schema.sql   # NeonDB schema
│   │   │   ├── migrate.js   # Applies schema
│   │   │   └── seed.js      # Seeds categories + demo users
│   │   └── utils/
│   └── uploads/reports/     # Uploaded report images (served at /uploads)
│
├── frontend/                # React SPA
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx          # Page routing
│       ├── lib/api.js       # API base URL (from VITE_API_URL)
│       └── pages/           # Login, Register, dashboards
│
└── README.md
```

## Installation

### Prerequisites
- Node.js 20+
- A [Neon](https://neon.tech) project (free tier works)

### Backend

1. Create your Neon project and copy the connection string.

2. Configure environment:

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql://<user>:<password>@<endpoint>.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=any-long-random-string
CLIENT_URL=http://localhost:5173
```

3. Install, migrate, seed, run:

```bash
npm install
npm run setup    # runs migrate + seed
npm run dev      # API on http://localhost:5000
```

### Demo accounts (after seeding)

| Role    | Email                | Password   |
|---------|----------------------|------------|
| admin   | admin@cityfix.test   | admin123   |
| worker  | worker@cityfix.test  | worker123  |
| citizen | citizen@cityfix.test | citizen123 |

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # sets VITE_API_URL=http://localhost:5000/api
npm run dev            # app on http://localhost:5173
```

## API Overview

Base URL: `/api` — all protected routes require `Authorization: Bearer <token>`.

| Method | Path                              | Description                          |
|--------|-----------------------------------|--------------------------------------|
| POST   | /register                         | Register citizen                     |
| POST   | /login                            | Login (returns token)                |
| GET    | /user                             | Current user                         |
| POST   | /logout                           | Logout                               |
| GET    | /categories                       | Active categories                    |
| GET    | /workers                          | All workers                          |
| GET    | /dashboard                        | Role-based dashboard statistics      |
| GET    | /reports                          | List reports (scoped by role)        |
| POST   | /reports                          | Create report (multipart, optional image) |
| GET    | /reports/{id}                     | Report details                       |
| PUT    | /reports/{id}                     | Update report                        |
| PATCH  | /reports/{id}/status              | Admin: change report status          |
| DELETE | /reports/{id}                     | Admin: delete report                 |
| GET    | /assignments                      | List assignments (worker-scoped)     |
| POST   | /assignments                      | Admin: assign report to worker       |
| GET    | /assignments/{id}                 | Assignment details                   |
| PATCH  | /assignments/{id}/status          | Update assignment status             |
| GET    | /reports/{id}/updates             | Report updates feed                  |
| POST   | /reports/{id}/updates             | Add update (admin/assigned worker)   |
| GET    | /report-updates/{id}              | Single update                        |
| GET    | /notifications                    | Own notifications                    |
| GET    | /notifications/{id}               | Notification details                 |
| PATCH  | /notifications/{id}/read          | Mark as read                         |
| PATCH  | /notifications/read-all           | Mark all as read                     |
| DELETE | /notifications/{id}               | Delete notification                  |

## Authors

1. Nurul Afsar Hridoy
2. Rakib
3. S.M.Salahuddin

Department of Computer Science and Engineering, Northern University Bangladesh
