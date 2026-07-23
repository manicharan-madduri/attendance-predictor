# Attendance Calculator — MERN Stack

A full-stack attendance tracking web app with calendar, statistics, and future attendance prediction.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Recharts, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT

---

## Folder Structure
```
attendance-calculator/
├── client/               # React frontend (Vite)
│   └── src/
│       ├── charts/       # Recharts components
│       ├── components/   # Reusable UI components
│       ├── context/      # Auth & Theme context
│       ├── hooks/        # Custom hooks
│       ├── pages/        # Route pages
│       ├── services/     # Axios API calls
│       └── utils/        # Helper functions
└── server/               # Express backend
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    └── routes/
```

---

## Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

---

## Setup & Run

### 1. Install Server Dependencies
```bash
cd attendance-calculator/server
npm install
```

### 2. Configure Environment
Edit `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/attendance_calculator
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
```

### 3. Start the Server
```bash
npm run dev
```

### 4. Install Client Dependencies
```bash
cd attendance-calculator/client
npm install
```

### 5. Start the Client
```bash
npm run dev
```

### 6. Open in Browser
```
http://localhost:5173
```

---

## Features
- ✅ JWT Authentication (Register / Login)
- ✅ Attendance Calendar with 7 periods per day
- ✅ Holiday marking per day
- ✅ Per-period conducted/not-conducted toggle
- ✅ Real-time attendance calculation
- ✅ Pie chart & bar chart dashboard
- ✅ Statistics page with monthly breakdown
- ✅ Future Attendance Predictor (Options A, B, C, D)
- ✅ Dark mode toggle
- ✅ Responsive design (mobile + desktop)
- ✅ Auto-save with optimistic UI updates
- ✅ Toast notifications

---

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |

### Attendance
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/attendance?month=YYYY-MM | Get attendance by month |
| POST | /api/attendance | Upsert attendance record |
| DELETE | /api/attendance/:date | Delete a day's record |
| GET | /api/attendance/stats | Get full statistics |

### Holidays
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/holidays | Mark date as holiday |
| DELETE | /api/holidays/:date | Remove holiday |

### Prediction
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/predict | Calculate future attendance |
| POST | /api/predict/simulate | Simulate present/absent |
