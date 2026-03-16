const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

router.post('/create-order', async (req, res) => {
    try {
        const { amount, credits, firebaseUid } = req.body;

        if (!amount || !credits || !firebaseUid) {
            return res.status(400).json({ success: false, error: "Missing required parameters." });
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).json({ success: false, error: "Razorpay order creation failed" });

        res.json({ success: true, order, credits, firebaseUid });

    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ success: false, error: "Failed to create order" });
    }
});

router.post('/verify', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, firebaseUid, credits } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment verified. Add credits to the user.
            const user = await User.findOne({ firebaseUid });
            if (!user) {
                return res.status(404).json({ success: false, error: "User not found to credit." });
            }

            user.tokens += parseInt(credits);
            await user.save();

            return res.json({ success: true, message: "Payment verified successfully", tokens: user.tokens });
        } else {
            return res.status(400).json({ success: false, error: "Invalid payment signature" });
        }
    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error during verification" });
    }
});

module.exports = router;
