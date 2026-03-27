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
  
  // Try to write to file, but ignore failures (common on serverless/read-only environments)
  try {
    fs.appendFileSync(logFile, logMsg);
  } catch (err) {
    // Ignore logging errors in serverless environments
  }
};

process.on('uncaughtException', (err) => {
  logger(`CRITICAL: UNCAUGHT EXCEPTION! 💥 ${err.name} ${err.message} ${err.stack}`);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger(`CRITICAL: UNHANDLED REJECTION! 💥 ${err.name} ${err.message} ${err.stack}`);
  process.exit(1);
});

const { initDb } = require('./config/db');

// Health Check Endpoint (Standalone - no DB dependency)
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        message: 'Backend is reachable', 
        environment: process.env.VERCEL ? 'vercel' : 'local',
        timestamp: new Date().toISOString() 
    });
});

// Middleware to ensure DB is initialized (skipped for health check)
app.use(async (req, res, next) => {
    if (req.path === '/api/health' || req.path === '/') {
        return next();
    }
    
    try {
        await initDb();
        next();
    } catch (err) {
        console.error(`DATABASE INIT ERROR during ${req.path}:`, err.message);
        logger(`Database initialization error: ${err.message}`);
        res.status(500).send('Database Initialization Error');
    }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes with extra protection
try {
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/resumes', require('./routes/resumeRoutes'));
    app.use('/api/ai', require('./routes/aiRoutes'));
} catch (err) {
    console.error('CRITICAL: Route Registration Failed:', err);
}

app.get('/', (req, res) => {
  res.send('Smart Resume Builder API is running. Check /api/health for status.');
});

// Port configuration
const PORT = process.env.PORT || 8001;

// Startup Function
const startServer = async () => {
    try {
        logger('Starting server initialization...');
        
        // Connect to SQLite (handled by middleware but calling here for local start)
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

if (require.main === module) {
    startServer();
}

module.exports = app;
