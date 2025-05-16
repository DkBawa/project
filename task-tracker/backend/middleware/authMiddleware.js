// src/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');
  console.log('Auth middleware - Token received:', token ? 'Present' : 'Not present');

  // Check if no token
  if (!token) {
    console.log('Auth middleware - No token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - Token verified successfully');

    // Add user from payload
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error('Auth middleware - Token verification failed:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};