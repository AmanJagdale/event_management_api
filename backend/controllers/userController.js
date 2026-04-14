const db = require('../config/db');
const csvParser = require('csv-parser');
const stream = require('stream');
const bcrypt = require('bcryptjs');

// Member-only: Get own profile
exports.getProfile = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching profile' });
  }
};

// Admin-only: Full-Swoop CSV Feature
exports.bulkUploadMembers = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No CSV file provided' });
  }

  const results = [];
  const bufferStream = new stream.PassThrough();
  bufferStream.end(req.file.buffer);

  bufferStream
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        let successCount = 0;
        let errorCount = 0;

        for (const row of results) {
          console.log('Received CSV Row:', row);
          const { name, email, role } = row;
          
          if (!name || !email) {
            errorCount++;
            continue;
          }

          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash("ChangeMe123!", salt);
          
          await db.query(
            `INSERT INTO users (name, email, password, role) 
             VALUES ($1, $2, $3, $4) 
             ON CONFLICT (email) 
             DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role`,
            [name, email, hashedPassword, role || 'member']
          );
          successCount++;
        }

        res.json({ message: 'Bulk upload completed', successCount, errorCount });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during bulk upload' });
      }
    });
};

// Admin-only: Delete user
exports.adminDeleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const check = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while deleting user' });
  }
};

// Admin-only: Interactive Bulk Delete
exports.deleteSelectedMembers = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Please provide an array of user IDs' });
  }

  try {
    const usersResult = await db.query('SELECT id, role FROM users WHERE id = ANY($1::int[])', [ids]);
    
    // Auto-exclude any admin and the current admin's own ID
    const validUsers = usersResult.rows.filter(u => u.role !== 'admin' && u.id !== req.user.id);
    const validIds = validUsers.map(u => u.id);

    const skippedAdminsCount = ids.length - validIds.length;
    let removedCount = 0;

    if (validIds.length > 0) {
      const deleteResult = await db.query('DELETE FROM users WHERE id = ANY($1::int[])', [validIds]);
      removedCount = deleteResult.rowCount;

      // Audit Log
      await db.query(
        'INSERT INTO admin_logs (admin_id, action, users_removed) VALUES ($1, $2, $3)',
        [req.user.id, 'Interactive Bulk Delete', removedCount]
      );
    }

    res.json({ message: 'Bulk delete completed', removedCount, skippedAdminsCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during interactive bulk delete' });
  }
};

// Impact Meter Feature
exports.getImpactMeter = async (req, res) => {
  try {
    const result = await db.query('SELECT COUNT(*) FROM registrations');
    res.json({ totalImpact: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching impact meter' });
  }
};

// Admin-only: Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching users' });
  }
};
