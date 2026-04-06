const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const alterDb = async () => {
    try {
        await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS student_id VARCHAR(50) UNIQUE;');
        console.log("DB Altered successfully.");
    } catch(err) {
        console.error(err);
    } finally {
        await pool.end();
        process.exit(0);
    }
};

alterDb();
