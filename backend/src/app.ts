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
        origin: config.cors.allowedOrigins,
        credentials: true,
    })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
