const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// 1. ABSOLUTE TOP: CORS Configuration
// Using a specific origin (your Vercel URL) is often more stable than 'true'
const corsOptions = {
    origin: ['https://wdc-udaan.vercel.app', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Explicitly handle all preflight requests

// 2. Logging & Parsing
app.use((req, res, next) => {
    console.log(`${req.method} request hit at: ${req.url}`);
    next();
});
app.use(express.json());

// 3. Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// Base route for testing
app.get('/', (req, res) => {
    res.send('Backend is Alive and CORS is configured.');
});

// Impact Meter
app.get('/api/stats/impact-meter', require('./controllers/userController').getImpactMeter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
