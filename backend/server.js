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
  try {
    fs.appendFileSync(logFile, logMsg);
  } catch (err) {}
};

// 1. ABSOLUTE TOP HEALTH CHECK (No dependencies)
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        message: 'Minimal boot successful',
        timestamp: new Date().toISOString() 
    });
});

// 2. PROTECTED REQUIRES
let initDb;
try {
    const dbConfig = require('./config/db');
    initDb = dbConfig.initDb;
} catch (err) {
    console.error('FAILED TO LOAD DB CONFIG:', err.message);
}

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// 3. LAZY DB INITIALIZATION MIDDLEWARE
app.use(async (req, res, next) => {
    if (req.path === '/api/health' || req.path === '/') return next();
    
    if (!initDb) {
        return res.status(500).json({ error: 'Database module failed to load' });
    }

    try {
        await initDb();
        next();
    } catch (err) {
        console.error(`DATABASE INIT ERROR during ${req.path}:`, err.message);
        logger(`Database initialization error: ${err.message}`);
        res.status(500).json({ 
            error: 'Database Initialization Error', 
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// 4. PROTECTED ROUTE REGISTRATION
try {
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/resumes', require('./routes/resumeRoutes'));
    app.use('/api/ai', require('./routes/aiRoutes'));
} catch (err) {
    console.error('FAILED TO REGISTER ROUTES:', err.message);
}

app.get('/', (req, res) => {
  res.send('Smart Resume Builder API is running. Check /api/health');
});

const PORT = process.env.PORT || 8001;

const startServer = async () => {
    try {
        if (initDb) await initDb();
        app.listen(PORT, '0.0.0.0', () => {
            logger(`Server started on port ${PORT}`);
        });
    } catch (err) {
        logger(`STARTUP ERROR: ${err.message}`);
    }
};

if (require.main === module) {
    startServer();
}

module.exports = app;
