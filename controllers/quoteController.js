const db = require('../config/db');

exports.getQuotes = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM quotes WHERE is_active = true ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching quotes' });
  }
};

exports.createQuote = async (req, res) => {
  const { text, author, is_active } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Quote text is required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO quotes (text, author, is_active) VALUES ($1, $2, $3) RETURNING *',
      [text, author || 'Unknown', is_active !== undefined ? is_active : true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating quote' });
  }
};

exports.updateQuote = async (req, res) => {
  const { id } = req.params;
  const { text, author, is_active } = req.body;

  try {
    const result = await db.query(
      'UPDATE quotes SET text = COALESCE($1, text), author = COALESCE($2, author), is_active = COALESCE($3, is_active) WHERE id = $4 RETURNING *',
      [text, author, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating quote' });
  }
};

exports.deleteQuote = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM quotes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    res.json({ message: 'Quote deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting quote' });
  }
};
