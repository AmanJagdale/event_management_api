const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');


const app = express();

// Middleware
app.use((req, res, next) => {
    console.log('Server is running and hit at:', req.url);
    next();
});

app.use(cors({ origin: true, credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));
app.use(express.json()); // Parses incoming JSON requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);


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
