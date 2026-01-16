import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/config.js';
import { connectDB } from './config/database.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import reconciliationRoutes from './routes/reconciliation.routes.js';

const app = express();

// Connect to database (Serverless safe: Mongoose handles pooling)
connectDB();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(
    cors({
        // Allow ALL origins for now to fix the blocking issue
        origin: true,
        credentials: true,
    })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Smart Reconciliator API is running 🚀',
        version: '1.0.0'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reconciliations', reconciliationRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
