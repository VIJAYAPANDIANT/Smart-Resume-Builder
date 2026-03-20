require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Connect to SQLite
const { initDb } = require('./config/db');

initDb()
  .then(() => console.log('SQLite Connected'))
  .catch(err => console.log('SQLite connection error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

app.get('/', (req, res) => {
  res.send('Smart Resume Builder API is running');
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    // Heartbeat to keep process active and verify life in logs
    setInterval(() => {
        console.log(`Heartbeat at ${new Date().toISOString()} - SQLite DB active`);
    }, 10000);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
