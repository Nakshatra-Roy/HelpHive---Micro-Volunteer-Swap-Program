const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const protect = async (req, res, next) => {
    let token;
    const authHeader = req.header('Authorization');

    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            // Get token from header
            token = authHeader.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // --- THIS IS THE FIX ---
            // The user ID is inside `decoded.user.id`, not `decoded.id`.
            req.user = await User.findById(decoded.user.id).select('-password');
            // ---------------------

            // If user is not found after decoding token, it's an invalid user
            if (!req.user) {
                 return res.status(401).json({ message: 'User not found' });
            }

            next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };