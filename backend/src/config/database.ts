import mongoose from 'mongoose';
import { config } from './config.js';

export const connectDB = async (): Promise<void> => {
    if (!config.mongodb.uri) {
        console.error('❌ MongoDB URI is missing in environment variables!');
        return; // Don't crash, just don't connect
    }

    try {
        const conn = await mongoose.connect(config.mongodb.uri);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Log but potentially allow server to start (for debugging Vercel 500s)
        console.error('❌ MongoDB connection error:', error);
        // Do NOT exit process in serverless environment
        // process.exit(1); 
        // throw error; 
    }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err);
});
