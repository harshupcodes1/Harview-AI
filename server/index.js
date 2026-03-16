const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Load Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const interviewRoutes = require('./routes/interview');
app.use('/api/interview', interviewRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const atsRoutes = require('./routes/ats'); // New ATS route
app.use('/api/ats', atsRoutes);

const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('InterviewIQ API Server is running... 🚀');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Database Connected Successfully!'))
    .catch((err) => console.log('❌ MongoDB Connection Error: ', err));

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
