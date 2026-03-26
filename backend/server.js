const fs = require('fs');
const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const logFile = path.join(__dirname, 'server.log');

// Persistent Logger utility
const logger = (msg) => {
  const timestamp = new Date().toISOString();
  const logMsg = `[${timestamp}] ${msg}\n`;
  console.log(msg);
  fs.appendFileSync(logFile, logMsg);
};

process.on('uncaughtException', (err) => {
  logger(`CRITICAL: UNCAUGHT EXCEPTION! 💥 ${err.name} ${err.message} ${err.stack}`);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger(`CRITICAL: UNHANDLED REJECTION! 💥 ${err.name} ${err.message} ${err.stack}`);
  process.exit(1);
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

app.get('/', (req, res) => {
  res.send('Smart Resume Builder API is running');
});

// Port configuration
const PORT = process.env.PORT || 8001;

// Startup Function
const startServer = async () => {
    try {
        logger('Starting server initialization...');
        
        // Connect to SQLite
        const { initDb } = require('./config/db');
        await initDb();
        logger('SQLite Connected and Initialized');

        const server = app.listen(PORT, '0.0.0.0', () => {
            logger(`Server successfully started on port ${PORT}`);
            
            // Heartbeat to monitor system health
            setInterval(() => {
                logger('Heartbeat: System active and DB connected');
            }, 60000); // 1 minute heartbeat
        });

        server.on('error', (err) => {
            logger(`SERVER ERROR: ${err.message}`);
        });

    } catch (err) {
        logger(`FAILED TO START SERVER: ${err.message} ${err.stack}`);
        process.exit(1);
    }
};

startServer();
