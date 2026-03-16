const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Interview = require('../models/Interview');

// Middleware to protect admin routes
const isAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: "Access Denied. God Mode locked." });
    
    // Expecting format: Bearer <SECRET_KEY>
    const token = authHeader.split(' ')[1];
    
    if (token === process.env.ADMIN_SECRET_KEY) {
        next();
    } else {
        res.status(403).json({ error: "Invalid Credentials. Intruders will be reported." });
    }
};

// 1. Verify Admin Login
router.post('/login', (req, res) => {
    const { secretKey } = req.body;
    if (secretKey === process.env.ADMIN_SECRET_KEY) {
        res.json({ success: true, token: secretKey });
    } else {
        res.status(401).json({ success: false, error: "Incorrect God Mode Key" });
    }
});

// 2. Fetch Dashboard Analytics
router.get('/stats', isAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalInterviews = await Interview.countDocuments();
        
        // Count total circulating tokens across all users
        const users = await User.find({}, 'tokens');
        const circulatingTokens = users.reduce((acc, user) => acc + (user.tokens || 0), 0);
        
        // Fetch recent interviews
        const recentInterviews = await Interview.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('userId', 'name email profileImage');

        res.json({ 
            success: true, 
            stats: { totalUsers, totalInterviews, circulatingTokens },
            recentInterviews
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

// 3. Fetch All Users
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch(err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// 4. Update User Tokens Manually (God Mode ability)
router.post('/users/:id/tokens', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { action, amount } = req.body; // action: 'add' or 'deduct'
        
        const user = await User.findById(id);
        if(!user) return res.status(404).json({ error: "User not found" });

        if (action === 'add') {
            user.tokens += parseInt(amount);
        } else if (action === 'deduct') {
            user.tokens = Math.max(0, user.tokens - parseInt(amount));
        }

        await user.save();
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ error: "Failed to update tokens" });
    }
});

module.exports = router;
