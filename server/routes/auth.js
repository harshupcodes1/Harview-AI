const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/sync
// Syncs a Firebase user with the MongoDB database. Gives 10 free tokens if new.
router.post('/sync', async (req, res) => {
    try {
        const { firebaseUid, email, name, profileImage } = req.body;

        if (!firebaseUid || !email) {
            return res.status(400).json({ success: false, error: "Missing required fields (firebaseUid, email)" });
        }

        // Check if user already exists
        let user = await User.findOne({ firebaseUid });
        let isNewUser = false;

        if (!user) {
            // Create a new user with explicitly 10 tokens
            isNewUser = true;
            user = new User({
                firebaseUid,
                email,
                name: name || "User",
                profileImage,
                tokens: 10
            });
            await user.save();
        } else {
            // Update profile info if it has changed
            if (name) user.name = name;
            if (profileImage) user.profileImage = profileImage;
            await user.save();
        }

        return res.status(200).json({ success: true, user, isNewUser });
    } catch (error) {
        console.error("Auth Sync Error:", error);
        res.status(500).json({ success: false, error: "Server error during user sync" });
    }
});

module.exports = router;
