const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let db;

async function initDb() {
  if (db) return db;

  db = await open({
    filename: path.join(__dirname, '../database.sqlite'),
    driver: sqlite3.Database
  });

  // Create Users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Resumes table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS resumes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      personalInfo TEXT, -- JSON string
      education TEXT, -- JSON string
      experience TEXT, -- JSON string
      skills TEXT, -- JSON string
      projects TEXT, -- JSON string
      template TEXT DEFAULT 'modern',
      atsScore INTEGER DEFAULT 0,
      aiSuggestions TEXT, -- JSON string
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  console.log('SQLite Database Connected and Initialized');
  return db;
}

const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return db;
};

module.exports = { initDb, getDb };
