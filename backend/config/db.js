const { Pool } = require('pg');
require('dotenv').config();

// This tells the backend to use the long URL from your .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase/Neon
  }
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle pg client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};