import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.routes.js';
import listingRoutes from './routes/listing.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();
connectDB();

const app = express();

// this line right here is to fix the Render rate-limit crash!
app.set('trust proxy', 1);

// --- SECURITY MIDDLEWARES ---
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', apiLimiter);
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});
// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);

// Handle 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// --- ERROR HANDLER (MUST BE LAST) ---
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));