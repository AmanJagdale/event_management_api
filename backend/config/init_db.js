const { Pool } = require('pg');
require('dotenv').config();

// Direct connection with SSL fix
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const createTables = async () => {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'member',
      bio TEXT,
      profile_pic TEXT,
      phone VARCHAR(20),
      student_id VARCHAR(50) UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const eventsTable = `
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      type VARCHAR(50) NOT NULL CHECK (type IN ('workshop', 'seminar')),
      category VARCHAR(100),
      images TEXT[],
      date TIMESTAMP NOT NULL,
      capacity INT NOT NULL,
      mentor_bio TEXT,
      registration_deadline TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const registrationsTable = `
    CREATE TABLE IF NOT EXISTS registrations (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE SET NULL,
      event_id INT REFERENCES events(id) ON DELETE CASCADE,
      registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (user_id, event_id)
    );
  `;

  const notificationsTable = `
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      message TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'Success',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const quotesTable = `
    CREATE TABLE IF NOT EXISTS quotes (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      author VARCHAR(255),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const adminLogsTable = `
    CREATE TABLE IF NOT EXISTS admin_logs (
      id SERIAL PRIMARY KEY,
      admin_id INT REFERENCES users(id) ON DELETE SET NULL,
      action VARCHAR(255) NOT NULL,
      users_removed INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    console.log('Connecting to Supabase and creating tables...');

    await pool.query(usersTable);
    console.log('✅ Users table verified.');

    await pool.query(eventsTable);
    console.log('✅ Events table verified.');

    await pool.query(registrationsTable);
    console.log('✅ Registrations table verified.');

    await pool.query(notificationsTable);
    console.log('✅ Notifications table verified.');

    await pool.query(quotesTable);
    console.log('✅ Quotes table verified.');

    await pool.query(adminLogsTable);
    console.log('✅ Admin Logs table verified.');

    console.log('🚀 All tables verified/created successfully!');
  } catch (err) {
    console.error('❌ Error creating tables:', err.message);
  } finally {
    await pool.end(); // Close the connection properly
    process.exit(0);
  }
};

createTables();