const { createClient } = require('@supabase/supabase-js');

let supabase;

async function initDb() {
  if (supabase) return supabase;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('CRITICAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing.');
    return null;
  }

  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Supabase Client Initialized');
  return supabase;
}

const getDb = () => {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check your environment variables.');
  }
  return supabase;
};

module.exports = { initDb, getDb };
