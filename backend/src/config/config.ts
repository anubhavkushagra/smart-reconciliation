import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-reconciliator',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key-change-this',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
    },
};
