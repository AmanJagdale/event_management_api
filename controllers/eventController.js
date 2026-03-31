const db = require('../config/db');
const { sendConfirmationEmail } = require('../services/emailService');

// POST /events: Create a new event
exports.createEvent = async (req, res) => {
  const { title, description, type, date, capacity } = req.body;
  
  if (!title || !type || !date || !capacity) {
    return res.status(400).json({ error: 'Please provide all required fields (title, type, date, capacity).' });
  }

  try {
    const result = await db.query(
      'INSERT INTO events (title, description, type, date, capacity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, type, date, capacity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while creating event.' });
  }
};

// GET /events: Fetch all events with their current status
exports.getEvents = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM events ORDER BY date ASC');
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
        status
      };
    });

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching events.' });
  }
};

// POST /register-event
exports.registerEvent = async (req, res) => {
  const { event_id } = req.body;
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
