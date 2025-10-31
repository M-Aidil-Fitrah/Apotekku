import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import 'express-async-errors';

import { connectDB } from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';

// Auth Routes
import authRoutes from './routes/authRoutes'; // Admin/Staff auth

// Marketplace Routes
import customerRoutes from './routes/customerRoutes'; // Customer auth & profile
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import orderRoutes from './routes/orderRoutes';
import reviewRoutes from './routes/reviewRoutes';
import prescriptionRoutes from './routes/prescriptionRoutes'; // Prescription management

// Load env variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev')); // Logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    message: 'Apotekku Marketplace API is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
  });
});

// API Routes
// Auth for Admin/Staff
app.use('/api/auth', authRoutes);

// Marketplace (Public/Customer)
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Apotekku Marketplace API running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}`);
  console.log(`🏥 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`💊 Mode: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
