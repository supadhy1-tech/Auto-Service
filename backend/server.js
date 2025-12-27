import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import bookingsRouter from './routes/bookings.js';
import authRouter from './routes/auth.js';


const app = express();
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*'}));
app.use(express.json());
app.use('/api/auth', authRouter);

// Rate limit for API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req,res)=> res.json({ ok: true, uptime: process.uptime() }));

// Routes
app.use('/api/bookings', bookingsRouter);

// DB & Server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Missing MONGO_URI in .env');
  process.exit(1);
}

try {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
} catch (err) {
  console.error('Mongo connection error:', err);
  process.exit(1);
}
