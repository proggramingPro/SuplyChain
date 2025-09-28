const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/mailer'); // Import mailer from Auth_api
require('dotenv').config();

const otpStore = {};

// Function to generate OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

//signup route
router.post('/signup', async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOtp();
    otpStore[email] = {
      otp,
      userData: { name, email, mobile, password: hashedPassword },
      expiresAt: Date.now() + 5 * 60 * 1000
    };

    // Send OTP
    try {
        await sendEmail(email, otp);
    } catch (error) {
        console.error('Error sending OTP:', error);
        delete otpStore[email];
        return res.status(500).json({ message: 'Error sending OTP' });
    }

    // Send response
    return res.status(200).json({ message: 'OTP sent to your email. Please verify to complete signup.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});


//login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Compare password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Generate token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({
            token,
            category: user.category,
            user: {
                name: user.name,
                email: user.email,
                category: user.category
            }
        });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
        });

// OTP verification route
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    const data = otpStore[email];
    if (!data) return res.status(400).json({ message: 'OTP not found' });

    if (Date.now() > data.expiresAt) {
        delete otpStore[email];
        return res.status(400).json({ message: 'OTP expired' });
    }

    if (otp !== data.otp) return res.status(400).json({ message: 'Invalid OTP' });

    try {
        // Check again if user exists (in case of race condition)
        let existingUser = await User.findOne({ email: data.userData.email });
        if (existingUser) {
            delete otpStore[email];
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = new User(data.userData);
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });

        delete otpStore[email];
         res.json({
            token,
            category: newUser.category,
            user: {
                id: newUser._id,
                name:newUser.name,
                email: newUser.email,
                category: newUser.category
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
// Export the router
