const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next) {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    // Check if Authorization header exists
    if (!authHeader) {
        return res.status(401).json({ message: 'No authorization header, access denied' });
    }
    
    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Invalid token format, must be Bearer token' });
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
    
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user from payload to request object
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('JWT Verification Error:', err.message);
        
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired, please login again' });
        }
        
        res.status(401).json({ message: 'Token is not valid' });
    }
};