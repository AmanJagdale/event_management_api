const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const quoteRoutes = require('./routes/quoteRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://wdc-udaan.vercel.app'],
    credentials: true
}));
app.use(express.json()); // Parses incoming JSON requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quotes', quoteRoutes);

// Base route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Event/Workshop Management System API' });
});

// Impact Meter Feature
app.get('/api/stats/impact-meter', require('./controllers/userController').getImpactMeter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
