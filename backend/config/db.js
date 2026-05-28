const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

let pool;

async function initDb() {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('CRITICAL: DATABASE_URL is missing.');
    return null;
  }

  // Create a new pg connection pool
  pool = new Pool({
    connectionString,
    // Add SSL support since cloud providers (Render, Neon, Supabase) require it.
    ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1') ? false : {
      rejectUnauthorized: false
    }
  });

  // Verify connection and check/initialize tables
  try {
    const client = await pool.connect();
    console.log('PostgreSQL Database Connected Successfully');
    
    // Auto-run schema.sql to ensure tables exist
    try {
      const schemaPath = path.join(__dirname, '..', 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSql);
        console.log('Database tables verified/initialized successfully.');
      }
    } catch (schemaErr) {
      console.warn('Warning: Could not auto-initialize tables from schema.sql:', schemaErr.message);
    }

    client.release();
  } catch (err) {
    console.error('PostgreSQL connection failed:', err.message);
    pool = null;
    throw err;
  }

  return pool;
}

const getDb = () => {
  if (!pool) {
    throw new Error('Database pool not initialized. Check your environment variables.');
  }
  return pool;
};

module.exports = { initDb, getDb };
