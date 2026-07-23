const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : '';

const allowedOrigins = [
  'http://localhost:5173',
  clientUrl,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS Blocked: Origin '${origin}' not in allowed list:`, allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/holidays', require('./routes/holiday'));
app.use('/api/predict', require('./routes/prediction'));

// Health check
app.get('/', (req, res) => res.json({ message: 'Attendance Calculator API running' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

// Connect DB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  });
