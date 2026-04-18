const express = require('express');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// 1. MANUAL CORS HANDLER (Replaces the cors library)
app.use((req, res, next) => {
    const allowedOrigins = ["https://wdc-udaan.vercel.app", "http://localhost:5173"];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        // Fallback for testing
        res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // 2. THE PREFLIGHT KILLER
    // This intercepts the 'OPTIONS' request and answers it immediately with a 200 OK.
    // This stops the browser from ever seeing a "CORS Error."
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// 3. Logging & Parsing
app.use((req, res, next) => {
    console.log(`${req.method} request hit at: ${req.url}`);
    next();
});
app.use(express.json());

// 4. Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// Base route for testing
app.get('/', (req, res) => {
    res.send('Backend is Alive - Manual CORS Active.');
});

// Impact Meter
app.get('/api/stats/impact-meter', require('./controllers/userController').getImpactMeter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});