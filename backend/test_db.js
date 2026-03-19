const fs = require('fs');
const path = require('path');
const { initDb, getDb } = require('./config/db');

async function test() {
  const results = {
    started: true,
    steps: [],
    error: null,
    users: null
  };

  try {
    results.steps.push('Initializing DB');
    const db = await initDb();
    results.steps.push('DB initialized');
    
    const users = await db.all('SELECT id, email FROM users');
    results.steps.push('Users fetched');
    results.users = users;
    
  } catch (err) {
    results.error = err.message || err.toString();
  } finally {
    fs.writeFileSync(path.join(__dirname, 'test_db_results.json'), JSON.stringify(results, null, 2), 'utf8');
    process.exit(results.error ? 1 : 0);
  }
}

test();
