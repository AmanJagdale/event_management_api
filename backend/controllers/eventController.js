const db = require('../config/db');
const { sendConfirmationEmail } = require('../services/emailService');

// POST /events: Create a new event
exports.createEvent = async (req, res) => {
  const { title, description, type, category, date, location, event_time, mentor_name, capacity } = req.body;

  if (!title || !type || !date || !capacity) {
    return res.status(400).json({ error: 'Please provide all required fields (title, type, date, capacity).' });
  }

  try {
    const result = await db.query(
      'INSERT INTO events (title, description, type, category, date, location, event_time, mentor_name, capacity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [title, description || null, type, category || null, date, location || null, event_time || null, mentor_name || null, capacity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while creating event. ' + err.message });
  }
};

exports.getEvents = async (req, res) => {
  const { category } = req.query;

  try {
    let queryStr = `
      SELECT e.*, COUNT(r.id) AS current_registrations
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
    `;
    const params = [];

    if (category) {
      queryStr += ` WHERE e.category = $1`;
      params.push(category);
    }

    queryStr += ` GROUP BY e.id ORDER BY e.date ASC`;

    const result = await db.query(queryStr, params);

    const events = result.rows.map(event => {
      const eventDate = new Date(event.date);
      const now = new Date();

      let status = 'Upcoming';
      if (eventDate < now) {
        status = 'Finished';
      } else if (eventDate.toDateString() === now.toDateString()) {
        status = 'Now';
      }

      return {
        ...event,
        current_registrations: parseInt(event.current_registrations, 10) || 0,
        status
      };
    });

    res.json(events);
  } catch (err) {
    console.error("GET EVENTS ERROR:", err.message);
    res.status(500).json({ error: 'Server error while fetching events.' });
  }
};

exports.getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
      SELECT e.*, COUNT(r.id) AS current_registrations
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.id = $1
      GROUP BY e.id
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    
    const event = result.rows[0];
    event.current_registrations = parseInt(event.current_registrations, 10) || 0;
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching event.' });
  }
};

exports.getEventRegistrations = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
      SELECT u.email, r.registered_at
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      WHERE r.event_id = $1
      ORDER BY r.registered_at DESC
    `, [id]);
    
    res.json({
      count: result.rows.length,
      participants: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching participants.' });
  }
};

exports.checkRegistrationState = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  try {
    const result = await db.query('SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2', [user_id, id]);
    res.json({ isRegistered: result.rows.length > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while checking registration.' });
  }
};

// POST /events/:id/register
exports.registerEvent = async (req, res) => {
  const { id: event_id } = req.params;
  const user_id = req.user.id;

  try {
    // 1. Fetch event and check capacity
    const eventResult = await db.query('SELECT * FROM events WHERE id = $1', [event_id]);
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    const event = eventResult.rows[0];

    // 2. Check current registrations for the event
    const countResult = await db.query('SELECT COUNT(*) FROM registrations WHERE event_id = $1', [event_id]);
    const currentCount = parseInt(countResult.rows[0].count, 10);

    if (currentCount >= event.capacity) {
      return res.status(400).json({ error: 'Event has reached maximum capacity.' });
    }

    // 3. User cannot register for same event twice
    const regCheck = await db.query('SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2', [user_id, event_id]);
    if (regCheck.rows.length > 0) {
      return res.status(400).json({ error: 'You are already registered for this event.' });
    }

    // 4. Save Registration
    await db.query('INSERT INTO registrations (user_id, event_id) VALUES ($1, $2)', [user_id, event_id]);

    // 5. Create Notification message in DB
    const successMsg = `Successfully registered for ${event.title}`;
    await db.query('INSERT INTO notifications (user_id, message, status) VALUES ($1, $2, $3)', [user_id, successMsg, 'Success']);

    // 6. Send Confirmation Email (dummy)
    const userResult = await db.query('SELECT email FROM users WHERE id = $1', [user_id]);
    if (userResult.rows.length > 0) {
      await sendConfirmationEmail(userResult.rows[0].email, event.title);
    }

    res.status(201).json({ message: 'Registration successful', event: event.title });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
};
