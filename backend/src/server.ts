import { config } from './config/config.js';
import app from './app.js';

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`🚀 Server running in ${config.nodeEnv} mode on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
